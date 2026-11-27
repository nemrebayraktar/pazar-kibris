import React, { useState, useEffect } from 'react';
import { X, Users, Car, TrendingUp, Settings, Eye, Trash2, CheckCircle, XCircle, CreditCard as Edit, Ban, Play, Image, Plus } from 'lucide-react';
import { Vehicle, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allListings, setAllListings] = useState<Vehicle[]>([]);
  const [selectedListing, setSelectedListing] = useState<Vehicle | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0
  });

  useEffect(() => {
    if (isOpen && user?.isAdmin) {
      loadAdminData();
    }
  }, [isOpen, user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading admin data...');
      console.log('User:', user);

      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Query result:', { vehicles: vehicles?.length, error });

      if (error) {
        console.error('Error loading vehicles:', error);
        setError(`Veri yüklenirken hata: ${error.message}`);
        throw error;
      }

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

      setAllListings(formattedVehicles);

      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalListings: formattedVehicles.length,
        activeListings: formattedVehicles.filter(l => l.status === 'active').length,
        pendingListings: formattedVehicles.filter(l => l.status === 'pending').length
      });

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      setError(error.message || 'Bir hata oluştu');
      setLoading(false);
    }
  };

  const handleListingAction = async (listingId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
          const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', listingId);

          if (error) throw error;
          alert('İlan başarıyla silindi!');
        }
      } else {
        const newStatus = action === 'approve' ? 'active' : 'pending';
        const { error } = await supabase
          .from('vehicles')
          .update({ status: newStatus })
          .eq('id', listingId);

        if (error) throw error;
        alert(`İlan ${newStatus === 'active' ? 'onaylandı' : 'beklemeye alındı'}!`);
      }

      loadAdminData();
    } catch (error) {
      console.error('Error handling listing action:', error);
      alert('İşlem sırasında bir hata oluştu!');
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: 'active' | 'pending' | 'sold') => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;
      loadAdminData();
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Durum değiştirilemedi!');
    }
  };

  const handleEditListing = (listing: Vehicle) => {
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
          seats: updatedListing.seats
        })
        .eq('id', updatedListing.id);

      if (error) throw error;

      alert('İlan başarıyla güncellendi!');
      setShowEditModal(false);
      setSelectedListing(null);
      loadAdminData();
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('İlan güncellenirken bir hata oluştu!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'sold': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <XCircle className="h-4 w-4" />;
      case 'sold': return <Ban className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ' + currency;
  };

  if (!isOpen || !user?.isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'listings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Car className="h-4 w-4" />
                <span>İlanlar</span>
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Kullanıcılar</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Ayarlar</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Yükleniyor...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">Hata:</p>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => loadAdminData()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {!loading && !error && activeTab === 'dashboard' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Dashboard</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Toplam Kullanıcı</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Toplam İlan</p>
                        <p className="text-2xl font-bold text-green-900">{stats.totalListings}</p>
                      </div>
                      <Car className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Aktif İlan</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.activeListings}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Bekleyen İlan</p>
                        <p className="text-2xl font-bold text-red-900">{stats.pendingListings}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Son İlanlar</h4>
                  {allListings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz ilan bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {allListings.slice(0, 5).map(listing => (
                        <div key={listing.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            {listing.images && listing.images.length > 0 && (
                              <img src={listing.images[0]} alt="" className="w-12 h-10 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{listing.title}</p>
                              <p className="text-xs text-gray-500">{listing.sellerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatPrice(listing.price, listing.currency)}</p>
                            <p className="text-xs text-gray-500">{listing.createdAt.toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && activeTab === 'listings' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">İlan Yönetimi</h3>
                
                <div className="mb-4 flex items-center space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Tüm Durumlar</option>
                    <option value="active">Aktif</option>
                    <option value="pending">Beklemede</option>
                    <option value="sold">Satıldı</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Tüm Kategoriler</option>
                    <option value="Otomobil">Otomobil</option>
                    <option value="Motosiklet">Motosiklet</option>
                    <option value="Elektrikli Araçlar">Elektrikli Araçlar</option>
                  </select>
                </div>
                
                {allListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Henüz hiç ilan yok.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allListings.map(listing => (
                      <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          {listing.images && listing.images.length > 0 && (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-20 h-16 object-cover rounded-lg"
                            />
                          )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                              </div>
                              <p className="text-blue-600 font-bold">{formatPrice(listing.price, listing.currency)}</p>
                              <p className="text-sm text-gray-600">{listing.sellerName} • {listing.city}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {listing.createdAt.toLocaleDateString('tr-TR')}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(listing.status)}`}>
                                  {getStatusIcon(listing.status)}
                                  <span>{listing.status === 'active' ? 'Aktif' : listing.status === 'pending' ? 'Beklemede' : 'Satıldı'}</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {/* Durum Değiştirme */}
                              <div className="relative group">
                                <button
                                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  title="Durum Değiştir"
                                >
                                  {getStatusIcon(listing.status)}
                                </button>
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                  <button
                                    onClick={() => handleStatusChange(listing.id, 'active')}
                                    className="block w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    Aktif Yap
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(listing.id, 'pending')}
                                    className="block w-full text-left px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                  >
                                    Bekletmeye Al
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(listing.id, 'sold')}
                                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                  >
                                    Satıldı Olarak İşaretle
                                  </button>
                                </div>
                              </div>

                              {/* Görüntüle */}
                              <button
                                onClick={() => {
                                  // İlan detaylarını göster
                                  window.dispatchEvent(new CustomEvent('showVehicleDetail', { detail: listing }));
                                }}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Görüntüle"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              
                              {/* Düzenle */}
                              <button
                                onClick={() => handleEditListing(listing)}
                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              
                              {/* Sil */}
                              <button
                                onClick={() => handleListingAction(listing.id, 'delete')}
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
            )}

            {!loading && !error && activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Kullanıcı Yönetimi</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800">Kullanıcı yönetimi özellikleri yakında eklenecek.</p>
                </div>
              </div>
            )}

            {!loading && !error && activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Sistem Ayarları</h3>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="text-gray-700">Sistem ayarları yakında eklenecek.</p>
                </div>
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
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    currency: listing.currency,
    brand: listing.brand,
    model: listing.model,
    year: listing.year.toString(),
    mileage: listing.mileage.toString(),
    engineSize: listing.engineSize?.toString() || '',
    enginePower: listing.enginePower?.toString() || '',
    color: listing.color,
    city: listing.city,
    gearbox: listing.gearbox || '',
    fuel: listing.fuel || '',
    doors: listing.doors?.toString() || '',
    seats: listing.seats?.toString() || '',
    images: listing.images || [],
    equipment: listing.equipment || []
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedListing: Vehicle = {
      ...listing,
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      currency: formData.currency as 'TL' | 'USD' | 'EUR',
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      engineSize: parseInt(formData.engineSize) || 0,
      enginePower: parseInt(formData.enginePower) || 0,
      color: formData.color,
      city: formData.city,
      gearbox: formData.gearbox,
      fuel: formData.fuel,
      doors: parseInt(formData.doors) || 0,
      seats: parseInt(formData.seats) || 0,
      images: formData.images,
      equipment: formData.equipment
    };

    onSave(updatedListing);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">İlan Düzenle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
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

          <div className="grid grid-cols-2 gap-4">
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
                Vites
              </label>
              <select
                name="gearbox"
                value={formData.gearbox}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seçiniz</option>
                <option value="Manuel">Manuel</option>
                <option value="Otomatik">Otomatik</option>
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
              >
                <option value="">Seçiniz</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrik">Elektrik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapı Sayısı
              </label>
              <input
                type="number"
                name="doors"
                value={formData.doors}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Koltuk Sayısı
              </label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraflar
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Fotoğraf URL'si girin"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ekle
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özellikler
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Özellik girin"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.equipment.map((eq, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {eq}
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;