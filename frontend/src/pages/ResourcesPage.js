import React, { useState, useEffect } from 'react';
import { Download, Eye, BookOpen, Video, FileText, Globe, Sparkles, TrendingUp, Book, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { resourcesAPI } from '../services/api';
import SearchInput from '../components/common/SearchInput';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'ALL',
    'TRAINING',
    'RULES',
    'NUTRITION',
    'COACHING',
    'EQUIPMENT',
    'FIRST_AID',
  ];

  const languages = [
    'ALL',
    'English',
    'Hindi',
    'Telugu',
    'Tamil',
    'Bengali',
    'Marathi',
    'Punjabi',
  ];

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = { page: 0, size: 100 };
      
      let response;
      if (selectedCategory === 'ALL') {
        response = await resourcesAPI.getAll(params);
      } else {
        response = await resourcesAPI.filter(selectedCategory, null, params);
      }
      
      setResources(response.data.data?.content || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
      setResources([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (resource) => {
    toast.success(`Downloading ${resource.title}...`);
    // Track download
    resourcesAPI.trackDownload(resource.id).catch(err => console.error('Failed to track download:', err));
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === 'ALL' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'ALL' || 
      (resource.languages && resource.languages.includes(selectedLanguage)) ||
      (resource.language && resource.language.includes(selectedLanguage));
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AI-powered resources...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Resources', value: resources.length, icon: Book },
    { label: 'AI-Generated', value: resources.filter(r => r.aiGenerated).length, icon: Sparkles },
    { label: 'Languages', value: '8+', icon: Globe },
    { label: 'Free Access', value: '100%', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Training Resources Library
            </h1>
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              AI-Powered
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Free educational materials with AI-generated content, guides, and tutorials to help you excel in sports.
            Available in multiple languages for everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col items-center text-center">
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources..."
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language === 'ALL' ? 'All Languages' : language}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative p-6">
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {resource.aiGenerated && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </div>
                  )}
                  {resource.isFeatured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    {resource.type === 'PDF' && <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
                    {resource.type === 'VIDEO' && <Video className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
                    {resource.type === 'ARTICLE' && <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                    {resource.category.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{resource.language.split(',')[0]}</span>
                    {resource.language.includes(',') && <span>+{resource.language.split(',').length - 1}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{resource.downloads}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(resource)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
