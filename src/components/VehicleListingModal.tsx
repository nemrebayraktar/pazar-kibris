import React, { useState } from 'react';
import { X, Upload, Car, CreditCard } from 'lucide-react';
import { VehicleCategory, ListingPackage } from '../types';
import { brands, cities, colors, fuelTypes, gearboxTypes } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface VehicleListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listing: any) => void;
}

const listingPackages: ListingPackage[] = [
  {
    type: 'Standard',
    name: 'Standart İlan',
    price: 50,
    duration: 30,
    features: ['30 gün yayında kalır', 'Temel görünürlük', 'Standart sıralama']
  },
  {
    type: 'VIP',
    name: 'VIP İlan',
    price: 100,
    duration: 45,
    features: ['45 gün yayında kalır', 'Yüksek görünürlük', 'Öncelikli sıralama', 'VIP rozeti']
  },
  {
    type: 'Vitrine',
    name: 'Vitrin İlan',
    price: 200,
    duration: 60,
    features: ['60 gün yayında kalır', 'Anasayfada gösterim', 'En üst sıralama', 'Vitrin rozeti', 'Özel tasarım']
  }
];

const categories: { key: VehicleCategory; name: string }[] = [
  { key: 'Otomobil', name: 'Otomobil' },
  { key: 'Elektrikli Araçlar', name: 'Elektrikli Araçlar' },
  { key: 'Motosiklet', name: 'Motosiklet' },
  { key: 'Kiralık Araçlar', name: 'Kiralık Araçlar' },
  { key: 'Ticari Araçlar', name: 'Ticari Araçlar' },
  { key: 'Deniz Araçları', name: 'Deniz Araçları' },
  { key: 'Hasarlı/Hurda Araçlar', name: 'Hasarlı/Hurda Araçlar' },
  { key: 'Arazi/SUV/Pickup', name: 'Arazi/SUV/Pickup' },
  { key: 'Karavan', name: 'Karavan' }
];

