import React, { useState } from 'react';
import { Search, User, Car, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from './LoginModal';
import VehicleListingModal from './VehicleListingModal';

interface HeaderProps {
  onSearch: (query: string) => void;
  onDetailedSearch: () => void;
  onShowUserListings?: () => void;
  onShowAdminPanel?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onDetailedSearch, onShowUserListings, onShowAdminPanel }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handlePostAd = () => {
    if (user) {
      setShowListingModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t.header.siteName}</h1>
              <p className="text-xs text-gray-500">{t.header.siteSubtitle}</p>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-2xl mx-8 flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.header.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t.header.search}
              </button>
            </form>
            <button
              onClick={onDetailedSearch}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
            >
              {t.header.detailedSearch}
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language === 'tr' ? 'TR' : 'EN'}</span>
              </button>
            </div>

            <button
              onClick={handlePostAd}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {t.header.postAd}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onShowUserListings?.();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t.header.myListings}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        alert(language === 'tr' ? 'Profil ayarları yakında eklenecek' : 'Profile settings coming soon');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t.header.profileSettings}
                    </button>
                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onShowAdminPanel?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t.header.adminPanel}
                      </button>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      {t.header.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>{t.header.login}</span>
              </button>
            )}
          </div>
        </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <VehicleListingModal 
        isOpen={showListingModal} 
        onClose={() => setShowListingModal(false)} 
        onListingCreated={(listing) => {
          // Ana component'e yeni ilan bilgisini gönder
          window.dispatchEvent(new CustomEvent('newListing', { detail: listing }));
        }}
      />
    </>
  );
};

export default Header;