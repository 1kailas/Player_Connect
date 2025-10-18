import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Award, Calendar, Bell, TrendingUp, Users, Target, Activity } from 'lucide-react';
import { userAPI, eventsAPI, matchesAPI, newsAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Fetch user stats
  const { data: stats } = useQuery(
    'dashboardStats',
    () => userAPI.getStats().then(res => res.data.data),
    { enabled: !!user }
  );
  
  // Fetch upcoming events
  const { data: upcomingEventsData } = useQuery(
    'dashboardUpcomingEvents',
    () => eventsAPI.getUpcoming().then(res => res.data.data),
    { enabled: !!user }
  );
  
  // Fetch recent matches
  const { data: recentMatchesData } = useQuery(
    'dashboardRecentMatches',
    () => matchesAPI.getAll({ size: 5 }).then(res => {
      const data = res.data.data;
      return Array.isArray(data) ? data : (data?.content || []);
    }),
    { enabled: !!user }
  );
  
  // Fetch latest news
  const { data: latestNewsData } = useQuery(
    'dashboardLatestNews',
    () => newsAPI.getLatest({ size: 3 }).then(res => {
      const data = res.data.data;
      return Array.isArray(data) ? data : (data?.content || []);
    }),
    { enabled: !!user }
  );
  
  const upcomingEvents = Array.isArray(upcomingEventsData) 
    ? upcomingEventsData.slice(0, 6) 
    : (upcomingEventsData?.content || []).slice(0, 6);
  
  const recentMatches = recentMatchesData || [];
  const latestNews = latestNewsData || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your progress and manage your activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Points</p>
                <p className="text-3xl font-bold">{stats?.totalPoints || 0}</p>
                <p className="text-xs opacity-75 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Keep competing!
                </p>
              </div>
              <Award className="h-12 w-12 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Events Organized</p>
                <p className="text-3xl font-bold">{stats?.organizedEvents || 0}</p>
                <p className="text-xs opacity-75 mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Create more events
                </p>
              </div>
              <Trophy className="h-12 w-12 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Member Since</p>
                <p className="text-xl font-bold">
                  {stats?.memberSince 
                    ? new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'N/A'}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  <Users className="inline h-3 w-3 mr-1" />
                  Welcome member!
                </p>
              </div>
              <Activity className="h-12 w-12 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Active Status</p>
                <p className="text-2xl font-bold">{stats?.emailVerified ? 'Verified' : 'Unverified'}</p>
                <p className="text-xs opacity-75 mt-1">
                  <Target className="inline h-3 w-3 mr-1" />
                  {stats?.roles?.join(', ') || 'Member'}
                </p>
              </div>
              <Bell className="h-12 w-12 opacity-30" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Matches</h2>
              <Link to="/matches" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentMatches.length > 0 ? (
                recentMatches.slice(0, 5).map((match) => (
                  <Link 
                    key={match.id} 
                    to={`/matches/${match.id}`}
                    className="block border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 -mx-2 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        match.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' :
                        match.status === 'COMPLETED' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {match.team1Score !== null && match.team2Score !== null 
                          ? `${match.team1Score} - ${match.team2Score}` 
                          : 'Not started'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {match.scheduledTime 
                          ? new Date(match.scheduledTime).toLocaleDateString()
                          : 'TBD'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent matches found</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Bell className="h-6 w-6 mr-2" />
                Latest News
              </h2>
              <Link to="/news" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {latestNews.length > 0 ? (
                latestNews.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    className="block border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 -mx-2 transition"
                  >
                    <div className="flex items-start">
                      <div className="h-2 w-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-1 truncate text-gray-900 dark:text-white">{article.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {article.content?.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {article.publishedAt 
                            ? new Date(article.publishedAt).toLocaleDateString()
                            : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No news articles available</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <Link to="/events" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold">
              Browse All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-primary-300 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex-1">{event.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.status === 'UPCOMING' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' :
                      event.status === 'LIVE' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                      {event.startDate 
                        ? new Date(event.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : 'Date TBD'}
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-primary-600" />
                      {event.sportType || 'Multi-Sport'}
                    </div>
                    {event.venue && (
                      <div className="flex items-start">
                        <svg className="h-4 w-4 mr-2 mt-0.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">{event.venue.name}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">{event.description}</p>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming events</p>
                <Link to="/events" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm mt-2 inline-block">
                  Explore events →
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 mt-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/events" 
              className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <span className="font-semibold">Browse Events</span>
            </Link>
            <Link 
              to="/profile" 
              className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition"
            >
              <Award className="h-8 w-8 mx-auto mb-2" />
              <span className="font-semibold">My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
