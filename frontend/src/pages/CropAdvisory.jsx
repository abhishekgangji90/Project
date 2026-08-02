import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdvisory, getAdvisoryHistory } from '../services/advisory';
import { useTranslation } from 'react-i18next';

const CropAdvisory = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    crop_name: '',
    location: '',
    soil_type: 'Loamy',
    sowing_date: '',
    current_stage: 'Seedling',
    symptoms: '',
    weather_conditions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getAdvisoryHistory();
      setHistory(data.history);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crop_name || !formData.location || !formData.sowing_date) {
      setError(t('common.errorRequired') || 'Please fill in all required fields (Crop Name, Location, Sowing Date).');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = { ...formData, language: user?.preferred_language || 'English' };
      const response = await getAdvisory(payload);
      setResult(response);
      fetchHistory();
    } catch (err) {
      setError(err.message || 'An error occurred while getting the advisory');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item) => {
    setResult(item.result);
    setFormData(item.request);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t('advisory.title')}</h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          {t('advisory.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Section */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">{t('advisory.cropProfile')}</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="crop_name" className="block text-sm font-medium text-gray-700">{t('fertilizer.cropName')}</label>
                    <input type="text" name="crop_name" id="crop_name" value={formData.crop_name} onChange={handleChange} required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                      placeholder="e.g. Cotton" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('fertilizer.location')}</label>
                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                      placeholder="e.g. Pune" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sowing_date" className="block text-sm font-medium text-gray-700">{t('advisory.sowingDate')}</label>
                    <input type="date" name="sowing_date" id="sowing_date" value={formData.sowing_date} onChange={handleChange} required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                  </div>
                  <div>
                    <label htmlFor="current_stage" className="block text-sm font-medium text-gray-700">{t('advisory.currentStage')}</label>
                    <select name="current_stage" id="current_stage" value={formData.current_stage} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
                      <option value="Sowing">Sowing</option>
                      <option value="Seedling">Seedling</option>
                      <option value="Vegetative">Vegetative</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Fruiting">Fruiting / Grain filling</option>
                      <option value="Pre-harvest">Pre-harvest</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="soil_type" className="block text-sm font-medium text-gray-700">{t('fertilizer.soilType')}</label>
                  <select name="soil_type" id="soil_type" value={formData.soil_type} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="weather_conditions" className="block text-sm font-medium text-gray-700">{t('advisory.weatherConditions')}</label>
                  <input type="text" name="weather_conditions" id="weather_conditions" value={formData.weather_conditions} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. Heavy rain expected" />
                </div>
                
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">{t('advisory.symptoms')}</label>
                  <textarea name="symptoms" id="symptoms" rows="2" value={formData.symptoms} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. Yellowing of lower leaves"></textarea>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 border-l-4 border-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                    {loading ? t('common.loading') : t('advisory.getAdvisory')}
                  </button>
                </div></form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between">
              <h2 className="text-lg font-medium text-gray-900">Expert Advisory</h2>
              {result && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {formData.language}
                </span>
              )}
            </div>
            <div className="p-6">
              {result ? (
                <div className="space-y-6">
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 text-lg mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                      Crop Care
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">{result.crop_care}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center">
                        Irrigation
                      </h4>
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">{result.irrigation}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                      <h4 className="text-sm font-bold text-yellow-900 mb-1 flex items-center">
                        Nutrients
                      </h4>
                      <p className="text-sm text-yellow-800 whitespace-pre-wrap">{result.nutrient_guidance}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-md border border-red-100">
                      <h4 className="text-sm font-bold text-red-900 mb-1">Disease Prevention</h4>
                      <p className="text-sm text-red-800 whitespace-pre-wrap">{result.disease_prevention}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
                      <h4 className="text-sm font-bold text-orange-900 mb-1">Pest Management</h4>
                      <p className="text-sm text-orange-800 whitespace-pre-wrap">{result.pest_prevention}</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 text-sm mb-2">
                      Harvest Preparation
                    </h4>
                    <p className="text-sm text-purple-800 whitespace-pre-wrap">{result.harvest_prep}</p>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-16">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  <p>Complete the profile to receive</p>
                  <p>comprehensive farming advice.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Advisory History</h2>
        </div>
        <div className="p-6">
          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all cursor-pointer bg-white" onClick={() => handleHistoryClick(item)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">{item.request.crop_name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {item.request.current_stage}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {item.request.language}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.result.crop_care}
                  </p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">No advisory history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory;
