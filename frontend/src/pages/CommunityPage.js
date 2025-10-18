import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { MessageCircle, ThumbsUp, Reply, Send, Users, TrendingUp, Clock, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Real API calls
const forumAPI = {
  getPosts: async (category = 'ALL') => {
    const token = localStorage.getItem('token');
    const url = category === 'ALL' 
      ? `${API_URL}/api/forum/posts?page=0&size=50`
      : `${API_URL}/api/forum/posts/category/${category}?page=0&size=50`;
    
    const response = await axios.get(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return response.data;
  },
  
  createPost: async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/forum/posts`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
  
  likePost: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/forum/posts/${id}/like`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },
  
  addReply: async ({ postId, content }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/forum/posts/${postId}/reply`, 
      { content }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },
  
  getStats: async () => {
    const response = await axios.get(`${API_URL}/api/forum/stats`);
    return response.data;
  }
};

const CommunityPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalPosts: 0, activeMembers: 0, totalReplies: 0 });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'GENERAL'
  });

  const { data: postsData, isLoading } = useQuery(
    ['forumPosts', selectedCategory], 
    () => forumAPI.getPosts(selectedCategory),
    {
      onSuccess: (data) => {
        // Also fetch stats
        forumAPI.getStats().then(statsRes => {
          if (statsRes.data) {
            setStats({
              totalPosts: statsRes.data.totalPosts || 0,
              activeMembers: statsRes.data.activeMembers || 0,
              totalReplies: statsRes.data.totalReplies || 0
            });
          }
        }).catch(err => console.error('Stats fetch error:', err));
      }
    }
  );

  const posts = postsData?.data?.content || [];

  const createPostMutation = useMutation(forumAPI.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['forumPosts', selectedCategory]);
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'GENERAL' });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      console.error('Create post error:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  });

  const likePostMutation = useMutation(forumAPI.likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['forumPosts', selectedCategory]);
    },
    onError: (error) => {
      console.error('Like post error:', error);
      toast.error('Failed to like post');
    }
  });

  const categories = [
    { id: 'ALL', label: 'All Topics', icon: Users },
    { id: 'CRICKET', label: 'Cricket', icon: TrendingUp },
    { id: 'FOOTBALL', label: 'Football', icon: TrendingUp },
    { id: 'TRAINING', label: 'Training Tips', icon: TrendingUp },
    { id: 'EVENTS', label: 'Event Planning', icon: Clock },
    { id: 'GENERAL', label: 'General', icon: MessageCircle }
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to create a post');
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const filteredPosts = posts?.filter(post => 
    (selectedCategory === 'ALL' || post.category === selectedCategory) &&
    (searchQuery === '' || 
     post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <MessageCircle className="h-8 w-8 mr-3 text-primary-500" />
            Community Forum
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with athletes, organizers, and sports enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* New Post Button */}
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full mb-6 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
            >
              <Send className="inline h-5 w-5 mr-2" />
              New Discussion
            </button>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Posts</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.totalPosts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.activeMembers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Today's Posts</span>
                  <span className="font-semibold text-primary-500">{stats.totalReplies}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* New Post Form */}
            {showNewPost && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Start a New Discussion
                </h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Discussion title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white"
                    >
                      {categories.filter(c => c.id !== 'ALL').map(category => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="What would you like to discuss?"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      required
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createPostMutation.isLoading}
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {createPostMutation.isLoading ? 'Posting...' : 'Post Discussion'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPost(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {post.authorName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {post.authorName || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {post.trending && (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 text-xs font-semibold rounded-full flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => likePostMutation.mutate(post.id)}
                          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                          <Reply className="h-4 w-4" />
                          <span className="text-sm">{post.replies} replies</span>
                        </button>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No discussions found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Be the first to start a conversation!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
