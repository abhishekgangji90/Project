import React, { useState, useEffect } from 'react';
import { recommendFertilizer, getFertilizerHistory } from '../services/fertilizer';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Fertilizer = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    crop_name: '',
    soil_type: 'Loamy',
    location: '',
    growth_stage: 'Seedling',
    soil_test_values: '',
    available_fertilizer: ''
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
      const data = await getFertilizerHistory();
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
    if (!formData.crop_name || !formData.location) {
      setError(t('common.errorRequired') || 'Please fill in the required fields (Crop Name and Location).');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = { ...formData, language: user?.preferred_language || 'English' };
      const response = await recommendFertilizer(payload);
      setResult(response);
      fetchHistory();
    } catch (err) {
      setError(err.message || 'An error occurred while getting recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item) => {
    setResult(item.result);
    // Optionally update form data to match the clicked item
    setFormData(item.request);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t('fertilizer.title')}</h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          {t('fertilizer.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Section */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">{t('fertilizer.cropProfile')}</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="crop_name" className="block text-sm font-medium text-gray-700">{t('fertilizer.cropName')}</label>
                  <input type="text" name="crop_name" id="crop_name" value={formData.crop_name} onChange={handleChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. Wheat, Rice, Tomato" />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('fertilizer.location')}</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. Punjab, California" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="soil_type" className="block text-sm font-medium text-gray-700">{t('fertilizer.soilType')}</label>
                    <select name="soil_type" id="soil_type" value={formData.soil_type} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
                      <option value="Loamy">Loamy</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Silt">Silt</option>
                      <option value="Peaty">Peaty</option>
                      <option value="Saline">Saline</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="growth_stage" className="block text-sm font-medium text-gray-700">{t('fertilizer.growthStage')}</label>
                    <select name="growth_stage" id="growth_stage" value={formData.growth_stage} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
                      <option value="Seedling">Seedling / Early</option>
                      <option value="Vegetative">Vegetative</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Fruiting">Fruiting / Grain filling</option>
                      <option value="Pre-harvest">Pre-harvest</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="soil_test_values" className="block text-sm font-medium text-gray-700">{t('fertilizer.soilTestValues')}</label>
                  <textarea name="soil_test_values" id="soil_test_values" rows="2" value={formData.soil_test_values} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. NPK values, pH 6.5, organic carbon %" />
                </div>

                <div>
                  <label htmlFor="available_fertilizer" className="block text-sm font-medium text-gray-700">{t('fertilizer.availableFertilizer')}</label>
                  <input type="text" name="available_fertilizer" id="available_fertilizer" value={formData.available_fertilizer} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    placeholder="e.g. Urea, DAP, Manure" />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 border-l-4 border-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
                >
                  {loading ? t('common.loading') : t('fertilizer.getRecommendation')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">AI Recommendation</h2>
            </div>
            <div className="p-6">
              {result ? (
                <div className="space-y-6">
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 text-lg mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Nutrient Requirements
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed">{result.nutrient_requirements}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1 uppercase tracking-wider">Fertilizer Guidance</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.fertilizer_guidance}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Application Timing</h4>
                      <p className="text-sm text-blue-800">{result.application_timing}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                      <h4 className="text-sm font-bold text-purple-900 mb-1">Application Method</h4>
                      <p className="text-sm text-purple-800">{result.application_method}</p>
                    </div>
                  </div>

                  {result.precautions && result.precautions.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Important Precautions
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-orange-800 space-y-1">
                        {result.precautions.map((precaution, idx) => (
                          <li key={idx}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1 uppercase tracking-wider">Soil Health Advice</h4>
                    <p className="text-sm text-gray-700 italic">{result.soil_health}</p>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-16">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  <p>Fill out the form and submit to receive</p>
                  <p>tailored fertilizer recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Recommendation History</h2>
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {item.request.soil_type}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      {item.request.growth_stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 italic">
                    {item.result.nutrient_requirements}
                  </p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">No recommendation history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fertilizer;
