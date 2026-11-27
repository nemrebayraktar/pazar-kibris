import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Eye, EyeOff, Star, X, Plus } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface UserListingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserListings: React.FC<UserListingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadUserListings();
    }
  }, [isOpen, user]);

  const loadUserListings = async () => {
    setLoading(true);

    try {
      if (user?.isAdmin) {
        const { data: vehicles, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedVehicles: Vehicle[] = vehicles.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          price: parseInt(v.price),
          currency: v.currency as 'TL' | 'USD' | 'EUR',
          brand: v.brand,
          model: v.model,
          year: v.year,
          mileage: v.mileage,
          engineSize: v.engine_size,
          enginePower: v.engine_power,
          doors: v.doors,
          seats: v.seats,
          warranty: v.warranty,
          exchange: v.exchange,
          credit: v.credit,
          damageRecord: v.damage_record,
          paintedParts: Array.isArray(v.painted_parts) ? v.painted_parts : [],
          equipment: Array.isArray(v.equipment) ? v.equipment : [],
          gearbox: v.gearbox,
          fuel: v.fuel,
          steering: v.steering,
          color: v.color,
          city: v.city,
          category: v.category,
          images: Array.isArray(v.images) ? v.images : [],
          sellerName: v.seller_name,
          sellerPhone: v.seller_phone,
          sellerEmail: v.seller_email,
          packageType: v.package_type,
          featured: v.featured,
          status: v.status,
          createdAt: new Date(v.created_at),
          viewCount: v.view_count,
          favoriteCount: v.favorite_count,
          isDemo: false
        }));

        setUserListings(formattedVehicles);
      } else {
        const { data: vehicles, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('seller_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedVehicles: Vehicle[] = vehicles.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          price: parseInt(v.price),
          currency: v.currency as 'TL' | 'USD' | 'EUR',
          brand: v.brand,
          model: v.model,
          year: v.year,
          mileage: v.mileage,
          engineSize: v.engine_size,
          enginePower: v.engine_power,
          doors: v.doors,
          seats: v.seats,
          warranty: v.warranty,
          exchange: v.exchange,
          credit: v.credit,
          damageRecord: v.damage_record,
          paintedParts: Array.isArray(v.painted_parts) ? v.painted_parts : [],
          equipment: Array.isArray(v.equipment) ? v.equipment : [],
          gearbox: v.gearbox,
          fuel: v.fuel,
          steering: v.steering,
          color: v.color,
          city: v.city,
          category: v.category,
          images: Array.isArray(v.images) ? v.images : [],
          sellerName: v.seller_name,
          sellerPhone: v.seller_phone,
          sellerEmail: v.seller_email,
          packageType: v.package_type,
          featured: v.featured,
          status: v.status,
          createdAt: new Date(v.created_at),
          viewCount: v.view_count,
          favoriteCount: v.favorite_count,
          isDemo: false
        }));

        setUserListings(formattedVehicles);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    }

    setLoading(false);
  };

  const handleStatusToggle = async (listingId: string) => {
    const listing = userListings.find(l => l.id === listingId);
    if (!listing) return;

    try {
      const newStatus = listing.status === 'active' ? 'pending' : 'active';
      const { error } = await supabase
        .from('vehicles')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;
      loadUserListings();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Durum değiştirilemedi!');
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      loadUserListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('İlan silinemedi!');
    }
  };

  const handleEdit = (listing: Vehicle) => {
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedListing: Vehicle) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          title: updatedListing.title,
          description: updatedListing.description,
          price: updatedListing.price.toString(),
          currency: updatedListing.currency,
          brand: updatedListing.brand,
          model: updatedListing.model,
          year: updatedListing.year,
          mileage: updatedListing.mileage,
          engine_size: updatedListing.engineSize,
          engine_power: updatedListing.enginePower,
          color: updatedListing.color,
          city: updatedListing.city,
          images: JSON.stringify(updatedListing.images),
          equipment: JSON.stringify(updatedListing.equipment),
          gearbox: updatedListing.gearbox,
          fuel: updatedListing.fuel,
          doors: updatedListing.doors,
          seats: updatedListing.seats,
          warranty: updatedListing.warranty,
          exchange: updatedListing.exchange,
          credit: updatedListing.credit,
          damage_record: updatedListing.damageRecord
        })
        .eq('id', updatedListing.id);

      if (error) throw error;

      alert('İlan başarıyla güncellendi!');
      setShowEditModal(false);
      setSelectedListing(null);
      loadUserListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('İlan güncellenirken bir hata oluştu!');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ' + currency;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Beklemede</span>;
      case 'sold':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Satıldı</span>;
      default:
        return null;
    }
  };

  const getPackageBadge = (packageType: string) => {
    switch (packageType) {
      case 'Vitrine':
        return <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Star className="h-3 w-3" />
          <span>VİTRİN</span>
        </span>;
      case 'VIP':
        return <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">VIP</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Standart</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user?.isAdmin ? 'Tüm İlanlar (Admin)' : 'İlanlarım'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : userListings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {user?.isAdmin ? 'Henüz hiç ilan yok.' : 'Henüz hiç ilanınız yok.'}
              </p>
              <button 
                onClick={onClose}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                İlan Ver
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userListings.map(listing => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-24 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                          <p className="text-lg font-bold text-blue-600 mb-2">
                            {formatPrice(listing.price, listing.currency)}
                          </p>
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusBadge(listing.status)}
                            {getPackageBadge(listing.packageType)}
                            {listing.isDemo && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">DEMO</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>{listing.year} • {listing.mileage.toLocaleString()} km • {listing.city}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Oluşturulma: {listing.createdAt.toLocaleDateString('tr-TR')}
                          </div>
                          {user?.isAdmin && (
                            <div className="text-xs text-blue-600 mt-1">
                              Satıcı: {listing.sellerName} ({listing.sellerPhone})
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStatusToggle(listing.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              listing.status === 'active' 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={listing.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                          >
                            {listing.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleEdit(listing)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedListing && (
        <EditListingModal
          listing={selectedListing}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Modal Component
interface EditListingModalProps {
  listing: Vehicle;
  onSave: (listing: Vehicle) => void;
  onClose: () => void;
}

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, onSave, onClose }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    currency: listing.currency,
    year: listing.year.toString(),
    mileage: listing.mileage.toString(),
    engineSize: listing.engineSize?.toString() || '',
    enginePower: listing.enginePower?.toString() || '',
    doors: listing.doors?.toString() || '4',
    seats: listing.seats?.toString() || '5',
    color: listing.color,
    city: listing.city,
    brand: listing.brand,
    model: listing.model,
    fuel: listing.fuel,
    gearbox: listing.gearbox,
    warranty: listing.warranty || false,
    exchange: listing.exchange || false,
    credit: listing.credit || false,
    damageRecord: listing.damageRecord || false,
    images: listing.images || [],
    equipment: listing.equipment || []
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedListing: Vehicle = {
      ...listing,
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      currency: formData.currency as 'TL' | 'USD' | 'EUR',
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      engineSize: parseInt(formData.engineSize) || 0,
      enginePower: parseInt(formData.enginePower) || 0,
      doors: parseInt(formData.doors) || 4,
      seats: parseInt(formData.seats) || 5,
      color: formData.color,
      city: formData.city,
      brand: formData.brand,
      model: formData.model,
      fuel: formData.fuel as any,
      gearbox: formData.gearbox as any,
      warranty: formData.warranty,
      exchange: formData.exchange,
      credit: formData.credit,
      damageRecord: formData.damageRecord,
      images: formData.images,
      equipment: formData.equipment
    };

    onSave(updatedListing);
  };

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

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()].slice(0, 10)
      }));
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            İlan Düzenle {listing.isDemo && <span className="text-sm text-blue-600">(DEMO)</span>}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
                Yıl
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yakıt Türü
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Elektrik">Elektrik</option>
                <option value="Hibrit">Hibrit</option>
                <option value="LPG">LPG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vites Türü
              </label>
              <select
                name="gearbox"
                value={formData.gearbox}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Manuel">Manuel</option>
                <option value="Otomatik">Otomatik</option>
                <option value="Yarı Otomatik">Yarı Otomatik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Durum Bilgileri */}
          <div>
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

          {/* Fotoğraflar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraflar
            </label>

            {/* Mevcut Fotoğraflar */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Fotoğraf ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dosya Yükleme */}
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-edit"
                disabled={isUploading || formData.images.length >= 10}
              />
              <label
                htmlFor="file-upload-edit"
                className={`inline-flex items-center gap-2 px-4 py-2 ${isUploading || formData.images.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white rounded-lg transition-colors`}
              >
                <Plus className="h-4 w-4" />
                {isUploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
              </label>
              {formData.images.length > 0 && (
                <span className="ml-3 text-sm text-gray-600">
                  {formData.images.length} / 10 fotoğraf
                </span>
              )}
            </div>

            {/* URL ile Ekleme */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Veya fotoğraf URL'si girin"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                URL Ekle
              </button>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserListings;