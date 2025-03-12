// src/utils/dateUtility.js

import { format, parse, isValid } from 'date-fns';

// Core date format for the entire application
export const DATE_FORMAT = 'dd-MM-yyyy';

// Parse any date string to Date object
export const parseDate = (dateString) => {
  if (!dateString) return new Date();
  
  try {
    // Handle dd-MM-yyyy format
    if (dateString.includes('-')) {
      const [day, month, year] = dateString.split('-');
      return new Date(year, month - 1, day);
    }
    return new Date(dateString);
  } catch (error) {
    console.error('Date parsing error:', error);
    return new Date();
  }
};

// Format date for display (dd-MM-yyyy)
export const formatDate = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseDate(date) : date;
    return format(parsedDate, DATE_FORMAT);
  } catch (error) {
    console.error('Date formatting error:', error);
    return format(new Date(), DATE_FORMAT);
  }
};

// Format date for storage (always dd-MM-yyyy)
export const formatForStorage = (date) => {
  return formatDate(date);
};

// Get current date in dd-MM-yyyy format
export const getCurrentDate = () => {
  return format(new Date(), DATE_FORMAT);
};

// Validate if string is in correct dd-MM-yyyy format
export const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  return regex.test(dateString);
};
