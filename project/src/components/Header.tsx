import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">IFNTI - KBU</h1>
            <p className="text-sm text-blue-200">Journée Portes Ouvertes - 3 Mai 2025</p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="inline-flex bg-blue-800 px-4 py-2 rounded-md">
            <span className="font-medium">Certificat de Participation</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;