import { useState, useEffect } from 'react';
import { OverviewTab, MemoriesTab, EventsTab, TeamTab, SpeakersTab } from './AdminDashboardTabs';
import apiService from '../services/apiService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    clubMemories: [],
    events: [],
    teamMembers: [],
    speakers: []
  });

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check if API is available
      const isApiAvailable = await apiService.isApiAvailable();
      
      if (isApiAvailable) {
        // Load data from API
        const [memoriesRes, eventsRes, teamRes, speakersRes] = await Promise.all([
          apiService.getMemories().catch(() => ({ success: false, data: [] })),
          apiService.getEvents().catch(() => ({ success: false, data: [] })),
          apiService.getTeamMembers().catch(() => ({ success: false, data: [] })),
          apiService.getSpeakers().catch(() => ({ success: false, data: [] }))
        ]);

        setDashboardData({
          clubMemories: memoriesRes.success ? memoriesRes.data : [],
          events: eventsRes.success ? eventsRes.data : [],
          teamMembers: teamRes.success ? teamRes.data : [],
          speakers: speakersRes.success ? speakersRes.data : []
        });
      } else {
        // Fallback to localStorage
        console.warn('API not available, using localStorage fallback');
        const fallbackData = await apiService.fallbackToLocalStorage();
        setDashboardData(fallbackData.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Load default data
      setDashboardData({
        clubMemories: [],
        events: [],
        teamMembers: [],
        speakers: []
      });
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear any auth tokens/session data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const handleDataReset = async () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      try {
        // For now, just reload the data from API
        await loadDashboardData();
        alert('Data refreshed from server!');
      } catch (error) {
        console.error('Reset error:', error);
        alert('Reset failed: ' + error.message);
      }
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await apiService.exportData();
      if (response.success) {
        // Create and download the file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `devityclub_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + error.message);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'memories', name: 'Club Memories', icon: '📸' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'speakers', name: 'Speakers', icon: '🎤' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DevityClub Admin
                </h1>
                <p className="text-sm text-gray-600">Content Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Data Management Buttons */}
              <div className="hidden md:flex items-center space-x-2">

                <button
                  onClick={handleDataExport}
                  className="flex items-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 border border-green-200 hover:border-green-300 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                <button
                  onClick={handleDataReset}
                  className="flex items-center px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-300 border border-orange-200 hover:border-orange-300 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Last login: Today</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 border border-red-200 hover:border-red-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-100 p-6">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                  >
                    <span className="text-xl mr-3">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-100 p-8">
              {activeTab === 'overview' && <OverviewTab dashboardData={dashboardData} setActiveTab={setActiveTab} />}
              {activeTab === 'memories' && <MemoriesTab dashboardData={dashboardData} setDashboardData={setDashboardData} />}
              {activeTab === 'events' && <EventsTab dashboardData={dashboardData} setDashboardData={setDashboardData} />}
              {activeTab === 'team' && <TeamTab dashboardData={dashboardData} setDashboardData={setDashboardData} />}
              {activeTab === 'speakers' && <SpeakersTab dashboardData={dashboardData} setDashboardData={setDashboardData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;