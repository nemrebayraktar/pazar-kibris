import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';

interface ChatResponse {
  message: string;
  vehicles?: Vehicle[];
  suggestions?: string[];
}

interface UserIntent {
  type: 'search' | 'info' | 'greeting' | 'help';
  filters: {
    category?: string[];
    fuel?: string[];
    gearbox?: string[];
    priceMin?: number;
    priceMax?: number;
    yearMin?: number;
    brand?: string[];
    city?: string[];
    engineSizeMax?: number;
    engineSizeMin?: number;
    featured?: boolean;
    bodyType?: string[];
    usageType?: string[];
    features?: string[];
    performance?: 'high' | 'medium' | 'low';
    listingType?: 'sale' | 'rent';
  };
  keywords: string[];
  userIntent?: string;
}

const categoryKeywords: Record<string, string[]> = {
  'Deniz Araçları': ['yat', 'tekne', 'deniz aracı', 'bot', 'gemi', 'deniz', 'yüzen', 'marina'],
  'Karavan': ['karavan', 'çadır', 'karavan araba', 'kamp aracı', 'mobil ev'],
  'Motosiklet': ['motosiklet', 'motor', 'motorsiklet', 'motorbike', 'bike', 'çift teker'],
  'Hasarlı/Hurda Araçlar': ['hasarlı', 'hurda', 'kazalı', 'hasar', 'kaza', 'çarpık'],
  'Hasarlı & Hurda Araçlar': ['hasarlı', 'hurda', 'kazalı', 'hasar', 'kaza', 'çarpık'],
  'Arazi/SUV/Pickup': ['suv', 'arazi', 'crossover', 'jeep', 'off-road', 'arazi aracı', 'pickup', 'kamyonet'],
  'Ticari Araçlar': ['ticari', 'ticari araç', 'çalışma aracı', 'iş aracı', 'minibüs', 'kamyonet', 'panelvan'],
  'Otomobil': ['sedan', 'otomobil', 'araba', 'normal', 'sedan tip', 'hatchback', 'coupe'],
};

const listingTypeKeywords = {
  sale: ['satılık', 'satılık araç', 'satılık araba', 'almak istiyorum', 'alacağım', 'satın almak', 'satın alacağım'],
  rent: ['kiralık', 'kiralamak istiyorum', 'kiralık araç', 'kiralık araba', 'kira', 'kiralayacağım', 'rental'],
};

const usageTypeKeywords: Record<string, string[]> = {
  'family': ['aile', 'aile arabası', 'ailem için', 'çocuklu', '7 kişilik', 'bebek', 'bebeğim', 'çocuk', 'çocuğum', 'yavru'],
  'city': ['şehir içi', 'şehir', 'park edilebilir', 'trafik', 'günlük kullanım', 'şehir içi araç', 'şehir aracı', 'şehirde kullanım', 'park etmek kolay', 'küçük araç'],
  'highway': ['uzun yol', 'otoyol', 'yolculuk', 'seyahat'],
  'business': ['profesyonel', 'prestij'],
  'sport': ['sportif araç', 'spor araba'],
  'luggage': ['bagaj', 'geniş bagaj', 'büyük bagaj', 'bol bagaj', 'bagajı geniş', 'yük', 'eşya taşıma'],
};

const fuelEconomyKeywords = [
  'yakıt cimrisi', 'yakıt cimri', 'az yakar', 'az yakan',
  'tasarruflu', 'az yakıt tüketen', 'düşük tüketim', 'az tüketim',
  'yakıt tasarrufu', 'benzin tasarrufu', 'uygun tüketim'
];

const economicKeywords = ['ekonomik', 'uygun fiyat', 'bütçeye uygun'];

const performanceKeywords = {
  high: ['güçlü', 'hızlı', 'performans', 'turbo', 'sport', 'sportif', 'v6', 'v8', 'beygir', 'hp'],
  low: ['yavaş', 'sakin', 'normal', 'standart']
};

