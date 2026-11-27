export type Language = 'tr' | 'en';

export interface Translations {
  header: {
    siteName: string;
    siteSubtitle: string;
    search: string;
    searchPlaceholder: string;
    detailedSearch: string;
    postAd: string;
    login: string;
    myListings: string;
    profileSettings: string;
    adminPanel: string;
    logout: string;
  };
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    searchVehicle: string;
    postAd: string;
    advancedSearch: string;
    advancedSearchDesc: string;
    secureShopping: string;
    secureShoppingDesc: string;
    premiumListings: string;
    premiumListingsDesc: string;
    featuredVehicles: string;
    viewAll: string;
    insurancePartnerships: string;
    insuranceDesc: string;
    getQuote: string;
    expertiseServices: string;
    expertiseDesc: string;
    bookAppointment: string;
  };
  sidebar: {
    categories: string;
    allCategories: string;
    automobile: string;
    suv: string;
    pickup: string;
    motorcycle: string;
    caravan: string;
    commercial: string;
    tractor: string;
    boat: string;
    damaged: string;
  };
  vehicle: {
    year: string;
    km: string;
    gearbox: string;
    fuel: string;
    automatic: string;
    manual: string;
    benzin: string;
    dizel: string;
    electric: string;
    hybrid: string;
    lpg: string;
    exchange: string;
    credit: string;
    warranty: string;
    damageRecord: string;
    viewDetails: string;
    contactSeller: string;
    phone: string;
    email: string;
    seller: string;
    description: string;
    specifications: string;
    equipment: string;
    location: string;
  };
  search: {
    searchResults: string;
    results: string;
    noResults: string;
    viewAllListings: string;
    sortBy: string;
    newest: string;
    priceLowHigh: string;
    priceHighLow: string;
    mileageLowHigh: string;
    yearNewOld: string;
    filters: string;
    category: string;
    brand: string;
    city: string;
    priceRange: string;
    yearRange: string;
    maxMileage: string;
    applyFilters: string;
    clearFilters: string;
  };
  listing: {
    createListing: string;
    editListing: string;
    basicInfo: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    vehicleDetails: string;
    brand: string;
    model: string;
    year: string;
    mileage: string;
    engineSize: string;
    enginePower: string;
    hp: string;
    doors: string;
    seats: string;
    gearbox: string;
    fuel: string;
    steering: string;
    color: string;
    city: string;
    features: string;
    warranty: string;
    exchange: string;
    credit: string;
    damageRecord: string;
    images: string;
    addImages: string;
    contactInfo: string;
    sellerName: string;
    phone: string;
    email: string;
    packageType: string;
    standard: string;
    vip: string;
    featured: string;
    submit: string;
    cancel: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    haveAccount: string;
    loginError: string;
    registerError: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    tl: string;
    usd: string;
    eur: string;
    gbp: string;
  };
  cities: {
    lefkosa: string;
    girne: string;
    gazimagusa: string;
    iskele: string;
    guzelyurt: string;
  };
  chatbot: {
    title: string;
    placeholder: string;
    send: string;
  };
  priceEstimator: {
    title: string;
    subtitle: string;
    calculate: string;
  };
}

