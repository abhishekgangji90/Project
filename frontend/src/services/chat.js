const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const sendMessage = async (message, conversationId = null, language = "English") => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, conversation_id: conversationId, language }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send message');
  }
  return response.json();
};

export const getConversations = async () => {
  const response = await fetch(`${API_URL}/chat/history`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

export const getConversationDetails = async (conversationId) => {
  const response = await fetch(`${API_URL}/chat/${conversationId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversation details');
  }
  return response.json();
};

export const renameConversation = async (conversationId, newTitle) => {
  const response = await fetch(`${API_URL}/chat/${conversationId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ title: newTitle }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to rename conversation');
  }
  return response.json();
};

export const deleteConversation = async (conversationId) => {
  const response = await fetch(`${API_URL}/chat/${conversationId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete conversation');
  }
  return response.json();
};