const featureKeywords: Record<string, string[]> = {
  'sunroof': ['sunroof', 'açılır tavan', 'panoramik tavan', 'cam tavan'],
  'parking_sensors': ['park sensörü', 'sensör', 'park yardımı', 'park asistanı', 'park'],
  'leather_seats': ['deri koltuk', 'deri', 'deri döşeme', 'deri iç'],
  'cruise_control': ['hız sabitleyici', 'cruise control', 'otomatik hız'],
  'bluetooth': ['bluetooth', 'bağlantı', 'telefon bağlantısı'],
  'heated_seats': ['ısıtmalı koltuk', 'koltuk ısıtma', 'ısıtma'],
  'navigation': ['navigasyon', 'gps', 'harita'],
};

const engineSizeKeywords = {
  small: { max: 1400, keywords: ['küçük motor', '1.0', '1.2', '1.4'] },
  medium: { min: 1400, max: 2000, keywords: ['orta motor', '1.6', '1.8', '2.0'] },
  large: { min: 2000, keywords: ['büyük motor', '2.5', '3.0', 'v6', 'v8'] }
};

const fuelKeywords: Record<string, string[]> = {
  'Dizel': ['dizel', 'mazot', 'diesel'],
  'Benzin': ['benzin', 'benzinli'],
  'Elektrik': ['elektrik', 'elektrikli', 'şarj', 'tesla', 'ev'],
  'Hibrit': ['hibrit', 'hybrid', 'hibrid', 'hibrit araç', 'hybrid araç', 'yakıt tasarruflu'],
  'Hybrid': ['hibrit', 'hybrid', 'hibrid', 'hibrit araç', 'hybrid araç', 'yakıt tasarruflu'],
};

const gearboxKeywords: Record<string, string[]> = {
  'Otomatik': ['otomatik', 'automatic', 'vites', 'auto'],
  'Manuel': ['manuel', 'manual', 'düz vites'],
};

const priceKeywords = {
  'ucuz': { max: 500000 },
  'uygun': { max: 700000 },
  'orta': { min: 500000, max: 1500000 },
  'lüks': { min: 2000000 },
  'pahalı': { min: 2000000 },
};

const priceRangeKeywords = [
  { patterns: ['300bin altı', '300 bin altı', '300k altı', '300.000 altı', '300000tl altı', '300000 tl altı', '300.000tl altı'], max: 300000 },
  { patterns: ['400bin altı', '400 bin altı', '400k altı', '400.000 altı', '400000tl altı', '400000 tl altı', '400.000tl altı'], max: 400000 },
  { patterns: ['500bin altı', '500 bin altı', '500k altı', '500.000 altı', '500000tl altı', '500000 tl altı', '500.000tl altı'], max: 500000 },
  { patterns: ['600bin altı', '600 bin altı', '600k altı', '600.000 altı', '600000tl altı', '600000 tl altı', '600.000tl altı'], max: 600000 },
  { patterns: ['700bin altı', '700 bin altı', '700k altı', '700.000 altı', '700000tl altı', '700000 tl altı', '700.000tl altı'], max: 700000 },
  { patterns: ['800bin altı', '800 bin altı', '800k altı', '800.000 altı', '800000tl altı', '800000 tl altı', '800.000tl altı'], max: 800000 },
  { patterns: ['1milyon altı', '1 milyon altı', '1m altı', '1.000.000 altı', '1000000tl altı', '1000000 tl altı', '1.000.000tl altı'], max: 1000000 },
  { patterns: ['1.5milyon altı', '1.5 milyon altı', '1,5 milyon altı', '1500000tl altı', '1500000 tl altı', '1.500.000tl altı'], max: 1500000 },
  { patterns: ['2milyon altı', '2 milyon altı', '2m altı', '2.000.000 altı', '2000000tl altı', '2000000 tl altı', '2.000.000tl altı'], max: 2000000 },
];

const yearRangeKeywords = [
  { patterns: ['2000 sonrası', '2000 model ve sonrası', '2000 ve sonrası', '2000den sonra', '2000\'den sonra'], min: 2000 },
  { patterns: ['2005 sonrası', '2005 model ve sonrası', '2005 ve sonrası', '2005den sonra', '2005\'ten sonra'], min: 2005 },
  { patterns: ['2010 sonrası', '2010 model ve sonrası', '2010 ve sonrası', '2010dan sonra', '2010\'dan sonra'], min: 2010 },
  { patterns: ['2015 sonrası', '2015 model ve sonrası', '2015 ve sonrası', '2015den sonra', '2015\'ten sonra'], min: 2015 },
  { patterns: ['2018 sonrası', '2018 model ve sonrası', '2018 ve sonrası', '2018den sonra', '2018\'den sonra'], min: 2018 },
  { patterns: ['2020 sonrası', '2020 model ve sonrası', '2020 ve sonrası', '2020den sonra', '2020\'den sonra'], min: 2020 },
  { patterns: ['2022 sonrası', '2022 model ve sonrası', '2022 ve sonrası', '2022den sonra', '2022\'den sonra'], min: 2022 },
];

