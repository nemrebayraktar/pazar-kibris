import React, { useState } from 'react';
import { Calculator, TrendingUp, X } from 'lucide-react';
import { brands, fuelTypes, gearboxTypes } from '../data/demoData';

interface PriceEstimationData {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  gearbox: string;
  condition: string;
  city: string;
}

const PriceEstimator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PriceEstimationData>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    fuel: '',
    gearbox: '',
    condition: 'İyi',
    city: ''
  });
  const [estimation, setEstimation] = useState<{min: number, max: number, avg: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API çağrısı burada yapılacak - kullanıcı kendi API'sini bağlayacak
      // Örnek: const response = await fetch('/api/estimate-price', { method: 'POST', body: JSON.stringify(formData) });

      // Demo amaçlı simüle edilmiş tahmin
      await new Promise(resolve => setTimeout(resolve, 1500));

      const basePrice = 500000;
      const yearFactor = (formData.year - 2010) * 30000;
      const mileageFactor = -formData.mileage * 0.5;
      const avgPrice = Math.max(100000, basePrice + yearFactor + mileageFactor);

      setEstimation({
        min: Math.round(avgPrice * 0.85),
        max: Math.round(avgPrice * 1.15),
        avg: Math.round(avgPrice)
      });
    } catch (error) {
      console.error('Fiyat tahmini alınırken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? Number(value) : value
    }));
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Destekli Fiyat Tahmini</h3>
                <p className="text-sm text-blue-100">Aracınızın piyasa değerini anında öğrenin</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Fiyat Tahmini Al
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">AI Destekli Fiyat Tahmini</h3>
                <p className="text-sm text-blue-100">Araç bilgilerinizi girerek anlık fiyat tahmini alın</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setEstimation(null);
              }}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Marka</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white"
              >
                <option value="">Marka Seçin</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Örn: 3.20i"
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Yıl</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kilometre</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                min="0"
                placeholder="Örn: 45000"
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Yakıt Tipi</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white"
              >
                <option value="">Yakıt Seçin</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vites Tipi</label>
              <select
                name="gearbox"
                value={formData.gearbox}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border-0 focus:ring-2 focus:ring-white"
              >
                <option value="">Vites Seçin</option>
                {gearboxTypes.map(gearbox => (
                  <option key={gearbox} value={gearbox}>{gearbox}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Hesaplanıyor...</span>
                  </span>
                ) : (
                  'Fiyat Tahmini Al'
                )}
              </button>
            </div>
          </form>

          {estimation && (
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Tahmin Edilen Fiyat Aralığı
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-100 mb-1">Minimum</p>
                  <p className="text-2xl font-bold">{estimation.min.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center text-blue-600">
                  <p className="text-sm font-medium mb-1">Ortalama Değer</p>
                  <p className="text-3xl font-bold">{estimation.avg.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-100 mb-1">Maksimum</p>
                  <p className="text-2xl font-bold">{estimation.max.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 mt-4 text-center">
                * Bu tahmin AI modelimiz tarafından piyasa verilerine göre oluşturulmuştur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceEstimator;
