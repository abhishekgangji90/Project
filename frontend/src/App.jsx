import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import CropAnalysis from './pages/CropAnalysis';
import Fertilizer from './pages/Fertilizer';
import CropAdvisory from './pages/CropAdvisory';
import VoiceChat from './pages/VoiceChat';
import Profile from './pages/Profile';
import KnowledgeBase from './pages/KnowledgeBase';
import { Toaster } from 'react-hot-toast';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crop-analysis" 
                element={
                  <ProtectedRoute>
                    <CropAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fertilizer" 
                element={
                  <ProtectedRoute>
                    <Fertilizer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crop-advisory" 
                element={
                  <ProtectedRoute>
                    <CropAdvisory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/voice-chat" 
                element={
                  <ProtectedRoute>
                    <VoiceChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/knowledge" 
                element={
                  <ProtectedRoute>
                    <KnowledgeBase />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