const brandKeywords: Record<string, string[]> = {
  'Mercedes-Benz': ['mercedes', 'benz'],
  'BMW': ['bmw', 'bimmer'],
  'Audi': ['audi'],
  'Toyota': ['toyota'],
  'Honda': ['honda'],
  'Volkswagen': ['volkswagen', 'vw', 'golf'],
  'Ford': ['ford'],
  'Nissan': ['nissan'],
  'Hyundai': ['hyundai'],
  'Kia': ['kia'],
};

const cityKeywords: Record<string, string[]> = {
  'Lefkoşa': ['lefkoşa', 'nicosia'],
  'Girne': ['girne', 'kyrenia'],
  'Magusa': ['magusa', 'mağusa', 'famagusta'],
};

function analyzeUserMessage(message: string): UserIntent {
  const lowerMessage = message.toLowerCase().trim();
  const intent: UserIntent = {
    type: 'search',
    filters: {},
    keywords: [],
  };

  if (
    lowerMessage.includes('merhaba') ||
    lowerMessage.includes('selam') ||
    lowerMessage.includes('hey') ||
    lowerMessage.includes('hi')
  ) {
    intent.type = 'greeting';
    return intent;
  }

  if (
    lowerMessage.includes('nasıl') ||
    lowerMessage.includes('yardım') ||
    lowerMessage.includes('ne yapabilir')
  ) {
    intent.type = 'help';
    return intent;
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.category) intent.filters.category = [];
      intent.filters.category.push(category);
      intent.keywords.push(category);
    }
  }

  for (const [usageType, keywords] of Object.entries(usageTypeKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.usageType) intent.filters.usageType = [];
      intent.filters.usageType.push(usageType);
      const displayName = usageType === 'family' ? 'aile arabası' :
                         usageType === 'city' ? 'şehir içi' :
                         usageType === 'highway' ? 'uzun yol' :
                         usageType === 'business' ? 'profesyonel' :
                         usageType === 'sport' ? 'sportif' :
                         usageType === 'luggage' ? 'geniş bagaj' : usageType;
      intent.keywords.push(displayName);
    }
  }

  if (economicKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent.filters.priceMax = 800000;
    intent.keywords.push('ekonomik');
    intent.userIntent = 'economic';
  }

  if (fuelEconomyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent.keywords.push('yakıt cimrisi');
    intent.userIntent = 'fuel_economy';
  }

  for (const [level, keywords] of Object.entries(performanceKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.filters.performance = level as 'high' | 'low';
      if (level === 'high') {
        intent.filters.engineSizeMin = 1600;
        intent.keywords.push('yüksek performans');
      }
    }
  }

  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.features) intent.filters.features = [];
      intent.filters.features.push(feature);
      intent.keywords.push(feature.replace('_', ' '));
    }
  }

  for (const [size, config] of Object.entries(engineSizeKeywords)) {
    if (config.keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (config.max) intent.filters.engineSizeMax = config.max;
      if (config.min) intent.filters.engineSizeMin = config.min;
      intent.keywords.push(`${size} motor`);
    }
  }

  for (const [fuel, keywords] of Object.entries(fuelKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.fuel) intent.filters.fuel = [];
      intent.filters.fuel.push(fuel);
      intent.keywords.push(fuel);
    }
  }

  for (const [gearbox, keywords] of Object.entries(gearboxKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.gearbox) intent.filters.gearbox = [];
      intent.filters.gearbox.push(gearbox);
      intent.keywords.push(gearbox);
    }
  }

  for (const priceRange of priceRangeKeywords) {
    if (priceRange.patterns.some(pattern => lowerMessage.includes(pattern))) {
      intent.filters.priceMax = priceRange.max;
      const formattedPrice = priceRange.max >= 1000000
        ? `${(priceRange.max / 1000000).toFixed(1)}M`
        : `${priceRange.max / 1000}K`;
      intent.keywords.push(`${formattedPrice} TL altı`);
      break;
    }
  }

  for (const yearRange of yearRangeKeywords) {
    if (yearRange.patterns.some(pattern => lowerMessage.includes(pattern))) {
      intent.filters.yearMin = yearRange.min;
      intent.keywords.push(`${yearRange.min} ve üzeri`);
      break;
    }
  }

  for (const [priceRange, values] of Object.entries(priceKeywords)) {
    if (lowerMessage.includes(priceRange)) {
      if (values.min) intent.filters.priceMin = values.min;
      if (values.max && !intent.filters.priceMax) intent.filters.priceMax = values.max;
      if (!intent.keywords.some(k => k.includes('TL altı'))) {
        intent.keywords.push(priceRange);
      }
    }
  }

  for (const [listingType, keywords] of Object.entries(listingTypeKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.filters.listingType = listingType as 'sale' | 'rent';
      intent.keywords.push(listingType === 'sale' ? 'satılık' : 'kiralık');
      break;
    }
  }

  for (const [brand, keywords] of Object.entries(brandKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.brand) intent.filters.brand = [];
      intent.filters.brand.push(brand);
      intent.keywords.push(brand);
    }
  }

  for (const [city, keywords] of Object.entries(cityKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!intent.filters.city) intent.filters.city = [];
      intent.filters.city.push(city);
      intent.keywords.push(city);
    }
  }

  if (
    !intent.filters.yearMin &&
    (lowerMessage.includes('yeni') ||
    lowerMessage.includes('sıfır') ||
    lowerMessage.includes('2023') ||
    lowerMessage.includes('2024') ||
    lowerMessage.includes('2025'))
  ) {
    intent.filters.yearMin = 2022;
    intent.keywords.push('yeni model');
  }

  if (
    lowerMessage.includes('vip') ||
    lowerMessage.includes('vitrin') ||
    lowerMessage.includes('öne çıkan') ||
    lowerMessage.includes('özel')
  ) {
    intent.filters.featured = true;
    intent.keywords.push('öne çıkan');
  }

  if (intent.filters.usageType?.includes('family')) {
    if (!intent.filters.category) intent.filters.category = [];
    if (!intent.filters.category.includes('Arazi/SUV/Pickup')) {
      intent.filters.category.push('Arazi/SUV/Pickup');
    }
    intent.userIntent = 'family_car';
  }

  if (intent.filters.usageType?.includes('luggage')) {
    if (!intent.filters.category) intent.filters.category = [];
    if (!intent.filters.category.includes('Arazi/SUV/Pickup')) {
      intent.filters.category.push('Arazi/SUV/Pickup');
    }
    if (!intent.filters.category.includes('Ticari Araçlar')) {
      intent.filters.category.push('Ticari Araçlar');
    }
    intent.keywords.push('geniş bagaj');
    intent.userIntent = 'luggage_space';
  }

  if (intent.filters.usageType?.includes('city')) {
    if (!intent.filters.category) intent.filters.category = [];
    if (!intent.filters.category.includes('Otomobil')) {
      intent.filters.category.push('Otomobil');
    }
    intent.filters.engineSizeMax = 1600;
    intent.userIntent = 'city_car';
  }

  if (intent.filters.usageType?.includes('highway')) {
    if (!intent.filters.category) intent.filters.category = [];
    if (!intent.filters.category.includes('Otomobil')) {
      intent.filters.category.push('Otomobil');
    }
    if (!intent.filters.category.includes('Arazi/SUV/Pickup')) {
      intent.filters.category.push('Arazi/SUV/Pickup');
    }
    intent.filters.engineSizeMin = 1600;
    intent.userIntent = 'highway_car';
  }

  if (lowerMessage.includes('yüksek') && !lowerMessage.includes('performans')) {
    if (!intent.filters.category) intent.filters.category = [];
    if (!intent.filters.category.includes('Arazi/SUV/Pickup')) {
      intent.filters.category.push('Arazi/SUV/Pickup');
    }
    intent.keywords.push('yüksek araç');
    intent.userIntent = 'high_vehicle';
  }

  return intent;
}

