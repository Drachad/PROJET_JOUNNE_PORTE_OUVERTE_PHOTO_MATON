import React, { useState, useEffect } from 'react';
import { Visitor } from '../types';
import { getVisitors, checkOutVisitor, deleteVisitor } from '../utils/db';

export const VisitorList: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, checked-in, checked-out
  
  useEffect(() => {
    const loadVisitors = () => {
      const allVisitors = getVisitors();
      setVisitors(allVisitors);
    };
    
    loadVisitors();
    
    // Refresh the visitor list every minute
    const interval = setInterval(loadVisitors, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const handleCheckOut = (id: string) => {
    const updatedVisitor = checkOutVisitor(id);
    if (updatedVisitor) {
      setVisitors(prev => 
        prev.map(visitor => 
          visitor.id === id ? updatedVisitor : visitor
        )
      );
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      const success = deleteVisitor(id);
      if (success) {
        setVisitors(prev => prev.filter(visitor => visitor.id !== id));
      }
    }
  };
  
  const filteredVisitors = visitors
    .filter(visitor => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      return (
        visitor.name.toLowerCase().includes(searchLower) ||
        visitor.email.toLowerCase().includes(searchLower) ||
        visitor.hostName.toLowerCase().includes(searchLower) ||
        visitor.purpose.toLowerCase().includes(searchLower)
      );
    })
    .filter(visitor => {
      // Apply status filter
      if (filter === 'checked-in') {
        return !visitor.checkOutTime;
      } else if (filter === 'checked-out') {
        return visitor.checkOutTime;
      }
      return true; // 'all' filter
    })
    .sort((a, b) => {
      // Sort by check-in time (most recent first)
      return new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime();
    });
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Visitor List</h2>
      
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/2 mr-0 sm:mr-2">
          <input
            type="text"
            placeholder="Search visitors..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-1/3 ml-0 sm:ml-2">
          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Visitors</option>
            <option value="checked-in">Currently Checked In</option>
            <option value="checked-out">Checked Out</option>
          </select>
        </div>
      </div>
      
      {filteredVisitors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No visitors found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{visitor.name}</div>
                    <div className="text-sm text-gray-500">{visitor.email}</div>
                    <div className="text-sm text-gray-500">{visitor.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{visitor.hostName}</div>
                    <div className="text-sm text-gray-500">{visitor.purpose}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(visitor.checkInTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {visitor.checkOutTime ? formatDate(visitor.checkOutTime) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {!visitor.checkOutTime && (
                      <button 
                        onClick={() => handleCheckOut(visitor.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Check Out
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(visitor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};