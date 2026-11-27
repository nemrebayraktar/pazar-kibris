from pathlib import Path

import joblib
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parent / "fiyat_modeli.pkl"
FEATURES = ["brand", "model_year", "milage", "fuel_type", "transmission", "accident"]

print("API sunucusu başlatılıyor...")

try:
    model = joblib.load(MODEL_PATH)
    print(f"Model '{MODEL_PATH.name}' yüklendi.")
except FileNotFoundError:
    print(f"HATA: '{MODEL_PATH.name}' bulunamadı. Önce train_model.py çalıştırın.")
    model = None
except Exception as exc:
    print(f"Model yüklenirken hata oluştu: {exc}")
    model = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CarFeatures(BaseModel):
    brand: str
    model_year: int = Field(gt=1900)
    milage: int = Field(gt=0)
    fuel_type: str
    transmission: str
    accident: str


class PredictionResponse(BaseModel):
    tahmini_fiyat: float
    currency: str = "USD"


@app.post("/tahmin-et", response_model=PredictionResponse)
@app.post("/predict", response_model=PredictionResponse)
async def predict_price(features: CarFeatures):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model dosyası yok. Önce train_model.py çalıştırın.",
        )

    input_data = pd.DataFrame(
        [
            {
                "brand": features.brand,
                "model_year": features.model_year,
                "milage": features.milage,
                "fuel_type": features.fuel_type,
                "transmission": features.transmission,
                "accident": features.accident,
            }
        ],
        columns=FEATURES,
    )
    prediction = model.predict(input_data)
    return PredictionResponse(tahmini_fiyat=round(float(prediction[0]), 2))


@app.get("/")
def read_root():
    return {
        "message": "Used car price model API",
        "model_loaded": model is not None,
        "features": FEATURES,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