async function searchVehicles(intent: UserIntent): Promise<Vehicle[]> {
  try {
    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (intent.userIntent === 'fuel_economy' || intent.userIntent === 'economic') {
      query = query.in('category', ['Otomobil', 'Arazi/SUV/Pickup', 'Elektrikli Araçlar']);
    } else if (intent.filters.category && intent.filters.category.length > 0) {
      query = query.in('category', intent.filters.category);
    }

    if (intent.filters.fuel && intent.filters.fuel.length > 0) {
      query = query.in('fuel', intent.filters.fuel);
    }

    if (intent.filters.gearbox && intent.filters.gearbox.length > 0) {
      query = query.in('gearbox', intent.filters.gearbox);
    }

    if (intent.filters.brand && intent.filters.brand.length > 0) {
      query = query.in('brand', intent.filters.brand);
    }

    if (intent.filters.city && intent.filters.city.length > 0) {
      query = query.in('city', intent.filters.city);
    }

    if (intent.filters.listingType) {
      query = query.eq('listing_type', intent.filters.listingType);
    }

    if (intent.filters.priceMin) {
      query = query.gte('price', intent.filters.priceMin);
    }

    if (intent.filters.priceMax) {
      query = query.lte('price', intent.filters.priceMax);
    }

    if (intent.filters.yearMin) {
      query = query.gte('year', intent.filters.yearMin);
    }

    if (intent.filters.engineSizeMax) {
      query = query.lte('engine_size', intent.filters.engineSizeMax).gt('engine_size', 0);
    }

    if (intent.filters.engineSizeMin) {
      query = query.gte('engine_size', intent.filters.engineSizeMin);
    }

    if (intent.filters.featured) {
      query = query.eq('featured', true);
    }

    query = query.limit(20);

    const { data, error } = await query;

    if (error) {
      console.error('Araç arama hatası:', error);
      return [];
    }

    let results = data as Vehicle[];

    if (intent.filters.features && intent.filters.features.length > 0) {
      results = results.filter(vehicle => {
        const description = (vehicle.description || '').toLowerCase();
        const equipment = (vehicle.equipment as any) || [];
        return intent.filters.features?.some(feature => {
          const featureName = feature.replace('_', ' ');
          return description.includes(featureName) ||
                 (Array.isArray(equipment) && equipment.some(e =>
                   typeof e === 'string' && e.toLowerCase().includes(featureName)
                 ));
        });
      });
    }

    if (intent.userIntent === 'fuel_economy' || intent.userIntent === 'economic') {
      results = results.filter(vehicle => {
        const validCategories = ['Otomobil', 'Arazi/SUV/Pickup', 'Elektrikli Araçlar'];
        return validCategories.includes(vehicle.category);
      });

      results.sort((a, b) => {
        const scoreA = calculateFuelEconomyScore(a);
        const scoreB = calculateFuelEconomyScore(b);
        return scoreB - scoreA;
      });
    }

    if (intent.userIntent === 'family_car' || intent.userIntent === 'luggage_space') {
      results.sort((a, b) => {
        const scoreA = calculateFamilyCarScore(a);
        const scoreB = calculateFamilyCarScore(b);
        return scoreB - scoreA;
      });
    }

    if (intent.userIntent === 'city_car') {
      results.sort((a, b) => {
        const scoreA = calculateCityCarScore(a);
        const scoreB = calculateCityCarScore(b);
        return scoreB - scoreA;
      });
    }

    if (intent.userIntent === 'highway_car') {
      results.sort((a, b) => {
        const scoreA = calculateHighwayCarScore(a);
        const scoreB = calculateHighwayCarScore(b);
        return scoreB - scoreA;
      });
    }

    if (intent.filters.performance === 'high') {
      results.sort((a, b) => (b.engine_size || 0) - (a.engine_size || 0));
    }

    return results.slice(0, 10);
  } catch (error) {
    console.error('Araç arama hatası:', error);
    return [];
  }
}

