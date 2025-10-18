import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { eventsAPI } from '../services/api';
import { MapPin, Navigation, Calendar, Users, Trophy, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapPicker from '../components/MapPicker';

const NearbyEventsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(50); // km
  const [sportFilter, setSportFilter] = useState('ALL');
  const [showMap, setShowMap] = useState(false);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const { data: events, isLoading } = useQuery(
    ['nearbyEvents', userLocation, radius, sportFilter],
    () => eventsAPI.getAll({ page: 0, size: 100 }).then(res => res.data.data.content),
    {
      enabled: !!userLocation,
      select: (data) => {
        // Filter events by distance
        return data
          .filter(event => {
            if (!event.latitude || !event.longitude) return false;
            if (sportFilter !== 'ALL' && event.sportType !== sportFilter) return false;
            
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.latitude,
              event.longitude
            );
            return distance <= radius;
          })
          .map(event => ({
            ...event,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.latitude,
              event.longitude
            )
          }))
          .sort((a, b) => a.distance - b.distance);
      }
    }
  );

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => (value * Math.PI) / 180;

  const sports = ['ALL', 'CRICKET', 'FOOTBALL', 'BASKETBALL', 'VOLLEYBALL', 'BADMINTON', 'ATHLETICS', 'KABADDI'];

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Navigation className="h-16 w-16 mx-auto mb-4 text-primary-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Getting your location...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please allow location access to find nearby sports events
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare markers for map
  const eventMarkers = events?.map(event => ({
    lat: event.latitude,
    lng: event.longitude,
    name: event.name,
    description: event.description,
    address: `${event.city}, ${event.state}`,
    date: event.startDate,
    link: `/events/${event.id}`
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <MapPin className="h-8 w-8 mr-3 text-primary-500" />
            Nearby Sports Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover sports events happening near you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Radius Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search Radius
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
              </select>
            </div>

            {/* Sport Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Sport Type
              </label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Mode
              </label>
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                {showMap ? 'Show List' : 'Show Map'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Found <strong className="text-primary-500">{events?.length || 0}</strong> events within {radius} km
          </p>
        </div>

        {/* Map View */}
        {showMap && events && events.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <MapPicker
              initialLat={userLocation.lat}
              initialLng={userLocation.lng}
              selectedLocation={userLocation}
              markers={eventMarkers}
              enablePicker={false}
              height="600px"
            />
          </div>
        )}

        {/* Events List */}
        {!showMap && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
              </div>
            ) : events && events.length > 0 ? (
              events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                      {event.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'LIVE' ? 'bg-red-100 text-red-600' :
                      event.status === 'UPCOMING' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="font-semibold text-primary-500">{event.distance.toFixed(1)} km away</span>
                      <span className="mx-2">•</span>
                      <span>{event.city}, {event.state}</span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Trophy className="h-4 w-4 mr-2" />
                      {event.sportType}
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.minParticipants} - {event.maxParticipants} participants
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-semibold transition-colors">
                      View Details →
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No events found nearby
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try increasing the search radius or changing filters
                </p>
                <Link
                  to="/event-requests"
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Organize an Event
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyEventsPage;
