import React from 'react';
import { MapPin, Calendar, Gauge, Fuel, Settings, Phone, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  compact?: boolean;
  onVehicleClick?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, compact = false, onVehicleClick }) => {
  const { language, t } = useLanguage();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(price) + ' ' + currency;
  };

  const getPackageBadge = (packageType: string) => {
    switch (packageType) {
      case 'Vitrine':
        return <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Star className="h-3 w-3" />
          <span>{language === 'tr' ? 'VİTRİN' : 'FEATURED'}</span>
        </span>;
      case 'VIP':
        return <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">VIP</span>;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onVehicleClick?.(vehicle)}
      >
        <div className="flex space-x-3">
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={vehicle.title}
              className="w-20 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">{language === 'tr' ? 'Yok' : 'N/A'}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate text-sm">{vehicle.title}</h4>
            {(vehicle.brand || vehicle.model) && (
              <p className="text-xs text-gray-600 truncate">
                {vehicle.brand} {vehicle.model}
              </p>
            )}
            <p className="text-lg font-bold text-blue-600">{formatPrice(vehicle.price, vehicle.currency)}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{vehicle.year}</span>
              <span>•</span>
              <span>{vehicle.mileage.toLocaleString()} km</span>
              <span>•</span>
              <span>{vehicle.city}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => onVehicleClick?.(vehicle)}
    >
      <div className="relative">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={vehicle.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">{language === 'tr' ? 'Görsel yok' : 'No image'}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          {getPackageBadge(vehicle.packageType)}
        </div>
        {vehicle.packageType === 'Vitrine' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{vehicle.title}</h3>
        {(vehicle.brand || vehicle.model) && (
          <p className="text-sm text-gray-600 mb-2">
            {vehicle.brand} {vehicle.model}
          </p>
        )}

        <div className="mb-3">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(vehicle.price, vehicle.currency)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="h-4 w-4 text-gray-400" />
              <span>{vehicle.mileage.toLocaleString()} {t.vehicle.km}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-4 w-4 text-gray-400" />
              <span>{vehicle.gearbox}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="h-4 w-4 text-gray-400" />
              <span>{vehicle.fuel}</span>
            </div>
          </div>
          {vehicle.engineSize && (
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded">
              <span className="font-medium text-gray-700">{language === 'tr' ? 'Motor:' : 'Engine:'}</span>
              <span>{vehicle.engineSize} cc</span>
              {vehicle.enginePower && <span className="text-gray-400">•</span>}
              {vehicle.enginePower && <span>{vehicle.enginePower} {t.listing.hp}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.city}</span>
          </div>
          <span className="text-xs">
            {vehicle.createdAt.toLocaleDateString('tr-TR')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{vehicle.sellerName}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${vehicle.sellerPhone}`;
            }}
            className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Phone className="h-3 w-3" />
            <span>{language === 'tr' ? 'Ara' : 'Call'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;