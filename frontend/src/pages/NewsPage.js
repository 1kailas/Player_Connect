import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { newsAPI } from '../services/api';
import { Newspaper, Calendar, User, Tag, Loader, X } from 'lucide-react';

const NewsPage = () => {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const observerTarget = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    ['news', category, debouncedSearch],
    async ({ pageParam = 0 }) => {
      const params = {
        page: pageParam,
        size: 12,
      };
      
      // Use category-specific endpoint if category is selected
      if (category) {
        const response = await newsAPI.getByCategory(category, params);
        return response.data.data;
      } else if (debouncedSearch) {
        const response = await newsAPI.search(debouncedSearch, params);
        return response.data.data;
      } else {
        const response = await newsAPI.getAll(params);
        return response.data.data;
      }
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      keepPreviousData: false,
      refetchOnWindowFocus: false,
    }
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Reset to first page when filters change
  useEffect(() => {
    refetch();
  }, [category, debouncedSearch, refetch]);

  // Extract all articles from pages
  const articles = data?.pages?.flatMap(page => page.content || []) || [];
  const totalElements = data?.pages?.[0]?.totalElements || 0;

  const categories = ['BREAKING', 'TRANSFER', 'MATCH_REPORT', 'INTERVIEW', 'ANALYSIS', 'INJURY', 'ANNOUNCEMENT'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sports News</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest sports news and updates</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs font-semibold rounded-full">
                      {article.category.replace('_', ' ')}
                    </span>
                    {article.featured && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{article.summary}</p>

                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-primary-500" />
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-2 text-success-500" />
                      {article.author?.username || 'Admin'}
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-2 text-warning-500" />
                        {Array.isArray(article.tags) 
                          ? article.tags.slice(0, 2).join(', ')
                          : article.tags.split(',').slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-2 rounded-lg transition-all duration-200 font-semibold transform hover:scale-105"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Newspaper className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for updates</p>
          </div>
        )}

        {/* Pagination Info */}
        {!isLoading && articles.length > 0 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Showing {articles.length} of {totalElements} articles
          </div>
        )}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="mt-8 flex justify-center items-center py-4">
            <Loader className="h-8 w-8 animate-spin text-primary-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading more articles...</span>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-10" />

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs font-semibold rounded-full">
                      {selectedArticle.category.replace('_', ' ')}
                    </span>
                    {selectedArticle.featured && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {selectedArticle.author?.username || 'Admin'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {selectedArticle.featuredImageUrl && (
                  <img 
                    src={selectedArticle.featuredImageUrl} 
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold mb-4">
                    {selectedArticle.summary}
                  </p>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </div>

                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {(Array.isArray(selectedArticle.tags) 
                      ? selectedArticle.tags 
                      : selectedArticle.tags.split(',')
                    ).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
