import ThemeToggle from './ThemeToggle';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer content grid — add columns here when needed */}
        <div className="relative border-t border-gray-800 mt-8 pt-8 text-center">
          {/* ThemeToggle anchored inside the relative wrapper */}
          <div className="absolute right-0 top-8 sm:right-2 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur-sm">
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
