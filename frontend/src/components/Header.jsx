import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, updateUserLanguage } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-green-200 transition">{t('header.title')}</Link>
          <p className="text-sm">{t('header.subtitle')}</p>
        </div>
        <div className="flex md:hidden items-center space-x-4">
          {user && (
            <select
              value={user.preferred_language || 'English'}
              onChange={(e) => updateUserLanguage(e.target.value)}
              className="bg-green-700 text-white text-xs border border-green-500 rounded p-1"
            >
              <option value="English">EN</option>
              <option value="Hindi">HI</option>
              <option value="Marathi">MR</option>
            </select>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-green-200 focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-green-200 transition">{t('header.dashboard')}</Link>
              <Link to="/chat" className="hover:text-green-200 transition">{t('header.chat') || "Chat"}</Link>
              <Link to="/crop-analysis" className="hover:text-green-200 transition">{t('header.cropAnalysis')}</Link>
              <Link to="/fertilizer" className="hover:text-green-200 transition">{t('header.fertilizer')}</Link>
              <Link to="/crop-advisory" className="hover:text-green-200 transition">{t('header.cropAdvisory')}</Link>
              <Link to="/voice-chat" className="hover:text-green-200 transition">{t('header.voiceChat')}</Link>
              <span className="text-green-300 opacity-50">|</span>
              <select
                value={user.preferred_language || 'English'}
                onChange={(e) => updateUserLanguage(e.target.value)}
                className="bg-green-700 text-white border border-green-500 rounded py-1 px-2 focus:outline-none"
              >
                <option value="English">EN</option>
                <option value="Hindi">HI</option>
                <option value="Marathi">MR</option>
              </select>
              <Link to="/profile" className="flex items-center space-x-1 hover:text-green-200 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white text-green-700 hover:bg-green-50 px-4 py-1.5 rounded-full transition-colors shadow-sm font-semibold"
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200 transition">{t('header.login')}</Link>
              <Link to="/register" className="bg-white text-green-700 hover:bg-green-50 px-4 py-1.5 rounded-full transition-colors shadow-sm font-semibold">
                {t('header.register')}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-green-500 flex flex-col space-y-4 pb-2">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.dashboard')}</Link>
              <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.chat') || "Chat"}</Link>
              <Link to="/crop-analysis" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.cropAnalysis')}</Link>
              <Link to="/fertilizer" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.fertilizer')}</Link>
              <Link to="/crop-advisory" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.cropAdvisory')}</Link>
              <Link to="/voice-chat" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded">{t('header.voiceChat')}</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block hover:bg-green-700 p-2 rounded flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>Profile ({user.name})</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-green-100 font-semibold p-2 hover:bg-green-700 rounded mt-2"
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-2 hover:bg-green-700 rounded">{t('header.login')}</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block p-2 hover:bg-green-700 rounded bg-green-500 font-semibold">{t('header.register')}</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
