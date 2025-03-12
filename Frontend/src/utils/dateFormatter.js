// src/utils/dateFormatter.js

import { format, parse } from 'date-fns';

// Converts yyyy-MM-dd to dd-MM-yyyy
export const convertFromInputDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(parsedDate, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Date parsing error:', error);
    return '';
  }
};

// Converts a date to yyyy-MM-dd format for HTML input
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// (Optional) Convert HTML input date format (yyyy-MM-dd) back to dd-MM-yyyy
export const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  try {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    return parsedDate;
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
};

// Format date for display (dd-MM-yyyy)
export const formatDisplayDate = (date) => {
  try {
    return format(new Date(date), 'dd-MM-yyyy');
  } catch {
    return 'Invalid Date';
  }
};

// Format date for input/storage (yyyy-MM-dd)
export const formatStorageDate = (date) => {
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
};

// Parse displayed date (dd-MM-yyyy) to storage format (yyyy-MM-dd)
export const parseDisplayDate = (displayDate) => {
  try {
    const parsedDate = parse(displayDate, 'dd-MM-yyyy', new Date());
    return format(parsedDate, 'yyyy-MM-dd');
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
};
