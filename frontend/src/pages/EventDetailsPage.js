import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { eventsAPI, matchesAPI } from '../services/api';
import { Calendar, MapPin, Trophy, Users, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import EventMapView from '../components/EventMapView';

const EventDetailsPage = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery(
    ['event', id],
    () => eventsAPI.getById(id).then(res => res.data.data)
  );

  const { data: matches } = useQuery(
    ['eventMatches', id],
    () => matchesAPI.getByEvent(id).then(res => res.data.data),
    { initialData: [] }
  );

  const handleRegister = async () => {
    try {
      await eventsAPI.register(id);
      toast.success('Successfully registered for event!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{event.name}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                event.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200' :
                event.status === 'UPCOMING' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200' :
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {event.status}
              </span>
            </div>
            {event.status === 'UPCOMING' && (
              <button
                onClick={handleRegister}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Register Now
              </button>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Trophy className="h-5 w-5 mr-3 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Sport</div>
                <div className="font-semibold">{event.sportType}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-3 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Start Date</div>
                <div className="font-semibold">
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-3 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">End Date</div>
                <div className="font-semibold">
                  {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-3 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Venue</div>
                <div className="font-semibold">{event.venue?.name || 'TBA'}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Users className="h-5 w-5 mr-3 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
                <div className="font-semibold">
                  {event.minParticipants} - {event.maxParticipants}
                </div>
              </div>
            </div>

            {event.entryFee > 0 && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <DollarSign className="h-5 w-5 mr-3 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Entry Fee</div>
                  <div className="font-semibold">${event.entryFee}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Location Map */}
        {event.latitude && event.longitude && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <EventMapView event={event} height="450px" />
          </div>
        )}

        {/* Matches */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Matches</h2>
          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(match.scheduledTime).toLocaleString()}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200' :
                      match.status === 'SCHEDULED' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-lg">{match.team1?.name}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {match.team1Score || 0} - {match.team2Score || 0}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{match.team2?.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No matches scheduled yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