function calculateFuelEconomyScore(vehicle: Vehicle): number {
  let score = 0;

  if (vehicle.fuel === 'Elektrik') score += 100;
  else if (vehicle.fuel === 'Hibrit' || vehicle.fuel === 'Hybrid') score += 80;
  else if (vehicle.fuel === 'Dizel') score += 40;
  else score += 20;

  const engineSize = vehicle.engine_size || 0;
  if (engineSize > 0 && engineSize <= 1200) score += 50;
  else if (engineSize <= 1400) score += 40;
  else if (engineSize <= 1600) score += 30;
  else if (engineSize <= 1800) score += 20;

  if (vehicle.year >= 2020) score += 20;
  else if (vehicle.year >= 2018) score += 10;

  const price = typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price;
  if (price < 500000) score += 30;
  else if (price < 700000) score += 20;
  else if (price < 1000000) score += 10;

  return score;
}

function calculateFamilyCarScore(vehicle: Vehicle): number {
  let score = 0;

  if (vehicle.category === 'Arazi/SUV/Pickup') score += 50;
  if (vehicle.category === 'Ticari Araçlar') score += 30;

  const engineSize = vehicle.engine_size || 0;
  if (engineSize >= 1600 && engineSize <= 2000) score += 30;

  if (vehicle.year >= 2018) score += 20;

  if (vehicle.gearbox === 'Otomatik') score += 20;

  if (vehicle.seats && vehicle.seats >= 5) score += 25;

  const description = (vehicle.description || '').toLowerCase();
  if (description.includes('geniş') || description.includes('konfor')) score += 20;
  if (description.includes('güvenlik')) score += 15;
  if (description.includes('bagaj')) score += 10;

  return score;
}