export const translations: Record<Language, Translations> = {
  tr: {
    header: {
      siteName: 'PAZAR KIBRIS',
      siteSubtitle: "KKTC'nin Araç Alım Satım Platformu",
      search: 'Ara',
      searchPlaceholder: 'Araç ara...',
      detailedSearch: 'Detaylı Arama',
      postAd: 'İlan Ver',
      login: 'Giriş Yap',
      myListings: 'İlanlarım',
      profileSettings: 'Profil Ayarları',
      adminPanel: 'Admin Panel',
      logout: 'Çıkış Yap',
    },
    homepage: {
      heroTitle: "KKTC'nin En Büyük Araç Platformu",
      heroSubtitle: 'Binlerce araç ilanı arasından size en uygun olanı bulun. Güvenli alışveriş, doğrulanmış satıcılar.',
      searchVehicle: 'Araç Ara',
      postAd: 'İlan Ver',
      advancedSearch: 'Gelişmiş Arama',
      advancedSearchDesc: 'Detaylı filtreler ile istediğiniz aracı kolayca bulun',
      secureShopping: 'Güvenli Alışveriş',
      secureShoppingDesc: 'Doğrulanmış satıcılar ve güvenli ödeme sistemi',
      premiumListings: 'Premium Listeler',
      premiumListingsDesc: 'VIP ve Vitrin paketleri ile öne çıkın',
      featuredVehicles: 'Vitrin Araçları',
      viewAll: 'Tümünü Gör →',
      insurancePartnerships: 'Sigorta Ortaklıkları',
      insuranceDesc: 'Aracınız için en uygun sigorta seçenekleri',
      getQuote: 'Teklif Al',
      expertiseServices: 'Ekspertiz Hizmetleri',
      expertiseDesc: 'Profesyonel araç değerlendirmesi',
      bookAppointment: 'Randevu Al',
    },
    sidebar: {
      categories: 'Kategoriler',
      allCategories: 'Tüm Kategoriler',
      automobile: 'Otomobil',
      suv: 'SUV & Arazi',
      pickup: 'Pickup',
      motorcycle: 'Motosiklet',
      caravan: 'Karavan',
      commercial: 'Ticari Araç',
      tractor: 'Traktör',
      boat: 'Tekne',
      damaged: 'Hasarlı & Hurda',
    },
    vehicle: {
      year: 'Yıl',
      km: 'km',
      gearbox: 'Vites',
      fuel: 'Yakıt',
      automatic: 'Otomatik',
      manual: 'Manuel',
      benzin: 'Benzin',
      dizel: 'Dizel',
      electric: 'Elektrik',
      hybrid: 'Hibrit',
      lpg: 'LPG',
      exchange: 'Takas',
      credit: 'Kredi',
      warranty: 'Garanti',
      damageRecord: 'Hasar Kaydı',
      viewDetails: 'Detayları Gör',
      contactSeller: 'Satıcıyla İletişime Geç',
      phone: 'Telefon',
      email: 'E-posta',
      seller: 'Satıcı',
      description: 'Açıklama',
      specifications: 'Özellikler',
      equipment: 'Donanım',
      location: 'Konum',
    },
    search: {
      searchResults: 'Arama Sonuçları',
      results: 'sonuç',
      noResults: 'Arama kriterlerinize uygun araç bulunamadı.',
      viewAllListings: 'Tüm ilanları görüntüle',
      sortBy: 'Sırala',
      newest: 'En Yeni',
      priceLowHigh: 'Fiyat (Düşük-Yüksek)',
      priceHighLow: 'Fiyat (Yüksek-Düşük)',
      mileageLowHigh: 'Kilometre (Az-Çok)',
      yearNewOld: 'Yıl (Yeni-Eski)',
      filters: 'Filtreler',
      category: 'Kategori',
      brand: 'Marka',
      city: 'Şehir',
      priceRange: 'Fiyat Aralığı',
      yearRange: 'Yıl Aralığı',
      maxMileage: 'Maksimum Kilometre',
      applyFilters: 'Filtreleri Uygula',
      clearFilters: 'Filtreleri Temizle',
    },
    listing: {
      createListing: 'Yeni İlan Oluştur',
      editListing: 'İlanı Düzenle',
      basicInfo: 'Temel Bilgiler',
      title: 'İlan Başlığı',
      description: 'Açıklama',
      price: 'Fiyat',
      currency: 'Para Birimi',
      vehicleDetails: 'Araç Detayları',
      brand: 'Marka',
      model: 'Model',
      year: 'Yıl',
      mileage: 'Kilometre',
      engineSize: 'Motor Hacmi',
      enginePower: 'Motor Gücü',
      hp: 'HP',
      doors: 'Kapı Sayısı',
      seats: 'Koltuk Sayısı',
      gearbox: 'Vites',
      fuel: 'Yakıt Türü',
      steering: 'Direksiyon',
      color: 'Renk',
      city: 'Şehir',
      features: 'Özellikler',
      warranty: 'Garantili',
      exchange: 'Takasa Uygun',
      credit: 'Krediye Uygun',
      damageRecord: 'Hasar Kaydı Var',
      images: 'Fotoğraflar',
      addImages: 'Fotoğraf Ekle',
      contactInfo: 'İletişim Bilgileri',
      sellerName: 'Satıcı Adı',
      phone: 'Telefon',
      email: 'E-posta',
      packageType: 'Paket Tipi',
      standard: 'Standart',
      vip: 'VIP',
      featured: 'Vitrin',
      submit: 'İlanı Yayınla',
      cancel: 'İptal',
    },
    auth: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      email: 'E-posta',
      password: 'Şifre',
      name: 'Ad Soyad',
      phone: 'Telefon',
      loginButton: 'Giriş Yap',
      registerButton: 'Kayıt Ol',
      noAccount: 'Hesabınız yok mu?',
      haveAccount: 'Hesabınız var mı?',
      loginError: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
      registerError: 'Kayıt başarısız. Lütfen tekrar deneyin.',
    },
    common: {
      loading: 'Yükleniyor...',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      close: 'Kapat',
      confirm: 'Onayla',
      yes: 'Evet',
      no: 'Hayır',
      tl: 'TL',
      usd: 'USD',
      eur: 'EUR',
      gbp: 'GBP',
    },
    cities: {
      lefkosa: 'Lefkoşa',
      girne: 'Girne',
      gazimagusa: 'Gazimağusa',
      iskele: 'İskele',
      guzelyurt: 'Güzelyurt',
    },
    chatbot: {
      title: 'AI Asistan',
      placeholder: 'Bir soru sorun...',
      send: 'Gönder',
    },
    priceEstimator: {
      title: 'Araç Değer Hesaplama',
      subtitle: 'Aracınızın değerini öğrenin',
      calculate: 'Hesapla',
    },
  },
  en: {
    header: {
      siteName: 'PAZAR KIBRIS',
      siteSubtitle: "TRNC's Vehicle Trading Platform",
      search: 'Search',
      searchPlaceholder: 'Search vehicles...',
      detailedSearch: 'Detailed Search',
      postAd: 'Post Ad',
      login: 'Login',
      myListings: 'My Listings',
      profileSettings: 'Profile Settings',
      adminPanel: 'Admin Panel',
      logout: 'Logout',
    },
    homepage: {
      heroTitle: "TRNC's Largest Vehicle Platform",
      heroSubtitle: 'Find the perfect vehicle among thousands of listings. Secure shopping, verified sellers.',
      searchVehicle: 'Search Vehicle',
      postAd: 'Post Ad',
      advancedSearch: 'Advanced Search',
      advancedSearchDesc: 'Find your desired vehicle easily with detailed filters',
      secureShopping: 'Secure Shopping',
      secureShoppingDesc: 'Verified sellers and secure payment system',
      premiumListings: 'Premium Listings',
      premiumListingsDesc: 'Stand out with VIP and Featured packages',
      featuredVehicles: 'Featured Vehicles',
      viewAll: 'View All →',
      insurancePartnerships: 'Insurance Partnerships',
      insuranceDesc: 'The best insurance options for your vehicle',
      getQuote: 'Get Quote',
      expertiseServices: 'Expertise Services',
      expertiseDesc: 'Professional vehicle evaluation',
      bookAppointment: 'Book Appointment',
    },
    sidebar: {
      categories: 'Categories',
      allCategories: 'All Categories',
      automobile: 'Automobile',
      suv: 'SUV & Offroad',
      pickup: 'Pickup',
      motorcycle: 'Motorcycle',
      caravan: 'Caravan',
      commercial: 'Commercial',
      tractor: 'Tractor',
      boat: 'Boat',
      damaged: 'Damaged & Scrap',
    },
    vehicle: {
      year: 'Year',
      km: 'km',
      gearbox: 'Transmission',
      fuel: 'Fuel',
      automatic: 'Automatic',
      manual: 'Manual',
      benzin: 'Gasoline',
      dizel: 'Diesel',
      electric: 'Electric',
      hybrid: 'Hybrid',
      lpg: 'LPG',
      exchange: 'Exchange',
      credit: 'Credit',
      warranty: 'Warranty',
      damageRecord: 'Damage Record',
      viewDetails: 'View Details',
      contactSeller: 'Contact Seller',
      phone: 'Phone',
      email: 'Email',
      seller: 'Seller',
      description: 'Description',
      specifications: 'Specifications',
      equipment: 'Equipment',
      location: 'Location',
    },
    search: {
      searchResults: 'Search Results',
      results: 'results',
      noResults: 'No vehicles found matching your criteria.',
      viewAllListings: 'View all listings',
      sortBy: 'Sort by',
      newest: 'Newest',
      priceLowHigh: 'Price (Low-High)',
      priceHighLow: 'Price (High-Low)',
      mileageLowHigh: 'Mileage (Low-High)',
      yearNewOld: 'Year (New-Old)',
      filters: 'Filters',
      category: 'Category',
      brand: 'Brand',
      city: 'City',
      priceRange: 'Price Range',
      yearRange: 'Year Range',
      maxMileage: 'Max Mileage',
      applyFilters: 'Apply Filters',
      clearFilters: 'Clear Filters',
    },
    listing: {
      createListing: 'Create New Listing',
      editListing: 'Edit Listing',
      basicInfo: 'Basic Information',
      title: 'Listing Title',
      description: 'Description',
      price: 'Price',
      currency: 'Currency',
      vehicleDetails: 'Vehicle Details',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      mileage: 'Mileage',
      engineSize: 'Engine Size',
      enginePower: 'Engine Power',
      hp: 'HP',
      doors: 'Doors',
      seats: 'Seats',
      gearbox: 'Transmission',
      fuel: 'Fuel Type',
      steering: 'Steering',
      color: 'Color',
      city: 'City',
      features: 'Features',
      warranty: 'Warranty',
      exchange: 'Exchange Available',
      credit: 'Credit Available',
      damageRecord: 'Has Damage Record',
      images: 'Photos',
      addImages: 'Add Photos',
      contactInfo: 'Contact Information',
      sellerName: 'Seller Name',
      phone: 'Phone',
      email: 'Email',
      packageType: 'Package Type',
      standard: 'Standard',
      vip: 'VIP',
      featured: 'Featured',
      submit: 'Publish Listing',
      cancel: 'Cancel',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone',
      loginButton: 'Login',
      registerButton: 'Register',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      loginError: 'Login failed. Please check your credentials.',
      registerError: 'Registration failed. Please try again.',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      tl: 'TL',
      usd: 'USD',
      eur: 'EUR',
      gbp: 'GBP',
    },
    cities: {
      lefkosa: 'Nicosia',
      girne: 'Kyrenia',
      gazimagusa: 'Famagusta',
      iskele: 'Iskele',
      guzelyurt: 'Morphou',
    },
    chatbot: {
      title: 'AI Assistant',
      placeholder: 'Ask a question...',
      send: 'Send',
    },
    priceEstimator: {
      title: 'Vehicle Value Calculator',
      subtitle: 'Find out your vehicle value',
      calculate: 'Calculate',
    },
  },
};
