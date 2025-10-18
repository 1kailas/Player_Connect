import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Trophy, Users, DollarSign, Edit, Trash2, Eye, Plus, Filter, Search } from 'lucide-react';
import { eventsAPI } from '../services/api';
import toast from 'react-hot-toast';

const MyEventsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    sportType: '',
    status: '',
    search: '',
  });

  // Fetch user's organized events
  const { data: eventsData, isLoading } = useQuery(
    ['myOrganizedEvents', filters],
    async () => {
      const response = await eventsAPI.getAll({
        ...filters,
        page: 0,
        size: 100
      });
      const events = response.data.data?.content || response.data.data || [];
      // Filter to only show events organized by current user
      return Array.isArray(events) ? events.filter(e => e.organizerId === user?.id) : [];
    },
    { enabled: !!user }
  );

  // Delete event mutation
  const deleteMutation = useMutation(
    (eventId) => eventsAPI.delete(eventId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myOrganizedEvents');
        toast.success('Event deleted successfully!');
      },
      onError: (error) => {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete event. Please try again.');
      }
    }
  );

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteMutation.mutate(eventId);
    }
  };

  const events = eventsData || [];
  const sportTypes = ['FOOTBALL', 'BASKETBALL', 'CRICKET', 'TENNIS', 'BADMINTON', 'VOLLEYBALL'];
  const statuses = ['DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage events you've organized</p>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Events</p>
                <p className="text-3xl font-bold">{events.length}</p>
              </div>
              <Trophy className="h-12 w-12 opacity-30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Upcoming</p>
                <p className="text-3xl font-bold">
                  {events.filter(e => e.status === 'UPCOMING' || e.status === 'REGISTRATION_OPEN').length}
                </p>
              </div>
              <Calendar className="h-12 w-12 opacity-30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Live Now</p>
                <p className="text-3xl font-bold">
                  {events.filter(e => e.status === 'LIVE').length}
                </p>
              </div>
              <Eye className="h-12 w-12 opacity-30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Completed</p>
                <p className="text-3xl font-bold">
                  {events.filter(e => e.status === 'COMPLETED').length}
                </p>
              </div>
              <Users className="h-12 w-12 opacity-30" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                value={filters.sportType}
                onChange={(e) => setFilters({ ...filters, sportType: e.target.value })}
              >
                <option value="">All Sports</option>
                {sportTypes.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by creating your first event!</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' :
                          event.status === 'UPCOMING' || event.status === 'REGISTRATION_OPEN' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                          event.status === 'COMPLETED' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' :
                          event.status === 'DRAFT' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                      <span className="font-medium">{event.sportType}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-success-500 dark:text-success-400" />
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}`}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-danger-500 dark:text-danger-400" />
                      {event.venue?.name || event.venue?.address || 'TBA'}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-warning-500 dark:text-warning-400" />
                      {event.participantIds?.length || 0} / {event.maxParticipants} participants
                    </div>
                    {event.entryFee > 0 && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-success-500 dark:text-success-400" />
                        ${event.entryFee} entry fee
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/events/${event.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to={`/admin`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deleteMutation.isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
