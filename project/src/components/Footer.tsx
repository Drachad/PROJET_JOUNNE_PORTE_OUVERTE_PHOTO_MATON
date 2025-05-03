import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} IFNTI - KBU. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-900 hover:text-blue-700 transition">
              À propos
            </a>
            <a href="#" className="text-blue-900 hover:text-blue-700 transition">
              Contact
            </a>
            <a href="#" className="text-blue-900 hover:text-blue-700 transition">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;