function calculateCityCarScore(vehicle: Vehicle): number {
  let score = 0;

  if (vehicle.category === 'Otomobil') score += 50;

  const engineSize = vehicle.engine_size || 0;
  if (engineSize > 0 && engineSize <= 1200) score += 50;
  else if (engineSize <= 1400) score += 40;
  else if (engineSize <= 1600) score += 30;

  if (vehicle.fuel === 'Elektrik') score += 40;
  else if (vehicle.fuel === 'Hibrit' || vehicle.fuel === 'Hybrid') score += 30;
  else if (vehicle.fuel === 'Benzin') score += 20;

  if (vehicle.year >= 2020) score += 20;
  else if (vehicle.year >= 2018) score += 10;

  const price = typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price;
  if (price < 500000) score += 20;
  else if (price < 700000) score += 15;

  const description = (vehicle.description || '').toLowerCase();
  if (description.includes('park') || description.includes('kompakt') || description.includes('küçük')) score += 15;

  return score;
}

function calculateHighwayCarScore(vehicle: Vehicle): number {
  let score = 0;

  if (vehicle.category === 'Arazi/SUV/Pickup') score += 30;
  if (vehicle.category === 'Otomobil') score += 40;

  const engineSize = vehicle.engine_size || 0;
  if (engineSize >= 1800 && engineSize <= 2200) score += 50;
  else if (engineSize >= 1600 && engineSize <= 2500) score += 40;

  if (vehicle.gearbox === 'Otomatik') score += 30;

  if (vehicle.fuel === 'Dizel') score += 30;
  else if (vehicle.fuel === 'Hibrit' || vehicle.fuel === 'Hybrid') score += 25;

  if (vehicle.year >= 2020) score += 20;
  else if (vehicle.year >= 2018) score += 10;

  const description = (vehicle.description || '').toLowerCase();
  if (description.includes('konfor') || description.includes('cruise') || description.includes('hız sabitleyici')) score += 20;
  if (description.includes('ses yalıtım') || description.includes('sessiz')) score += 15;

  return score;
}

