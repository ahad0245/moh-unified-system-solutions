import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-brand-secondary text-gray-500 dark:text-slate-400 py-6 mt-16">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-gray-900 dark:hover:text-white">Terms and Conditions</Link>
        </div>
        <p>&copy; 2025 Unified System Solutions. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;