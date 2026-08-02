import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getConversations, getConversationDetails, renameConversation, deleteConversation } from '../services/chat';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Chat = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data.conversations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history.");
    }
  };

  const loadConversation = async (id) => {
    try {
      setCurrentConversationId(id);
      const data = await getConversationDetails(id);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversation");
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setError(null);
  };

  const handleRenameSubmit = async (id, e) => {
    if (e) e.stopPropagation();
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await renameConversation(id, editTitle);
      setConversations(conversations.map(c => c.id === id ? { ...c, title: editTitle } : c));
      setEditingId(null);
      toast.success("Renamed chat");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename conversation");
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
      if (currentConversationId === id) {
        handleNewConversation();
      }
      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete conversation");
    }
  };
  
  const filteredConversations = conversations.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(
        userMessage.content, 
        currentConversationId, 
        user?.preferred_language || 'English'
      );
      
      const aiMessage = { role: 'assistant', content: response.ai_message };
      setMessages(prev => [...prev, aiMessage]);
      
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        fetchConversations();
      }
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 flex-col md:flex-row relative">
      {/* Sidebar for Conversations */}
      <div className="hidden md:flex w-1/4 bg-white border-r border-gray-200 p-4 flex-col z-10">
        <button 
          onClick={handleNewConversation}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors mb-4"
        >
          + {t('dashboard.newConversation')}
        </button>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <h3 className="text-gray-500 font-semibold mb-2 uppercase text-sm">{t('dashboard.conversations')}</h3>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`w-full group flex items-center justify-between p-3 rounded mb-2 transition-colors cursor-pointer ${
                currentConversationId === conv.id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                if (editingId !== conv.id) loadConversation(conv.id);
              }}
            >
              {editingId === conv.id ? (
                <div className="flex items-center flex-1 space-x-2" onClick={e => e.stopPropagation()}>
                  <input 
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv.id)}
                    className="flex-1 p-1 text-sm border rounded focus:outline-none"
                  />
                  <button onClick={() => handleRenameSubmit(conv.id)} className="text-green-600 hover:text-green-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                <>
                  <span className="truncate flex-1 text-left">{conv.title}</span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conv.id);
                        setEditTitle(conv.title);
                      }}
                      className="text-gray-400 hover:text-blue-500 p-1"
                      title="Rename"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(conv.id, e)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {filteredConversations.length === 0 && (
            <p className="text-gray-400 text-sm italic text-center mt-4">No history found.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to AgriMitra AI</h2>
              <p className="text-gray-500 max-w-md">
                {t('dashboard.selectConversation')}
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-5 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white text-gray-800 shadow-md border border-gray-100 px-5 py-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('dashboard.typeMessage')}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
              className="absolute right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
