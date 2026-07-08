import { useState } from 'react';

export const SpeakersTab = ({ dashboardData, setDashboardData }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Speakers</h2>
          <p className="text-gray-600">Manage guest speakers and industry experts</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Speaker
        </button>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-orange-900 mb-2">Speakers Management</h3>
        <p className="text-orange-700">Guest speakers management functionality will be available here.</p>
        <p className="text-sm text-orange-600 mt-2">Current speakers: {dashboardData.speakers.length}</p>
      </div>
    </div>
  );
};