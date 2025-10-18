import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-auto border-t border-gray-700 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-8 w-8" />
              <span className="text-xl font-bold">Sports Ranking</span>
            </div>
            <p className="text-gray-400">
              Your ultimate platform for sports events, rankings, and live match tracking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-gray-400 hover:text-white">
                  Matches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white text-left">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-white" aria-label="Github">
                <Github className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-white" aria-label="Email">
                <Mail className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Sports Ranking Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