function generateResponse(intent: UserIntent, vehicles: Vehicle[]): ChatResponse {
  if (intent.type === 'greeting') {
    return {
      message: 'Merhaba! 👋 Size nasıl yardımcı olabilirim? Araç mı arıyorsunuz? Örneğin:\n\n• "Yakıt cimrisi bir SUV arıyorum"\n• "Aile arabası lazım"\n• "Yüksek araç göster"\n• "Şehir içi kullanım için araç"\n• "Uzun yol için konforlu araç"',
      suggestions: [
        'Yakıt cimrisi araç',
        'Aile arabası',
        'Yüksek araç göster',
        'Şehir içi araç'
      ],
    };
  }

  if (intent.type === 'help') {
    return {
      message: 'Size araç bulmanızda yardımcı olabilirim! 🚗\n\nŞunları sorabilirsiniz:\n\n• Yakıt tüketimi (yakıt cimrisi, ekonomik)\n• Araç tipi (SUV, sedan, hatchback)\n• Kullanım amacı (aile, şehir içi, uzun yol)\n• Motor hacmi (küçük, büyük motor)\n• Performans (güçlü, sportif)\n• Fiyat (ucuz, orta, lüks)\n• Özellikler (deri koltuk, park sensörü, sunroof)',
      suggestions: [
        'Yakıt cimrisi araç',
        'Aile arabası',
        'Yüksek araç',
        'Güçlü motor'
      ],
    };
  }

  if (vehicles.length === 0) {
    const searchCriteria = intent.keywords.join(', ') || 'belirttiğiniz kriterlere';

    let customMessage = `Üzgünüm, ${searchCriteria} uygun araç bulamadım. 😔\n\n`;

    if (intent.userIntent === 'fuel_economy') {
      customMessage += 'Yakıt cimrisi araç aramanızı anlıyorum. Belki kriterleri biraz genişletebiliriz?\n\n';
    } else if (intent.userIntent === 'family_car' || intent.userIntent === 'luggage_space') {
      customMessage += 'Aile arabası ve geniş bagaj aramanızı anlıyorum. Belki farklı bir kategori veya fiyat aralığı deneyebiliriz?\n\n';
    } else if (intent.userIntent === 'high_vehicle') {
      customMessage += 'Yüksek araç aramanızı anlıyorum. SUV ve crossover araçlarımıza bakabilirsiniz.\n\n';
    } else if (intent.userIntent === 'city_car') {
      customMessage += 'Şehir içi kullanım için araç aramanızı anlıyorum. Belki farklı motor hacmi veya fiyat aralığı deneyebiliriz?\n\n';
    } else if (intent.userIntent === 'highway_car') {
      customMessage += 'Uzun yol için araç aramanızı anlıyorum. Belki farklı kategori veya fiyat aralığı deneyebiliriz?\n\n';
    }

    customMessage += 'Başka bir arama yapmak ister misiniz?';

    return {
      message: customMessage,
      suggestions: [
        'Tüm SUV araçları göster',
        'Ekonomik araçlar',
        'Yeni araçlar',
        'Öne çıkan araçlar'
      ],
    };
  }

  const criteriaText = intent.keywords.length > 0
    ? `${intent.keywords.join(', ')} kriterlerine`
    : 'aramanıza';

  let message = '';

  if (intent.userIntent === 'economic') {
    message = `Harika! Ekonomik ${vehicles.length} araç buldum! 💰✨\n\nBu araçlar hem uygun fiyat hem de düşük yakıt tüketimi için seçildi:\n\n`;
  } else if (intent.userIntent === 'fuel_economy') {
    message = `Harika! Yakıt cimrisi ${vehicles.length} araç buldum! ⛽✨\n\nBu araçlar düşük yakıt tüketimi ve ekonomik kullanım için seçildi:\n\n`;
  } else if (intent.userIntent === 'family_car') {
    message = `Mükemmel! Aileniz için ${vehicles.length} uygun araç buldum! 👨‍👩‍👧‍👦🚗\n\nBu araçlar geniş iç hacim, konfor ve güvenlik açısından öne çıkıyor:\n\n`;
  } else if (intent.userIntent === 'luggage_space') {
    message = `Harika! Geniş bagajlı ${vehicles.length} araç buldum! 🚗💼\n\nBu araçlar bebeğiniz ve eşyalarınız için geniş bagaj alanı sunuyor:\n\n`;
  } else if (intent.userIntent === 'high_vehicle') {
    message = `Süper! ${vehicles.length} yüksek araç buldum! 🚙\n\nBu araçlar yüksek sürüş pozisyonu ve arazi kabiliyeti sunuyor:\n\n`;
  } else if (intent.userIntent === 'city_car') {
    message = `Harika! Şehir içi kullanım için ${vehicles.length} araç buldum! 🏙️🚗\n\nBu araçlar küçük boyutları ve kolay park edilebilir yapılarıyla öne çıkıyor:\n\n`;
  } else if (intent.userIntent === 'highway_car') {
    message = `Mükemmel! Uzun yol için ${vehicles.length} konforlu araç buldum! 🛣️✨\n\nBu araçlar uzun yolculuklarda konfor ve performans sağlıyor:\n\n`;
  } else {
    message = `Harika! ${criteriaText} uygun ${vehicles.length} araç buldum! 🎉\n\n`;
  }

  if (vehicles.length === 1) {
    const v = vehicles[0];
    message += `📌 **${v.brand} ${v.model}**\n`;
    message += `💰 Fiyat: ${v.price.toLocaleString('tr-TR')} ${v.currency}\n`;
    message += `📅 Yıl: ${v.year}\n`;
    message += `⛽ Yakıt: ${v.fuel}`;
    if (v.engine_size) message += ` (${v.engine_size}cc)`;
    message += `\n⚙️ Vites: ${v.gearbox}\n`;
    message += `📍 Şehir: ${v.city}\n`;
  } else if (vehicles.length <= 3) {
    vehicles.forEach((v, index) => {
      message += `\n${index + 1}. **${v.brand} ${v.model}** (${v.year})\n`;
      message += `   💰 ${v.price.toLocaleString('tr-TR')} ${v.currency}\n`;
      message += `   ⛽ ${v.fuel}`;
      if (v.engine_size) message += ` (${v.engine_size}cc)`;
      message += ` • ⚙️ ${v.gearbox} • 📍 ${v.city}\n`;
    });
  } else {
    message += `İşte en uygun 3 öneri:\n`;
    vehicles.slice(0, 3).forEach((v, index) => {
      message += `\n${index + 1}. **${v.brand} ${v.model}** (${v.year})\n`;
      message += `   💰 ${v.price.toLocaleString('tr-TR')} ${v.currency}\n`;
      message += `   ⛽ ${v.fuel}`;
      if (v.engine_size) message += ` (${v.engine_size}cc)`;
      message += ` • ⚙️ ${v.gearbox} • 📍 ${v.city}\n`;
    });
    message += `\n\n✨ Ve ${vehicles.length - 3} araç daha! Aşağıda tüm araçları görebilirsiniz.`;
  }

  const suggestions = [];
  if (intent.userIntent === 'economic') {
    suggestions.push('Daha ucuz olanlar', 'Elektrikli araçlar', 'Yeni model', 'Otomatik vitesli');
  } else if (intent.userIntent === 'fuel_economy') {
    suggestions.push('Elektrikli araçlar', 'Hibrit araçlar', 'Daha ucuz olanlar', 'Yeni model araçlar');
  } else if (intent.userIntent === 'family_car') {
    suggestions.push('Daha geniş araçlar', 'Otomatik vitesli', 'Yeni model', 'Farklı marka');
  } else if (intent.userIntent === 'luggage_space') {
    suggestions.push('SUV araçlar', 'Ticari araçlar', 'Otomatik vitesli', 'Daha ucuz olanlar');
  } else if (intent.userIntent === 'high_vehicle') {
    suggestions.push('Daha güçlü motor', 'Otomatik vites', 'Yeni model', 'Farklı marka');
  } else if (intent.userIntent === 'city_car') {
    suggestions.push('Küçük motorlu', 'Elektrikli araçlar', 'Yeni model', 'Daha ucuz olanlar');
  } else if (intent.userIntent === 'highway_car') {
    suggestions.push('Otomatik vitesli', 'Dizel araçlar', 'Konforlu araçlar', 'Yeni model');
  } else {
    suggestions.push('Başka araç göster', 'Daha ucuz araçlar', 'Farklı marka göster', 'Elektrikli araçlar');
  }

  return {
    message,
    vehicles,
    suggestions,
  };
}

export async function processUserMessage(message: string): Promise<ChatResponse> {
  const intent = analyzeUserMessage(message);

  if (intent.type === 'greeting' || intent.type === 'help') {
    return generateResponse(intent, []);
  }

  const vehicles = await searchVehicles(intent);
  return generateResponse(intent, vehicles);
}
