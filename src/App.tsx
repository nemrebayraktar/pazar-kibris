import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import PriceEstimator from './components/PriceEstimator';
import ChatBot from './components/ChatBot';
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import VehicleCard from './components/VehicleCard';
import DetailedSearch from './components/DetailedSearch';
import UserListings from './components/UserListings';
import AdminPanel from './components/AdminPanel';
import VehicleDetailModal from './components/VehicleDetailModal';
import { Vehicle, VehicleCategory, SearchFilters } from './types';
import { supabase } from './lib/supabase';

function AppContent() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showDetailedSearch, setShowDetailedSearch] = useState(false);
  const [showUserListings, setShowUserListings] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [showVehicleDetailModal, setShowVehicleDetailModal] = useState(false);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();

    const handleShowVehicleDetail = (event: CustomEvent) => {
      setSelectedVehicleForDetail(event.detail);
      setShowVehicleDetailModal(true);
    };

    window.addEventListener('showVehicleDetail', handleShowVehicleDetail as EventListener);

    return () => {
      window.removeEventListener('showVehicleDetail', handleShowVehicleDetail as EventListener);
    };
  }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedVehicles: Vehicle[] = data
          .filter(v => v.images && v.images.length > 0)
          .map(v => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          price: Number(v.price),
          currency: v.currency,
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
          paintedParts: Array.isArray(v.painted_parts) ? v.painted_parts : (typeof v.painted_parts === 'string' ? JSON.parse(v.painted_parts || '[]') : []),
          equipment: Array.isArray(v.equipment) ? v.equipment : (typeof v.equipment === 'string' ? JSON.parse(v.equipment || '[]') : []),
          gearbox: v.gearbox,
          fuel: v.fuel,
          steering: v.steering,
          color: v.color,
          city: v.city,
          category: v.category as VehicleCategory,
          images: v.images || [],
          sellerId: v.seller_id,
          sellerName: v.seller_name,
          sellerPhone: v.seller_phone,
          sellerEmail: v.seller_email,
          packageType: v.package_type,
          featured: v.featured,
          createdAt: new Date(v.created_at),
          status: v.status,
          viewCount: v.view_count,
          favoriteCount: v.favorite_count
        }));
        setAllVehicles(mappedVehicles);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles based on category and search filters
  const filteredVehicles = allVehicles.filter(vehicle => {
    if (vehicle.status !== 'active') return false;
    
    // Category filter
    if (selectedCategory && vehicle.category !== selectedCategory) return false;
    
    // Search filters
    if (searchFilters.category && vehicle.category !== searchFilters.category) return false;
    if (searchFilters.brand && vehicle.brand !== searchFilters.brand) return false;
    if (searchFilters.city && vehicle.city !== searchFilters.city) return false;
    if (searchFilters.fuel && vehicle.fuel !== searchFilters.fuel) return false;
    if (searchFilters.gearbox && vehicle.gearbox !== searchFilters.gearbox) return false;
    
    // Price range
    if (searchFilters.priceMin && vehicle.price < searchFilters.priceMin) return false;
    if (searchFilters.priceMax && vehicle.price > searchFilters.priceMax) return false;
    
    // Year range
    if (searchFilters.yearMin && vehicle.year < searchFilters.yearMin) return false;
    if (searchFilters.yearMax && vehicle.year > searchFilters.yearMax) return false;
    
    // Mileage
    if (searchFilters.mileageMax && vehicle.mileage > searchFilters.mileageMax) return false;
    
    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      const searchText = `${vehicle.title} ${vehicle.brand} ${vehicle.model} ${vehicle.description}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }
    
    return true;
  });

  const featuredVehicles = (() => {
    const featured = allVehicles.filter(v => v.featured && v.status === 'active');

    const categorizedVehicles: Record<string, Vehicle[]> = {};
    featured.forEach(v => {
      if (!categorizedVehicles[v.category]) {
        categorizedVehicles[v.category] = [];
      }
      categorizedVehicles[v.category].push(v);
    });

    const mixed: Vehicle[] = [];
    const categories = Object.keys(categorizedVehicles);
    const maxPerCategory = 2;

    categories.forEach(category => {
      const vehicles = categorizedVehicles[category]
        .sort(() => Math.random() - 0.5)
        .slice(0, maxPerCategory);
      mixed.push(...vehicles);
    });

    return mixed.sort(() => Math.random() - 0.5).slice(0, 12);
  })();

  const categoryCounts = allVehicles.reduce((acc, vehicle) => {
    if (vehicle.status === 'active') {
      acc[vehicle.category] = (acc[vehicle.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<VehicleCategory, number>);

  const handleSearch = (query: string) => {
    setSearchFilters({ query });
    setSelectedCategory(null);
  };

  const handleDetailedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setSelectedCategory(null);
  };

  const handleListingCreated = async () => {
    await loadVehicles();
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicleForDetail(vehicle);
    setShowVehicleDetailModal(true);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onDetailedSearch={() => setShowDetailedSearch(true)}
          onShowUserListings={() => setShowUserListings(true)}
          onShowAdminPanel={() => setShowAdminPanel(true)}
        />

        <PriceEstimator />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-6">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              categoryCounts={categoryCounts}
            />
            
            <main className="flex-1">
              {!selectedCategory && Object.keys(searchFilters).length === 0 ? (
                <Homepage 
                  featuredVehicles={featuredVehicles}
                  onVehicleClick={handleVehicleClick}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory ? selectedCategory : t.search.searchResults}
                      <span className="ml-2 text-sm text-gray-500">
                        ({filteredVehicles.length} {t.search.results})
                      </span>
                    </h2>

                    <div className="flex items-center space-x-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>{t.search.newest}</option>
                        <option>{t.search.priceLowHigh}</option>
                        <option>{t.search.priceHighLow}</option>
                        <option>{t.search.mileageLowHigh}</option>
                        <option>{t.search.yearNewOld}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map(vehicle => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onVehicleClick={handleVehicleClick}
                      />
                    ))}
                  </div>

                  {filteredVehicles.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">{t.search.noResults}</p>
                      <button
                        onClick={() => {
                          setSearchFilters({});
                          setSelectedCategory(null);
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {t.search.viewAllListings}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>

        <DetailedSearch
          isOpen={showDetailedSearch}
          onClose={() => setShowDetailedSearch(false)}
          onSearch={handleDetailedSearch}
          currentFilters={searchFilters}
        />
        
        <UserListings
          isOpen={showUserListings}
          onClose={() => setShowUserListings(false)}
        />
        
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
        
        <VehicleDetailModal
          vehicle={selectedVehicleForDetail}
          isOpen={showVehicleDetailModal}
          onClose={() => setShowVehicleDetailModal(false)}
        />

        <ChatBot />
      </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;