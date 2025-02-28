import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';

export const formatDisplayDate = (dateString) => {
  try {
    if (!dateString) return '';
    
    // Convert dd-mm-yyyy to Date object
    let date;
    if (dateString.includes('-')) {
      const [day, month, year] = dateString.split('-');
      date = new Date(year, month - 1, day);
    } else {
      date = parseISO(dateString);
    }

    if (isNaN(date.getTime())) {
      return dateString;
    }

    if (isToday(date)) {
      return 'Today';
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }

    const daysDifference = differenceInDays(new Date(), date);
    if (daysDifference < 7) {
      return format(date, 'EEEE'); // Returns day name
    }

    return format(date, 'dd MMM yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

export const formatForInput = (dateString) => {
  try {
    if (!dateString) return '';

    let date;
    if (dateString.includes('-')) {
      const [day, month, year] = dateString.split('-');
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }

    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date input formatting error:', error);
    return '';
  }
};

export const formatForStorage = (dateString) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Date storage formatting error:', error);
    return '';
  }
};

export const getCurrentDateFormatted = () => {
  return format(new Date(), 'dd-MM-yyyy');
};

export const isValidDate = (dateString) => {
  try {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
