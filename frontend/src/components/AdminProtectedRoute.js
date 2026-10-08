import { useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import apiService, { SESSION_EXPIRED_EVENT } from '../services/apiService';
import { navigate } from '../App';

const AdminProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  // Any rejected admin request (e.g. token expired after 24h) sends the user back to login
  useEffect(() => {
    const handleSessionExpired = () => {
      sessionStorage.setItem('adminSessionExpired', '1');
      navigate('/login');
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await apiService.verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Admin token verification failed:', error);
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsAuthenticated(false);
        } else {
          // Network/server problem — keep the session and let the admin retry
          setServerDown(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (serverDown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Can't reach the server</h2>
          <p className="text-gray-600 mb-6">You're still signed in. Check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">This area requires admin authentication.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminProtectedRoute;
