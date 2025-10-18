import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Trophy, 
  // TrendingUp, 
  Activity,
  DollarSign,
  MapPin,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { eventsAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalMatches: 0,
    pendingRequests: 0,
    revenue: 0,
    activeUsers: 0,
    upcomingEvents: 0,
    liveMatches: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real stats from admin endpoints using adminAPI
      const [dashboardRes, eventsRes, activityRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        eventsAPI.getAll({ page: 0, size: 5 }),
        adminAPI.getRecentActivity(10)
      ]);

      const statsData = dashboardRes.data.data || {};
      
      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalEvents: statsData.totalEvents || 0,
        totalMatches: 0, // Mock for now
        pendingRequests: statsData.pendingRequests || 0,
        revenue: statsData.totalRevenue || 0,
        activeUsers: statsData.activeUsersToday || 0,
        upcomingEvents: statsData.upcomingEvents || 0,
        liveMatches: statsData.liveEvents || 0
      });

      // Set events
      setTopEvents(eventsRes.data.data?.content || []);
      
      // Set activities
      setRecentActivities(activityRes.data.data || []);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Fallback to mock data on error
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalMatches: 0,
        pendingRequests: 0,
        revenue: 0,
        activeUsers: 0,
        upcomingEvents: 0,
        liveMatches: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Removed unused formatTimeAgo function

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      positive: true,
      icon: Users,
      color: 'blue',
      link: '/admin/users'
    },
    {
      title: 'Total Events',
      value: stats.totalEvents.toLocaleString(),
      change: '+8.2%',
      positive: true,
      icon: Calendar,
      color: 'green',
      link: '/admin/events'
    },
    {
      title: 'Active Matches',
      value: stats.liveMatches.toLocaleString(),
      change: '+5.3%',
      positive: true,
      icon: Trophy,
      color: 'purple',
      link: '/admin/matches'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests.toLocaleString(),
      change: '-3.1%',
      positive: true,
      icon: Activity,
      color: 'orange',
      link: '/admin/requests'
    },
    {
      title: 'Revenue',
      value: `$${(stats.revenue / 1000).toFixed(1)}k`,
      change: '+15.7%',
      positive: true,
      icon: DollarSign,
      color: 'yellow',
      link: '/admin/settings'
    },
    {
      title: 'Active Users Today',
      value: stats.activeUsers.toLocaleString(),
      change: '+6.8%',
      positive: true,
      icon: Activity,
      color: 'pink',
      link: '/admin/users'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your sports platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
            yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
            pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
          };

          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {stat.positive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${colorClasses[stat.color]} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'event' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'user' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    activity.type === 'match' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    activity.type === 'request' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                    'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                  }`}>
                    {activity.type === 'event' && <Calendar className="h-5 w-5" />}
                    {activity.type === 'user' && <Users className="h-5 w-5" />}
                    {activity.type === 'match' && <Trophy className="h-5 w-5" />}
                    {activity.type === 'request' && <Activity className="h-5 w-5" />}
                    {activity.type === 'community' && <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              to="/admin/events"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Create Event</span>
            </Link>
            <Link
              to="/admin/requests"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <Activity className="h-5 w-5" />
              <span className="font-medium">Review Requests</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Manage Users</span>
            </Link>
            <Link
              to="/admin/community"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Moderate Forum</span>
            </Link>
            <Link
              to="/admin/resources"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Add Resources</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Events</h2>
          <Link
            to="/admin/events"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Event Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Sport</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Participants</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {topEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <Link to={`/admin/events/${event.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        {event.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{event.sportType}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {event.currentParticipants || 0} / {event.maxParticipants}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'LIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
