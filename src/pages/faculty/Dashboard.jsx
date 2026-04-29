import React from 'react';

const FacultyDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Mark Attendance</h2>
          <p className="text-gray-600 mb-4">Quickly mark attendance for your scheduled classes today.</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Select Class
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          <p className="text-gray-600 mb-4">View and export attendance reports for your subjects.</p>
          <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
