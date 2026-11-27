import React from 'react';
import { Star, Shield, Search as SearchIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Vehicle } from '../types';
import VehicleCard from './VehicleCard';

interface HomepageProps {
  featuredVehicles: Vehicle[];
  onVehicleClick?: (vehicle: Vehicle) => void;
}

const Homepage: React.FC<HomepageProps> = ({ featuredVehicles, onVehicleClick }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-8 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            {t.homepage.heroTitle}
          </h1>
          <p className="text-xl mb-6 opacity-90">
            {t.homepage.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <SearchIcon className="h-5 w-5" />
              <span>{t.homepage.searchVehicle}</span>
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              {t.homepage.postAd}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <SearchIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t.homepage.advancedSearch}</h3>
          <p className="text-gray-600">{t.homepage.advancedSearchDesc}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t.homepage.secureShopping}</h3>
          <p className="text-gray-600">{t.homepage.secureShoppingDesc}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t.homepage.premiumListings}</h3>
          <p className="text-gray-600">{t.homepage.premiumListingsDesc}</p>
        </div>
      </div>

      {/* Featured Vehicles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.homepage.featuredVehicles}</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            {t.homepage.viewAll}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onVehicleClick={onVehicleClick}
            />
          ))}
        </div>
      </div>

      {/* Partnership Banners */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{t.homepage.insurancePartnerships}</h3>
          <p className="mb-4 opacity-90">{t.homepage.insuranceDesc}</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            {t.homepage.getQuote}
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{t.homepage.expertiseServices}</h3>
          <p className="mb-4 opacity-90">{t.homepage.expertiseDesc}</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            {t.homepage.bookAppointment}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;