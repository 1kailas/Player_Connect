import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { matchesAPI } from '../services/api';
import { Clock, MapPin, Trophy } from 'lucide-react';

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState('live');

  const { data: liveMatchesResponse } = useQuery(
    'liveMatches',
    () => matchesAPI.getLive().then(res => res.data.data),
    { 
      refetchInterval: 5000, 
      initialData: [],
      keepPreviousData: true 
    }
  );

  const { data: upcomingMatchesResponse } = useQuery(
    'upcomingMatches',
    () => matchesAPI.getUpcoming().then(res => res.data.data),
    { 
      initialData: [],
      keepPreviousData: true 
    }
  );

  const { data: allMatchesResponse } = useQuery(
    'allMatches',
    () => matchesAPI.getAll().then(res => res.data.data),
    { 
      initialData: { content: [], totalElements: 0 },
      keepPreviousData: true 
    }
  );

  // Extract arrays from paginated responses
  const liveMatches = Array.isArray(liveMatchesResponse) 
    ? liveMatchesResponse 
    : (liveMatchesResponse?.content || []);

  const upcomingMatches = Array.isArray(upcomingMatchesResponse) 
    ? upcomingMatchesResponse 
    : (upcomingMatchesResponse?.content || []);

  const allMatches = Array.isArray(allMatchesResponse) 
    ? allMatchesResponse 
    : (allMatchesResponse?.content || []);

  const getMatches = () => {
    switch (activeTab) {
      case 'live':
        return liveMatches;
      case 'upcoming':
        return upcomingMatches;
      default:
        return allMatches;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Matches</h1>
          <p className="text-gray-600 dark:text-gray-400">Track live scores and upcoming matches</p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                activeTab === 'live'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Live ({liveMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Upcoming ({upcomingMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All Matches ({allMatches.length})
            </button>
          </div>
        </div>

        {/* Matches */}
        <div className="space-y-4">
          {getMatches().map((match) => (
            <div key={match.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Trophy className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{match.event?.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  match.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 animate-pulse' :
                  match.status === 'SCHEDULED' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {match.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-4">
                {/* Team 1 */}
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {match.team1?.name}
                  </div>
                  {match.status !== 'SCHEDULED' && (
                    <div className="text-4xl font-bold text-primary-600">
                      {match.team1Score || 0}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                </div>

                {/* Team 2 */}
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {match.team2?.name}
                  </div>
                  {match.status !== 'SCHEDULED' && (
                    <div className="text-4xl font-bold text-primary-600">
                      {match.team2Score || 0}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(match.scheduledTime).toLocaleString()}
                </div>
                {match.venue && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {match.venue.name}
                  </div>
                )}
              </div>
            </div>
          ))}

          {getMatches().length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No matches found</h3>
              <p className="text-gray-600 dark:text-gray-400">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
