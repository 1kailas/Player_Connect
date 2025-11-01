import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { Calendar, MapPin, Trophy, Users, DollarSign, Filter, Search } from 'lucide-react';

const EventsPage = () => {
  const [filters, setFilters] = useState({
    sportType: '',
    status: '',
    search: '',
  });

  const { data, isLoading, error } = useQuery(
    ['events', filters],
    () => eventsAPI.getAll(filters).then(res => {
      // Handle paginated response from backend
      if (res.data.content) {
        return res.data.content;
      }
      // Handle wrapped response
      if (res.data.data) {
        return Array.isArray(res.data.data) ? res.data.data : res.data.data.content || [];
      }
      // Handle direct array response
      return Array.isArray(res.data) ? res.data : [];
    }),
    { 
      initialData: [],
      retry: 1,
      onError: (error) => {
        console.error('Failed to fetch events:', error);
      }
    }
  );

  const sportTypes = ['FOOTBALL', 'BASKETBALL', 'CRICKET', 'TENNIS', 'BADMINTON', 'VOLLEYBALL'];
  const statuses = ['UPCOMING', 'LIVE', 'COMPLETED'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sports Events</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover and join exciting sports events near you</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sport Type
              </label>
              <select
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
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

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading events...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">
            Failed to load events. Please try again.
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No events found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' :
                      event.status === 'UPCOMING' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {event.status}
                    </span>
                    <Trophy className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                      {event.sportType}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-success-500 dark:text-success-400" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-danger-500 dark:text-danger-400" />
                      {event.venue?.name || 'TBA'}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-warning-500 dark:text-warning-400" />
                      {event.maxParticipants} participants max
                    </div>
                    {event.entryFee > 0 && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-success-500 dark:text-success-400" />
                        ${event.entryFee} entry fee
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
