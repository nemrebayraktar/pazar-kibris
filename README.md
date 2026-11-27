# Pazar Kıbrıs

Lefke Avrupa Üniversitesi Yazılım Mühendisliği bölümünde, Yapay Zeka (COMP415) ve Yazılım Proje Yönetimi dersleri için hazırladığımız bir grup projesi. Kıbrıs için bir araç alım-satım sitesi. İlanlara bakılabiliyor, ilan verilebiliyor, kural tabanlı bir fiyat tahmini alınabiliyor ve KartalBot Alpha ile doğal dilde araç önerisi istenebiliyor.

Bu depodaki asıl uygulama Aralık 2025 tarihli final arayüzüdür. İlanlar, üyelik ve dosyalar Supabase üzerinden yürüyor. Fiyat tahmini ve sohbet önerileri TypeScript tarafında, kural tabanlı çalışıyor.

## Ne yapıyor

- Kategoriler: binek otomobil, ticari araç, karavan, deniz taşıtı, motosiklet ve hasarlı araç. Satılık ve kiralık ilanlar var.
- Kayıt, giriş ve profil (Supabase Auth)
- İlan ekleme, düzenleme, silme ve yönetici paneli
- Detaylı arama: marka, model, yıl, km, yakıt, vites, şehir
- Türkçe ve İngilizce arayüz
- Fiyat tahmini: yıl, km, marka, yakıt ve vites gibi özelliklere göre sezgisel bir hesap. Sonuç bir aralık olarak gösteriliyor. Raporda da yazdığı gibi bu kısım klasik bir makine öğrenmesi modeli değil.
- KartalBot Alpha: kullanıcının yazdığı cümleden anahtar kelimeleri çıkarıp mevcut ilanları filtreliyor ve sıralıyor. Örneğin aile aracı, yakıt cimrisi veya belirli bir şehir.

İlan listesi Supabase'deki `vehicles` tablosundan geliyor. Anahtarlar doldurulmazsa site derlenir ama ilanlar boş kalır.

## Kullanılan teknolojiler

- Vite, React, TypeScript, Tailwind CSS
- Supabase (PostgreSQL, kimlik doğrulama, dosya saklama)
- Fiyat ve öneri mantığı: TypeScript içinde kural tabanlı skorlama

`ml-prototype/` klasöründe ayrı bir FastAPI fiyat modeli duruyor. Bu prototip, `ml-prototype/data/used_cars.csv` içindeki 4009 ilanlık ikinci el araç verisiyle eğitildi. Sitedeki fiyat tahmini bu modeli kullanmıyor; oradaki hesap kural tabanlı.

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasına kendi Supabase proje adresini ve anon anahtarını yazın. Service role anahtarını buraya koymayın, o anahtar tarayıcıya hiç girmemeli.

Supabase tarafında `supabase/migrations/` altındaki SQL dosyalarını sırayla çalıştırın. Göçlerin içinde deneme amaçlı iki hesap da oluşturuluyor: `admin@arackibris.com` ve `user@example.com`, şifre ikisinde de `demo123`. Bunlar gerçek hesap değil, kendi projenizde isterseniz değiştirebilirsiniz.

```bash
npm run dev
```

Site varsayılan olarak `http://localhost:5173` adresinde açılır.

## Fiyat modeli prototipi

Sitedeki fiyat tahmini kural tabanlıdır ve bu modeli kullanmaz. `ml-prototype/` isteğe bağlı bir RandomForest denemesidir. Model, 4009 satırlık bir ikinci el araç ilan verisiyle eğitildi. Veride satıcı adı, e-posta veya telefon yok; ABD tarzı genel ilan alanları var (marka, yıl, mil, yakıt, vites, kaza kaydı, fiyat). Verinin orijinal kaynağı dosyalarda yazılı olmadığı için burada kaynak iddia etmiyorum.

Kullanılan özellikler: `brand`, `model_year`, `milage`, `fuel_type`, `transmission`, `accident`. Mil ve fiyat metinleri sayıya çevrildi. Eğitim/test ayrımı yüzde 80/20, `random_state=42`. Test setindeki sonuçlar:

- MAE: 20.825,86 USD
- R2: 0,1185

R2 düşük. Veride hem sıradan hem çok pahalı araçlar var, özellik seti de sınırlı. Sayıları olduğu gibi yazıyorum.

```bash
cd ml-prototype
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_model.py
uvicorn main:app --reload --port 8000
```

`POST /tahmin-et` veya `POST /predict` şu alanları alır: `brand`, `model_year`, `milage`, `fuel_type`, `transmission`, `accident`. Dönen fiyat USD cinsindendir. Eğitilmiş `.pkl` dosyası repoda yok; `train_model.py` yeniden üretir.

## Rapor ve şema

- `docs/pazar-kibris-ai-report.pdf`: COMP415 Yapay Zeka dersi raporu. Öğrenci numaraları çıkarılmıştır.
- `docs/screenshots/use-case-diagram.png`: kullanım durumu şeması
- `docs/AI_CHATBOT_KULLANIMI.md`: chatbotun anladığı örnek ifadeler

Yazılım Proje Yönetimi dersine ait ayrı bir SPMP belgesi kaynak dosyalarında yoktu, o yüzden buraya eklemedim.

## English

This is a group project for the Artificial Intelligence (COMP415) and Software Project Management courses at the European University of Lefke, Department of Software Engineering.

Pazar Kıbrıs is a vehicle marketplace for Cyprus. It supports listings across several categories (cars, commercial vehicles, caravans, sea vehicles, motorcycles, damaged vehicles), user accounts, an admin panel, and both sale and rental ads.

The two AI features described in the course report are rule-based, not a trained machine learning model:

- A heuristic price estimate from attributes such as year, mileage, brand, fuel type and gearbox.
- KartalBot Alpha, a chatbot that reads natural-language requests, filters the current listings and ranks matches.

The web app is Vite, React, TypeScript and Tailwind CSS, with Supabase for the database, authentication and image storage. Copy `.env.example` to `.env` and add your own Supabase URL and anon key. Do not put a service role key in the frontend.

The in-site price estimator is still rule-based. `ml-prototype/` is a separate FastAPI + RandomForest experiment, not wired into the web app. It was trained on `ml-prototype/data/used_cars.csv`, a 4,009-row used-car listings dataset (US-style fields, no seller contact data). No source for the CSV is claimed here, because none was recorded in the project files. Features: brand, model year, mileage, fuel type, transmission and accident history. On an 80/20 train/test split (random_state=42) the test scores were MAE 20,825.86 USD and R2 0.1185. The R2 is modest; the figures are reported as measured.

The COMP415 report is in `docs/pazar-kibris-ai-report.pdf`, with student numbers removed. A separate Software Project Management plan was not in the source materials.
