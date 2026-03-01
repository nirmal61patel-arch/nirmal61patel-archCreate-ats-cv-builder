import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ATS CV Builder</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Templates
            </Link>
            <Link
              to="/builder"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/builder'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Builder
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
