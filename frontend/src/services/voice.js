const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  // Groq's whisper model accepts these formats, we use webm generally from browser MediaRecorder
  formData.append('file', audioBlob, 'recording.webm');
  
  const response = await fetch(`${API_URL}/voice/transcribe`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to transcribe audio');
  }
  return response.json(); // returns { text: "..." }
};

export const generateSpeech = async (text, language) => {
  const response = await fetch(`${API_URL}/voice/speak`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text, language }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate speech');
  }
  
  // Return the audio blob
  return response.blob();
};
