import React, { useState } from 'react';
import { addVisitor } from '../utils/db';

export const VisitorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    hostName: '',
    photoUrl: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose of visit is required';
    }
    
    if (!formData.hostName.trim()) {
      newErrors.hostName = 'Host name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await addVisitor(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        purpose: '',
        hostName: '',
        photoUrl: ''
      });
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Visitor Check-In</h2>
      
      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Visitor successfully checked in!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="hostName" className="block text-gray-700 font-medium mb-1">Host Name *</label>
            <input
              type="text"
              id="hostName"
              name="hostName"
              className={`form-input ${errors.hostName ? 'border-red-500' : ''}`}
              value={formData.hostName}
              onChange={handleChange}
            />
            {errors.hostName && <p className="text-red-500 text-sm mt-1">{errors.hostName}</p>}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="purpose" className="block text-gray-700 font-medium mb-1">Purpose of Visit *</label>
          <textarea
            id="purpose"
            name="purpose"
            rows={3}
            className={`form-input ${errors.purpose ? 'border-red-500' : ''}`}
            value={formData.purpose}
            onChange={handleChange}
          />
          {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Check In'}
          </button>
        </div>
      </form>
    </div>
  );
};