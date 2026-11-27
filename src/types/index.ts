export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'TL' | 'USD' | 'EUR';
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engineSize: number; // Motor hacmi (cc)
  enginePower: number; // Motor gücü (hp)
  doors: number; // Kapı sayısı
  seats: number; // Koltuk sayısı
  warranty: boolean; // Garanti durumu
  exchange: boolean; // Takas kabul
  credit: boolean; // Kredi uygun
  damageRecord: boolean; // Hasar kaydı
  paintedParts: string[]; // Boyalı parçalar
  equipment: string[]; // Donanım özellikleri
  gearbox: 'Manuel' | 'Otomatik' | 'Yarı Otomatik';
  fuel: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit' | 'LPG';
  steering: 'Sol' | 'Sağ';
  color: string;
  city: string;
  category: VehicleCategory;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;
  packageType: 'Standard' | 'VIP' | 'Vitrine';
  featured: boolean;
  createdAt: Date;
  status: 'active' | 'sold' | 'pending';
  listingType: 'sale' | 'rent';
  viewCount: number;
  favoriteCount: number;
}

export type VehicleCategory = 
  | 'Otomobil'
  | 'Elektrikli Araçlar'
  | 'Motosiklet'
  | 'Kiralık Araçlar'
  | 'Ticari Araçlar'
  | 'Deniz Araçları'
  | 'Hasarlı/Hurda Araçlar'
  | 'Arazi/SUV/Pickup'
  | 'Karavan';

export interface ListingPackage {
  type: 'Standard' | 'VIP' | 'Vitrine';
  name: string;
  price: number;
  duration: number; // days
  features: string[];
}

export interface SearchFilters {
  category?: VehicleCategory;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuel?: string;
  gearbox?: string;
  city?: string;
  query?: string;
  listingType?: 'sale' | 'rent';
}