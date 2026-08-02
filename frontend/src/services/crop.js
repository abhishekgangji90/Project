const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  // Do NOT set Content-Type for FormData, the browser sets it automatically with the boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const analyzeCrop = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/crop/analyze`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze crop image');
  }
  return response.json();
};

export const getCropHistory = async () => {
  const response = await fetch(`${API_URL}/crop/history`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch crop analysis history');
  }
  return response.json();
};
