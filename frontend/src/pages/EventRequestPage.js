import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { eventRequestsAPI } from '../services/api';
import { Calendar, MapPin, Users, FileText, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import MapPicker from '../components/MapPicker';

const EventRequestPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    sportType: '',
    proposedStartDate: '',
    proposedEndDate: '',
    proposedVenue: '',
    expectedParticipants: '',
    additionalDetails: '',
    latitude: null,
    longitude: null,
  });

  // Fetch user's requests
  const { data: requestsData, isLoading } = useQuery(
    ['myEventRequests'],
    () => eventRequestsAPI.getMyRequests({ page: 0, size: 20 }),
    {
      select: (response) => response.data.data.content || [],
    }
  );

  // Submit request mutation
  const submitMutation = useMutation(
    (data) => eventRequestsAPI.submit(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myEventRequests']);
        setShowForm(false);
        setFormData({
          eventName: '',
          description: '',
          sportType: '',
          proposedStartDate: '',
          proposedEndDate: '',
          proposedVenue: '',
          expectedParticipants: '',
          additionalDetails: '',
          latitude: null,
          longitude: null,
        });
        alert('Event request submitted successfully!');
      },
      onError: (error) => {
        alert(error.response?.data?.message || 'Failed to submit request');
      },
    }
  );

  // Cancel request mutation
  const cancelMutation = useMutation(
    (id) => eventRequestsAPI.cancel(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myEventRequests']);
        alert('Request cancelled successfully');
      },
      onError: (error) => {
        alert(error.response?.data?.message || 'Failed to cancel request');
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ 
      ...prev, 
      latitude: location.lat, 
      longitude: location.lng 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleCancel = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      cancelMutation.mutate(requestId);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200', icon: Clock, text: 'Pending' },
      APPROVED: { color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200', icon: CheckCircle, text: 'Approved' },
      REJECTED: { color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200', icon: XCircle, text: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300', icon: XCircle, text: 'Cancelled' },
    };
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Requests</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Request to organize your own sports event</p>
        </div>

        {/* Submit Request Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {showForm ? 'Cancel' : 'Submit New Request'}
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Submit Event Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sport Type *
                  </label>
                  <select
                    name="sportType"
                    value={formData.sportType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  >
                    <option value="">Select sport</option>
                    <option value="CRICKET">Cricket</option>
                    <option value="FOOTBALL">Football</option>
                    <option value="BASKETBALL">Basketball</option>
                    <option value="VOLLEYBALL">Volleyball</option>
                    <option value="BADMINTON">Badminton</option>
                    <option value="TABLE_TENNIS">Table Tennis</option>
                    <option value="CHESS">Chess</option>
                    <option value="ATHLETICS">Athletics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="proposedStartDate"
                    value={formData.proposedStartDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="proposedEndDate"
                    value={formData.proposedEndDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    name="proposedVenue"
                    value={formData.proposedVenue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter venue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Participants
                  </label>
                  <input
                    type="number"
                    name="expectedParticipants"
                    value={formData.expectedParticipants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Number of participants"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Details
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="Any additional information"
                />
              </div>

              {/* Location Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Location (Optional)
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Search for a location or click on the map to pin the exact venue
                </p>
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={
                    formData.latitude && formData.longitude
                      ? { lat: formData.latitude, lng: formData.longitude }
                      : null
                  }
                  height="350px"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitMutation.isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitMutation.isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">My Requests</h2>
          
          {requestsData && requestsData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No requests yet. Submit your first event request above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requestsData && requestsData.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.eventName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.sportType}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{request.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(request.proposedStartDate)} - {formatDate(request.proposedEndDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{request.proposedVenue}</span>
                    </div>
                    {request.expectedParticipants && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{request.expectedParticipants} participants</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Submitted: {formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  {request.reviewComments && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Comments:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.reviewComments}</p>
                    </div>
                  )}

                  {request.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(request.id)}
                      disabled={cancelMutation.isLoading}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRequestPage;
