import React from 'react';
import EventRequestsManager from '../../components/Admin/EventRequestsManager';

const AdminRequestsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Requests</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and manage event requests from users
        </p>
      </div>
      <EventRequestsManager />
    </div>
  );
};

export default AdminRequestsPage;
