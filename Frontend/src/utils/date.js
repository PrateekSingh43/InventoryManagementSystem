import { format } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const getCurrentDate = () => {
  return format(new Date(), 'dd-MM-yyyy');
};

export const formatDateForInput = (date) => {
  try {
    if (!date) return '';
    const d = new Date(date);
    return format(d, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const formatDateForDisplay = (dateString) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const getFormattedToday = () => {
  return formatDateForInput(new Date());
};
