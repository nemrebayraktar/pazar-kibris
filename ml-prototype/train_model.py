import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import make_column_transformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "data" / "used_cars.csv"
MODEL_PATH = ROOT / "fiyat_modeli.pkl"
METRICS_PATH = ROOT / "metrics.json"

FEATURES = ["brand", "model_year", "milage", "fuel_type", "transmission", "accident"]
CATEGORICAL = ["brand", "fuel_type", "transmission", "accident"]
NUMERIC = ["model_year", "milage"]
TARGET = "price"


def parse_mileage(value):
    text = str(value).lower().replace(",", "").replace("mi.", "").replace("mi", "").strip()
    return pd.to_numeric(text, errors="coerce")


def parse_price(value):
    text = str(value).replace("$", "").replace(",", "").strip()
    return pd.to_numeric(text, errors="coerce")


def clean_category(value):
    if pd.isna(value):
        return "Unknown"
    text = str(value).strip()
    if text == "" or text in {"–", "-", "—", "not supported"}:
        return "Unknown"
    return text


def load_dataset(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["milage"] = df["milage"].map(parse_mileage)
    df["price"] = df["price"].map(parse_price)
    for column in ["brand", "fuel_type", "transmission", "accident"]:
        df[column] = df[column].map(clean_category)
    df = df.dropna(subset=FEATURES + [TARGET]).copy()
    df = df[(df["milage"] > 0) & (df["price"] > 0) & (df["model_year"] > 0)]
    return df[FEATURES + [TARGET]]


def main():
    print("Model eğitim süreci başlıyor...")
    df = load_dataset(DATA_PATH)
    print(f"{len(df)} satırlık temizlenmiş ilan verisi ile eğitim başlıyor.")

    X = df[FEATURES]
    y = df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = make_column_transformer(
        (OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        remainder="passthrough",
    )
    model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
    pipeline = make_pipeline(preprocessor, model)

    print("Model eğitiliyor...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    mae = float(mean_absolute_error(y_test, y_pred))
    r2 = float(r2_score(y_test, y_pred))
    metrics = {
        "rows_used": int(len(df)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "features": FEATURES,
        "mae": round(mae, 2),
        "r2": round(r2, 4),
        "random_state": 42,
        "test_size": 0.2,
        "n_estimators": 200,
    }
    print(f"Test MAE: {metrics['mae']}")
    print(f"Test R2: {metrics['r2']}")
    METRICS_PATH.write_text(json.dumps(metrics, indent=2) + "\n")

    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model '{MODEL_PATH.name}' olarak kaydedildi. Bu dosya git'e eklenmez.")


if __name__ == "__main__":
    main()
