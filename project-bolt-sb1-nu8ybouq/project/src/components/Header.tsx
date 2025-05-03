import React from 'react';
import { TabProps } from '../types';

export const Header: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Visitor Management System</h1>
          
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto w-full sm:w-auto">
            <button 
              className={`tab ${activeTab === 'check-in' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('check-in')}
            >
              Check In
            </button>
            <button 
              className={`tab ${activeTab === 'visitors' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('visitors')}
            >
              Visitors
            </button>
            <button 
              className={`tab ${activeTab === 'photo' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              Photo Capture
            </button>
            <button 
              className={`tab ${activeTab === 'certificate' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('certificate')}
            >
              Certificate
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};