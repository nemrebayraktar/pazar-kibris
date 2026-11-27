import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { SearchFilters, VehicleCategory } from '../types';
import { brands, cities, fuelTypes, gearboxTypes } from '../data/demoData';

interface DetailedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

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

const DetailedSearch: React.FC<DetailedSearchProps> = ({ isOpen, onClose, onSearch, currentFilters }) => {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detaylı Arama</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value as VehicleCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka
              </label>
              <select
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Markalar</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Şehirler</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yıl (Min)
              </label>
              <input
                type="number"
                placeholder="2000"
                value={filters.yearMin || ''}
                onChange={(e) => handleFilterChange('yearMin', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yıl (Max)
              </label>
              <input
                type="number"
                placeholder="2024"
                value={filters.yearMax || ''}
                onChange={(e) => handleFilterChange('yearMax', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (Min TL)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (Max TL)
              </label>
              <input
                type="number"
                placeholder="9999999"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Kilometre
              </label>
              <input
                type="number"
                placeholder="200000"
                value={filters.mileageMax || ''}
                onChange={(e) => handleFilterChange('mileageMax', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yakıt Türü
              </label>
              <select
                value={filters.fuel || ''}
                onChange={(e) => handleFilterChange('fuel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Yakıt Türleri</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* Gearbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vites Türü
              </label>
              <select
                value={filters.gearbox || ''}
                onChange={(e) => handleFilterChange('gearbox', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Vites Türleri</option>
                {gearboxTypes.map(gearbox => (
                  <option key={gearbox} value={gearbox}>{gearbox}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Filtreleri Temizle
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Ara</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedSearch;