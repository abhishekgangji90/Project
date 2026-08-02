import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/dashboard';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [stats, setStats] = useState({
    total_questions: 0,
    crop_images_analyzed: 0,
    documents_uploaded: 0,
    conversations_created: 0
  });
  const [recentChats, setRecentChats] = useState([]);
  const [recentCropAnalyses, setRecentCropAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
        setRecentChats(data.recent_chats);
        setRecentCropAnalyses(data.recent_crop_analyses);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Farmer'} 👋
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Here is what's happening with your crops and inquiries today.
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Link to="/chat" className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Agriculture Chat</h3>
                <p className="text-xs text-gray-500 mt-1">Ask questions instantly</p>
              </div>
            </Link>
            
            <Link to="/crop-analysis" className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analyze Crop Image</h3>
                <p className="text-xs text-gray-500 mt-1">Detect diseases quickly</p>
              </div>
            </Link>

            <button onClick={() => alert('Coming Soon!')} className="group text-left bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Knowledge</h3>
                <p className="text-xs text-gray-500 mt-1">Add local documents</p>
              </div>
            </button>

            <Link to="/fertilizer" className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fertilizer Guide</h3>
                <p className="text-xs text-gray-500 mt-1">Get precise recommendations</p>
              </div>
            </Link>

            <Link to="/crop-advisory" className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Crop Advisory</h3>
                <p className="text-xs text-gray-500 mt-1">Seasonal and stage advice</p>
              </div>
            </Link>

            <Link to="/voice-chat" className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Voice Assistant</h3>
                <p className="text-xs text-gray-500 mt-1">Talk to AgriMitra AI</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Your Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center flex flex-col items-center">
              <div className="text-4xl font-black text-green-600 mb-2">{stats.total_questions}</div>
              <div className="text-sm text-gray-500 font-medium">Questions Asked</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center flex flex-col items-center">
              <div className="text-4xl font-black text-blue-600 mb-2">{stats.crop_images_analyzed}</div>
              <div className="text-sm text-gray-500 font-medium">Crops Analyzed</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center flex flex-col items-center">
              <div className="text-4xl font-black text-purple-600 mb-2">{stats.documents_uploaded}</div>
              <div className="text-sm text-gray-500 font-medium">Documents</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center flex flex-col items-center">
              <div className="text-4xl font-black text-orange-600 mb-2">{stats.conversations_created}</div>
              <div className="text-sm text-gray-500 font-medium">Conversations</div>
            </div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Chats</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentChats.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent chats found.</div>
              ) : (
                recentChats.map((chat) => (
                  <div key={chat.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="bg-green-100 p-2 rounded-full text-green-600 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">{chat.title}</p>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Analyses</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCropAnalyses.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent crop analyses found.</div>
              ) : (
                recentCropAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        analysis.disease_status.toLowerCase() === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate">{analysis.crop_name}</p>
                        <p className={`text-xs ${
                          analysis.disease_status.toLowerCase() === 'healthy' ? 'text-green-600' : 'text-red-500'
                        }`}>{analysis.disease_status}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
