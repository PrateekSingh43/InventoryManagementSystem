import { format, isToday, isYesterday } from 'date-fns';

// Parse dd-MM-yyyy date string to Date object
const parseIndianDate = (dateString) => {
  try {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split('-');
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error('Date parsing error:', error);
    return new Date();
  }
};

// Format date as dd-MM-yyyy
export const formatDate = (dateString) => {
  try {
    const date = parseIndianDate(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    return format(new Date(), 'dd-MM-yyyy');
  }
};

// Display date with relative terms (Today, Yesterday, etc.)
export const formatForDisplay = (dateString) => {
  try {
    const date = parseIndianDate(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'dd-MM-yyyy');
  } catch {
    return dateString || getCurrentDate();
  }
};

// Get current date in dd-MM-yyyy format
export const getCurrentDate = () => {
  return format(new Date(), 'dd-MM-yyyy');
};

// Convert HTML input date (yyyy-MM-dd) to Indian format (dd-MM-yyyy)
export const convertFromInputDate = (inputDate) => {
  try {
    if (!inputDate) return getCurrentDate();
    const [year, month, day] = inputDate.split('-');
    return `${day}-${month}-${year}`;
  } catch {
    return getCurrentDate();
  }
};

// Convert Indian format (dd-MM-yyyy) to HTML input format (yyyy-MM-dd)
export const convertToInputDate = (dateString) => {
  try {
    if (!dateString) return format(new Date(), 'yyyy-MM-dd');
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
};

// Export everything needed
export const formatDisplayDate = formatForDisplay;
