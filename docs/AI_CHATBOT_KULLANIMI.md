# AI Chatbot 

## Genel Bakış

Chatbot, kullanıcıların doğal dilde yaptıkları aramaları anlayarak veritabanından uygun araçları bulur ve sunar.

## Özellikler

### 1. Doğal Dil İşleme
Chatbot, kullanıcıların günlük konuşma dilinde yazdıkları mesajları anlayabilir:

- "SUV araç göster"
- "Yakıt cimrisi araç arıyorum"
- "Lefkoşa'da elektrikli araç istiyorum"
- "Ucuz otomatik vites araç"
- "Mercedes veya BMW göster"

### 2. Akıllı Filtreleme
Chatbot şu kriterlere göre filtreleme yapabilir:

#### Araç Kategorisi
- SUV / Yüksek / Crossover
- Sedan / Otomobil
- Pickup / Kamyonet

#### Yakıt Türü
- Dizel
- Benzin
- Elektrik
- Hibrit

#### Vites Tipi
- Otomatik
- Manuel

#### Fiyat Aralığı
- Ucuz (500.000 TL'ye kadar)
- Uygun (700.000 TL'ye kadar)
- Orta (500.000 - 1.500.000 TL)
- Lüks (2.000.000 TL'den fazla)

#### Marka
- Mercedes-Benz, BMW, Audi, Toyota, Honda, Volkswagen, Ford, vb.

#### Şehir
- Lefkoşa
- Girne
- Mağusa

#### Motor ve Yakıt Ekonomisi
- "Yakıt cimrisi" / "Az yakan" → 1600cc'ye kadar
- "Ekonomik motor" → Küçük motor hacmi

#### Yıl
- "Yeni" / "Sıfır" → 2022 ve üzeri

#### Özel Özellikler
- VIP / Vitrin / Öne Çıkan araçlar

### 3. Akıllı Yanıtlar
Chatbot üç tür yanıt verir:

1. **Karşılama**: İlk konuşmada yardımcı öneriler
2. **Yardım**: Nasıl kullanılacağına dair bilgi
3. **Arama Sonuçları**: Bulunan araçlar ve detayları

### 4. Araç Öneri Kartları
Bulunan araçlar kartlar halinde gösterilir ve büyültülebilir.:
- Marka ve Model
- Yıl
- Yakıt Türü
- Vites Tipi
- Fiyat
- Şehir

### 5. Öneri Butonları
Her yanıt sonrası kullanıcıya hızlı erişim için öneri butonları gösterilir:
- "Başka araç göster"
- "Daha ucuz araçlar"
- "Farklı marka göster"

## Teknik Detaylar

### Dosya Yapısı
```
src/
├── services/
│   └── aiChatService.ts       # AI mantık ve veritabanı sorguları
├── components/
│   └── ChatBot.tsx            # UI bileşeni
└── types/
    └── index.ts               # Tip tanımlamaları
```

### Nasıl Çalışır?

1. **Mesaj Analizi**: Kullanıcının mesajı analiz edilir
2. **Intent Belirleme**: Ne aradığı belirlenir (karşılama, yardım veya arama)
3. **Filtre Oluşturma**: Anahtar kelimelerden SQL filtreleri oluşturulur
4. **Veritabanı Sorgusu**: Supabase'den araçlar çekilir
5. **Yanıt Oluşturma**: Doğal dil yanıtı ve araç kartları oluşturulur

### Keyword Listesi

#### Kategori Keywords
```typescript
'SUV': ['suv', 'yüksek', 'arazi', 'crossover', 'jeep', 'off-road', 'büyük']
'Otomobil': ['sedan', 'otomobil', 'araba', 'normal']
'Pickup': ['pickup', 'kamyonet', 'çalışma', 'iş']
```

#### Yakıt Keywords
```typescript
'Dizel': ['dizel', 'mazot', 'diesel']
'Benzin': ['benzin', 'benzinli']
'Elektrik': ['elektrik', 'elektrikli', 'şarj', 'tesla', 'ev']
'Hibrit': ['hibrit', 'hybrid', 'ekonomik']
```

## Örnek Kullanım Senaryoları

### Senaryo 1: Basit Arama
```
Kullanıcı: "SUV araç göster"
Bot: "Harika! SUV kriterlerine uygun 15 araç buldum!
     1. Toyota RAV4 Hybrid (2023)
        💰 1.850.000 TL
     ..."
```

### Senaryo 2: Kompleks Arama
```
Kullanıcı: "Lefkoşa'da yakıt cimrisi otomatik vites araç arıyorum"
Bot: "Harika! Lefkoşa, ekonomik motor, Otomatik kriterlerine uygun 8 araç buldum!
     1. Volkswagen Golf 1.6 TDI (2020)
        💰 650.000 TL
     ..."
```

### Senaryo 3: Marka Bazlı
```
Kullanıcı: "Mercedes veya BMW göster"
Bot: "Harika! Mercedes-Benz, BMW kriterlerine uygun 12 araç buldum!
     1. Mercedes-Benz C200 AMG (2023)
        💰 1.850.000 TL
     ..."
```

## Geliştirme Notları

### Yeni Keyword Ekleme
`aiChatService.ts` dosyasındaki keyword objelerine yeni değerler eklenebilir :

```typescript
const brandKeywords: Record<string, string[]> = {
  'Mercedes-Benz': ['mercedes', 'benz'],
  'YeniMarka': ['keyword1', 'keyword2'],  // Yeni marka ekle
};
```

### Yeni Filtre Ekleme
`analyzeUserMessage` fonksiyonuna yeni filtreler eklenebilir :

```typescript
if (lowerMessage.includes('yeni_kriter')) {
  intent.filters.yeniFiltre = true;
  intent.keywords.push('yeni kriter');
}
```

### Veritabanı Sorgusu Güncelleme
`searchVehicles` fonksiyonuna yeni sorgu koşulları ekleyebiliriz:

```typescript
if (intent.filters.yeniFiltre) {
  query = query.eq('yeni_alan', true);
}
```

## Performans

- Maksimum 10 araç gösterilir (limit)
- İlk 3 araç kart olarak detaylı gösterilir
- Geri kalan araçlar sayı olarak belirtilir
- Ortalama yanıt süresi: ~500ms

## Gelecek Geliştirmeler

1. Görsel tanıma (Araç fotoğrafı yükleyerek benzer araçlar bulma)
2. Fiyat aralığı belirtme ("500-800 bin arası")
3. Kilometre filtreleme
4. Yıl aralığı ("2020-2023 arası")
5. Çoklu şehir seçimi
6. Favori araçları kaydetme
7. Karşılaştırma özelliği
8. Sesli arama desteği