const VehicleListingModal: React.FC<VehicleListingModalProps> = ({ isOpen, onClose, onListingCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ListingPackage>(listingPackages[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'TL',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    engineSize: '',
    enginePower: '',
    doors: '4',
    seats: '5',
    warranty: false,
    exchange: false,
    credit: false,
    damageRecord: false,
    paintedParts: [] as string[],
    equipment: [] as string[],
    gearbox: '',
    fuel: '',
    steering: 'Sol',
    color: '',
    city: '',
    category: '' as VehicleCategory,
    listingType: 'sale' as 'sale' | 'rent',
    images: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !user) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.slice(0, 10 - formData.images.length).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('vehicle-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          return null;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];

      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...validUrls].slice(0, 10)
        }));
        console.log(`${validUrls.length} fotoğraf başarıyla yüklendi:`, validUrls);
      }

      if (validUrls.length < files.length) {
        alert(`${files.length - validUrls.length} fotoğraf yüklenemedi.`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting vehicle with images:', formData.images);

      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseInt(formData.price),
            currency: formData.currency,
            brand: formData.brand,
            model: formData.model,
            year: parseInt(formData.year),
            mileage: parseInt(formData.mileage),
            engine_size: parseInt(formData.engineSize),
            engine_power: parseInt(formData.enginePower),
            doors: parseInt(formData.doors),
            seats: parseInt(formData.seats),
            warranty: formData.warranty,
            exchange: formData.exchange,
            credit: formData.credit,
            damage_record: formData.damageRecord,
            painted_parts: formData.paintedParts,
            equipment: formData.equipment,
            gearbox: formData.gearbox,
            fuel: formData.fuel,
            steering: formData.steering,
            color: formData.color,
            city: formData.city,
            category: formData.category,
            listing_type: formData.listingType,
            images: formData.images.length > 0 ? formData.images : ['https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg'],
            seller_id: user.id,
            seller_name: user.name,
            seller_phone: user.phone || '+90 533 000 0000',
            seller_email: user.email,
            package_type: selectedPackage.type,
            featured: selectedPackage.type === 'Vitrine',
            status: 'active'
          }
        ])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Vehicle created successfully:', data);

      setIsSubmitting(false);
      alert(`İlan başarıyla oluşturuldu! ${selectedPackage.name} paketi seçildi.`);

      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'TL',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        engineSize: '',
        enginePower: '',
        doors: '4',
        seats: '5',
        warranty: false,
        exchange: false,
        credit: false,
        damageRecord: false,
        paintedParts: [],
        equipment: [],
        gearbox: '',
        fuel: '',
        steering: 'Sol',
        color: '',
        city: '',
        category: '' as VehicleCategory,
        listingType: 'sale' as 'sale' | 'rent',
        images: []
      });
      setStep(1);

      if (onListingCreated) {
        onListingCreated();
      }

      onClose();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? 'Araç Bilgileri' : step === 2 ? 'Paket Seçimi' : 'Ödeme'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Vehicle Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlan Başlığı
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: 2023 BMW 3 Serisi 320i"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlan Tipi
                  </label>
                  <select
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="sale">Satılık</option>
                    <option value="rent">Kiralık</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Marka Seçin</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Model"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yıl
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2023"
                    min="1990"
                    max="2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="850000"
                      required
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="TL">TL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometre
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motor Hacmi (cc)
                  </label>
                  <input
                    type="number"
                    name="engineSize"
                    value={formData.engineSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motor Gücü (hp)
                  </label>
                  <input
                    type="number"
                    name="enginePower"
                    value={formData.enginePower}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kapı Sayısı
                  </label>
                  <select
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="2">2 Kapı</option>
                    <option value="3">3 Kapı</option>
                    <option value="4">4 Kapı</option>
                    <option value="5">5 Kapı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koltuk Sayısı
                  </label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="2">2 Kişilik</option>
                    <option value="4">4 Kişilik</option>
                    <option value="5">5 Kişilik</option>
                    <option value="7">7 Kişilik</option>
                    <option value="8">8 Kişilik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vites
                  </label>
                  <select
                    name="gearbox"
                    value={formData.gearbox}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Vites Seçin</option>
                    {gearboxTypes.map(gearbox => (
                      <option key={gearbox} value={gearbox}>{gearbox}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yakıt
                  </label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Yakıt Seçin</option>
                    {fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renk
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Renk Seçin</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Durum Bilgileri
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="warranty"
                        checked={formData.warranty}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Garantili</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="exchange"
                        checked={formData.exchange}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Takas Kabul</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="credit"
                        checked={formData.credit}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Kredi Uygun</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="damageRecord"
                        checked={formData.damageRecord}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Hasar Kaydı Var</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Aracınız hakkında detaylı bilgi verin..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotoğraflar (Maksimum 10 adet)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading || formData.images.length >= 10}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`${isUploading || formData.images.length >= 10 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-blue-600 hover:text-blue-700'} font-medium`}
                    >
                      {isUploading ? 'Yükleniyor...' : 'Bilgisayardan Fotoğraf Yükle'}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, JPEG formatları desteklenir (Maks. 10MB)
                    </p>
                    {formData.images.length > 0 && (
                      <p className="text-sm text-blue-600 mt-2">
                        {formData.images.length} / 10 fotoğraf eklendi
                      </p>
                    )}
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={isUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Fotoğraflar yükleniyor...' : 'Devam Et'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Package Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {listingPackages.map((pkg) => (
                  <div
                    key={pkg.type}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPackage.type === pkg.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-4">
                        {pkg.price} TL
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {pkg.duration} gün
                      </div>
                      <ul className="text-sm space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ödemeye Geç
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Paket:</span>
                    <span className="font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Süre:</span>
                    <span>{selectedPackage.duration} gün</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Toplam:</span>
                    <span>{selectedPackage.price} TL</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Ödeme Bilgileri</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Gerçek bir uygulamada burada kredi kartı bilgileri alınır ve ödeme işlemi gerçekleştirilir.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{isSubmitting ? 'İlan Oluşturuluyor...' : 'İlanı Oluştur'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleListingModal;