import React, { useState } from 'react';
import { X, MapPin, Calendar, Gauge, Fuel, Settings, Phone, Mail, Heart, Share2, AlertTriangle, CheckCircle, Car, Cog, Shield, CreditCard } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!isOpen || !vehicle) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ' + currency;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.title,
        text: `${vehicle.title} - ${formatPrice(vehicle.price, vehicle.currency)}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Burada favorilere ekleme/çıkarma işlemi yapılabilir
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">{vehicle.title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Paylaş"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleFavorite}
              className={`p-2 transition-colors ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              title="Favorilere Ekle"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sol Taraf - Resimler */}
            <div>
              <div className="relative mb-4">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={vehicle.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      disabled={currentImageIndex === 0}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(vehicle.images.length - 1, currentImageIndex + 1))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      disabled={currentImageIndex === vehicle.images.length - 1}
                    >
                      →
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnail Images */}
              {vehicle.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {vehicle.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${vehicle.title} ${index + 1}`}
                      className={`w-full h-16 object-cover rounded cursor-pointer border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sağ Taraf - Detaylar */}
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(vehicle.price, vehicle.currency)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.city}</span>
                  </span>
                  <span>{vehicle.viewCount} görüntülenme</span>
                  <span>{vehicle.favoriteCount} favori</span>
                </div>
              </div>

              {/* Temel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Temel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {vehicle.brand && (
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Marka:</span>
                      <span className="font-medium">{vehicle.brand}</span>
                    </div>
                  )}
                  {vehicle.model && (
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{vehicle.model}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Yıl:</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Kilometre:</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Vites:</span>
                    <span className="font-medium">{vehicle.gearbox}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Yakıt:</span>
                    <span className="font-medium">{vehicle.fuel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cog className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Motor Hacmi:</span>
                    <span className="font-medium">{vehicle.engineSize} cc</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cog className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Motor Gücü:</span>
                    <span className="font-medium">{vehicle.enginePower} hp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Kapı Sayısı:</span>
                    <span className="font-medium">{vehicle.doors}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Koltuk Sayısı:</span>
                    <span className="font-medium">{vehicle.seats}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Renk:</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Direksiyon:</span>
                    <span className="font-medium">{vehicle.steering}</span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Durum Bilgileri</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    {vehicle.warranty ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicle.exchange ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Takas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicle.credit ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Kredi Uygun</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!vehicle.damageRecord ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Hasar Kaydı {vehicle.damageRecord ? 'Var' : 'Yok'}</span>
                  </div>
                </div>
              </div>

              {/* Donanım */}
              {vehicle.equipment && vehicle.equipment.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Donanım</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Açıklama</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Satıcı Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Satıcı Bilgileri</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Satıcı:</span>
                    <span className="font-medium">{vehicle.sellerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{vehicle.sellerPhone}</span>
                  </div>
                  {vehicle.sellerEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{vehicle.sellerEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* İletişim Butonları */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Ara</span>
                </button>
                <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Mesaj Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;