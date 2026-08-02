import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister } from '../services/auth';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (user?.preferred_language) {
      i18n.changeLanguage(user.preferred_language);
    }
  }, [user?.preferred_language, i18n]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const register = async (name, email, password) => {
    await apiRegister(name, email, password);
    // After register, auto login
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserLanguage = async (newLanguage) => {
    if (!user) return;
    try {
      const updatedUser = await import('../services/auth').then(m => m.updateLanguage(newLanguage));
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update language", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
