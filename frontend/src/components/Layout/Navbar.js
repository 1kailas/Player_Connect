import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Trophy, User, LogOut } from 'lucide-react';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    px-3 py-2 rounded-md font-medium text-sm transition-all duration-200
    ${isActive(path) 
      ? 'bg-primary-600 dark:bg-primary-600 text-white' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }
  `;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Sports Ranking
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/events" className={navLinkClass('/events')}>
              Events
            </Link>
            <Link to="/nearby" className={navLinkClass('/nearby')}>
              Nearby
            </Link>
            <Link to="/matches" className={navLinkClass('/matches')}>
              Matches
            </Link>
            <Link to="/community" className={navLinkClass('/community')}>
              Community
            </Link>
            <Link to="/resources" className={navLinkClass('/resources')}>
              Resources
            </Link>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/my-events" className={navLinkClass('/my-events')}>
                  My Events
                </Link>
                <Link to="/event-requests" className={navLinkClass('/event-requests')}>
                  Request Event
                </Link>
                
                {user.roles?.includes('ADMIN') && (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md font-medium text-sm bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Profile */}
                <Link 
                  to="/profile" 
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <NotificationBell />}
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="space-y-1">
              <Link
                to="/events"
                className={`block px-3 py-2 rounded-md ${isActive('/events') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/nearby"
                className={`block px-3 py-2 rounded-md ${isActive('/nearby') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Nearby
              </Link>
              <Link
                to="/matches"
                className={`block px-3 py-2 rounded-md ${isActive('/matches') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Matches
              </Link>
              <Link
                to="/community"
                className={`block px-3 py-2 rounded-md ${isActive('/community') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/resources"
                className={`block px-3 py-2 rounded-md ${isActive('/resources') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Resources
              </Link>

              {user ? (
                <>
                  <div className="h-px bg-gray-300 dark:bg-gray-700 my-2" />
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md ${isActive('/dashboard') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-events"
                    className={`block px-3 py-2 rounded-md ${isActive('/my-events') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    My Events
                  </Link>
                  <Link
                    to="/event-requests"
                    className={`block px-3 py-2 rounded-md ${isActive('/event-requests') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Request Event
                  </Link>
                  {user.roles?.includes('ADMIN') && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md bg-warning-500 text-white font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md ${isActive('/profile') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md bg-danger-500 text-white font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-gray-300 dark:bg-gray-700 my-2" />
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md bg-success-500 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
