import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VehicleCategory } from '../types';

interface SidebarProps {
  selectedCategory: VehicleCategory | null;
  onCategorySelect: (category: VehicleCategory | null) => void;
  categoryCounts: Record<VehicleCategory, number>;
}

const getCategoryName = (category: VehicleCategory, language: 'tr' | 'en'): string => {
  const categoryNames: Record<VehicleCategory, { tr: string; en: string }> = {
    'Otomobil': { tr: 'Otomobil', en: 'Automobile' },
    'Elektrikli Araçlar': { tr: 'Elektrikli Araçlar', en: 'Electric Vehicles' },
    'Motosiklet': { tr: 'Motosiklet', en: 'Motorcycle' },
    'Kiralık Araçlar': { tr: 'Kiralık Araçlar', en: 'Rental Vehicles' },
    'Ticari Araçlar': { tr: 'Ticari Araçlar', en: 'Commercial Vehicles' },
    'Deniz Araçları': { tr: 'Deniz Araçları', en: 'Marine Vehicles' },
    'Hasarlı/Hurda Araçlar': { tr: 'Hasarlı/Hurda Araçlar', en: 'Damaged/Scrap' },
    'Arazi/SUV/Pickup': { tr: 'Arazi/SUV/Pickup', en: 'SUV/Offroad/Pickup' },
    'Karavan': { tr: 'Karavan', en: 'Caravan' }
  };
  return categoryNames[category][language];
};

const categories: VehicleCategory[] = [
  'Otomobil',
  'Elektrikli Araçlar',
  'Motosiklet',
  'Kiralık Araçlar',
  'Ticari Araçlar',
  'Deniz Araçları',
  'Hasarlı/Hurda Araçlar',
  'Arazi/SUV/Pickup',
  'Karavan'
];

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategorySelect, categoryCounts }) => {
  const { language, t } = useLanguage();
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">{t.sidebar.categories}</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.sidebar.allCategories}
          </button>

          {categories.map(category => {
            const count = categoryCounts[category] || 0;
            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                  selectedCategory === category
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{getCategoryName(category, language)}</span>
                <span className="text-sm text-gray-500">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advertisement Banner */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t.homepage.insurancePartnerships}</h4>
          <p className="text-sm mb-3">{t.homepage.insuranceDesc}</p>
          <button className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium">
            {language === 'tr' ? 'Detaylar' : 'Details'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t.homepage.expertiseServices}</h4>
          <p className="text-sm mb-3">{t.homepage.expertiseDesc}</p>
          <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
            {t.homepage.bookAppointment}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;