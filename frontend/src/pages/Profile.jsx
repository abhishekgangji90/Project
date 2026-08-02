import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 lg:p-12">
      <div className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Name</p>
            <p className="text-xl text-gray-900 font-medium">{user?.name || 'Farmer'}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Email</p>
            <p className="text-xl text-gray-900 font-medium">{user?.email || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Preferred Language</p>
            <p className="text-xl text-gray-900 font-medium">{user?.preferred_language || 'English'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
