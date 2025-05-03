import { Visitor } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock database using localStorage
const STORAGE_KEY = 'visitor_management_data';

export const getVisitors = (): Visitor[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving visitors:', error);
    return [];
  }
};

export const addVisitor = (visitorData: Omit<Visitor, 'id' | 'checkInTime'>): Visitor => {
  try {
    const visitors = getVisitors();
    
    const newVisitor: Visitor = {
      ...visitorData,
      id: uuidv4(),
      checkInTime: new Date(),
    };
    
    const updatedVisitors = [...visitors, newVisitor];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVisitors));
    
    return newVisitor;
  } catch (error) {
    console.error('Error adding visitor:', error);
    throw new Error('Failed to add visitor');
  }
};

export const checkOutVisitor = (id: string): Visitor | null => {
  try {
    const visitors = getVisitors();
    const visitorIndex = visitors.findIndex(v => v.id === id);
    
    if (visitorIndex === -1) return null;
    
    const updatedVisitor = {
      ...visitors[visitorIndex],
      checkOutTime: new Date()
    };
    
    visitors[visitorIndex] = updatedVisitor;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
    
    return updatedVisitor;
  } catch (error) {
    console.error('Error checking out visitor:', error);
    return null;
  }
};

export const deleteVisitor = (id: string): boolean => {
  try {
    const visitors = getVisitors();
    const filteredVisitors = visitors.filter(visitor => visitor.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVisitors));
    return true;
  } catch (error) {
    console.error('Error deleting visitor:', error);
    return false;
  }
};