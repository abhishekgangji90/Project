const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const recommendFertilizer = async (data) => {
  const response = await fetch(`${API_URL}/fertilizer/recommend`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get fertilizer recommendation');
  }
  return response.json();
};

export const getFertilizerHistory = async () => {
  const response = await fetch(`${API_URL}/fertilizer/history`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch fertilizer history');
  }
  return response.json();
};
