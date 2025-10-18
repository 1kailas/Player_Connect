import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { eventsAPI, matchesAPI, newsAPI } from '../services/api';
import { Trophy, Calendar, MapPin, Users, TrendingUp, Newspaper } from 'lucide-react';

const HomePage = () => {
  const { data: upcomingEventsResponse } = useQuery('upcomingEvents', 
    () => eventsAPI.getUpcoming().then(res => res.data.data),
    { initialData: [] }
  );

  const { data: liveMatchesResponse } = useQuery('liveMatches',
    () => matchesAPI.getLive().then(res => res.data.data),
    { refetchInterval: 5000, initialData: [] }
  );

  const { data: featuredNewsResponse } = useQuery('featuredNews',
    () => newsAPI.getFeatured().then(res => res.data.data),
    { initialData: [] }
  );

  // Extract arrays from responses (handle both array and paginated responses)
  const upcomingEvents = Array.isArray(upcomingEventsResponse) 
    ? upcomingEventsResponse 
    : (upcomingEventsResponse?.content || []);

  const liveMatches = Array.isArray(liveMatchesResponse) 
    ? liveMatchesResponse 
    : (liveMatchesResponse?.content || []);

  const featuredNews = Array.isArray(featuredNewsResponse) 
    ? featuredNewsResponse 
    : (featuredNewsResponse?.content || []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-primary-800 dark:via-gray-900 dark:to-gray-950 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            Welcome to Sports Ranking Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
            Join events, compete, track live matches, and climb the rankings
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <Link
              to="/events"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Browse Events
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-success-500 to-success-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-success-600 hover:to-success-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white animate-fade-in">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Organize Events</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Host tournaments and competitions in various sports at any location
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="bg-success-100 dark:bg-success-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Live Rankings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress with ELO-based rankings updated in real-time
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="bg-warning-100 dark:bg-warning-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-warning-600 dark:text-warning-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Build Teams</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage teams, compete together and dominate the leaderboards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">🔴 Live Matches</h2>
              <Link 
                to="/matches" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 group"
              >
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.slice(0, 3).map((match) => (
                <div key={match.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{match.event?.name}</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                      LIVE
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{match.team1?.name}</span>
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {match.team1Score || 0}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{match.team2?.name}</span>
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {match.team2Score || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">📅 Upcoming Events</h2>
            <Link 
              to="/events" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 group"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                    {event.name}
                  </h3>
                  <span className="ml-2 px-2 py-1 bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 text-xs font-semibold rounded-full">
                    NEW
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Trophy className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                    <span className="font-medium">{event.sportType}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-success-500 dark:text-success-400" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-danger-500 dark:text-danger-400" />
                    {event.venue?.name || event.city || 'TBA'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">📰 Latest News</h2>
            <Link 
              to="/news" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 group"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNews.slice(0, 3).map((article) => (
              <div 
                key={article.id} 
                className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <Newspaper className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  {new Date(article.publishedDate || article.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
