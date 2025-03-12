import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ children, className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`
      ${theme.background.primary}
      ${theme.text.primary}
      shadow-sm
      rounded-lg
      border
      ${theme.border}
      transition-colors
      duration-200
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
