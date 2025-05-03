import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { getVisitors } from '../utils/db';
import { Visitor } from '../types';

export const Certificate: React.FC = () => {
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const certificateRef = useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // Load all checked out visitors
    const allVisitors = getVisitors().filter(v => v.checkOutTime);
    setVisitors(allVisitors);
  }, []);
  
  const selectedVisitor = visitors.find(v => v.id === selectedVisitorId);
  
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const calculateDuration = (checkIn: Date | string, checkOut: Date | string | undefined) => {
    if (!checkOut) return '';
    
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diffMs = end - start;
    
    // Convert to hours and minutes
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  
  const generateCertificate = async () => {
    if (!certificateRef.current || !selectedVisitor) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `certificate-${selectedVisitor.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating certificate:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Visitor Certificate</h2>
      
      <div className="mb-6">
        <label htmlFor="visitor-select" className="block text-gray-700 font-medium mb-2">
          Select Visitor
        </label>
        <select
          id="visitor-select"
          className="form-input"
          value={selectedVisitorId}
          onChange={(e) => setSelectedVisitorId(e.target.value)}
        >
          <option value="">-- Select a visitor --</option>
          {visitors.map((visitor) => (
            <option key={visitor.id} value={visitor.id}>
              {visitor.name} ({formatDate(visitor.checkInTime)})
            </option>
          ))}
        </select>
      </div>
      
      {selectedVisitor ? (
        <>
          <div 
            ref={certificateRef}
            className="certificate-container border-4 border-blue-600 rounded-lg p-8 mb-6 bg-white"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">CERTIFICATE OF VISITATION</h1>
              <div className="mb-2 text-gray-600">VISITOR MANAGEMENT SYSTEM</div>
              <div className="w-3/4 h-px bg-gray-300 mx-auto my-4"></div>
            </div>
            
            <div className="text-center my-6">
              <p className="text-lg">This certifies that</p>
              <h2 className="text-2xl font-bold my-2">{selectedVisitor.name}</h2>
              <p className="text-lg mb-4">visited our facility on</p>
              <p className="text-xl font-medium">{formatDate(selectedVisitor.checkInTime)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Visit Details:</h3>
                <p><span className="font-medium">Host:</span> {selectedVisitor.hostName}</p>
                <p><span className="font-medium">Purpose:</span> {selectedVisitor.purpose}</p>
                <p><span className="font-medium">Check-in:</span> {new Date(selectedVisitor.checkInTime).toLocaleTimeString()}</p>
                <p><span className="font-medium">Check-out:</span> {selectedVisitor.checkOutTime ? new Date(selectedVisitor.checkOutTime).toLocaleTimeString() : 'N/A'}</p>
                <p><span className="font-medium">Duration:</span> {calculateDuration(selectedVisitor.checkInTime, selectedVisitor.checkOutTime)}</p>
              </div>
              <div className="flex justify-center items-center">
                <div className="border-2 border-gray-300 w-40 h-40 rounded flex items-center justify-center">
                  {selectedVisitor.photoUrl ? (
                    <img 
                      src={selectedVisitor.photoUrl} 
                      alt="Visitor"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <div className="text-center text-gray-500 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      No Photo
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center">
              <div className="text-center">
                <div className="w-48 h-px bg-gray-600 mb-1"></div>
                <p className="text-sm">Visitor Signature</p>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-px bg-gray-600 mb-1"></div>
                <p className="text-sm">Authorized Signature</p>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>This certificate serves as proof of visit and should be kept for your records.</p>
              <p>Certificate ID: {selectedVisitor.id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={generateCertificate}
              disabled={isGenerating}
              className="btn btn-primary"
            >
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 mb-4">Please select a visitor to generate a certificate.</p>
          {visitors.length === 0 && (
            <p className="text-sm text-gray-400">No checked-out visitors found. Certificates are only available for visitors who have completed their visit.</p>
          )}
        </div>
      )}
    </div>
  );
};