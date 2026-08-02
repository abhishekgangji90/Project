import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const Home = () => {
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    const getStatus = async () => {
      try {
        const data = await checkHealth();
        setApiStatus(data.message);
      } catch (error) {
        setApiStatus('API is unreachable.');
      }
    };
    getStatus();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8 text-center border-t-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4">Welcome to AgriMitra AI</h2>
        <p className="mb-4">Your intelligent companion for modern farming.</p>
        <div className="p-4 bg-gray-100 rounded">
          <p className="font-mono">Backend Status: <span className={apiStatus === 'API is unreachable.' ? 'text-red-500' : 'text-green-600 font-bold'}>{apiStatus}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Home;
