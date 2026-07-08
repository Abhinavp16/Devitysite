import React from 'react';
import ThemeToggle from './ThemeToggle';

const Footer = () => {

  

  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
         
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="absolute right-4 bottom-4 sm:right-6 lg:right-8 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur-sm">
            <ThemeToggle />
          </div>
          <p className="text-gray-400">
            Made with ❤️ by Devity Tech Team
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2025 Devity. All rights reserved. | Privacy | Terms | Cookies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
