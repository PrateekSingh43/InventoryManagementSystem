import { Link } from 'react-router-dom';

const CustomLink = ({ to, children, className = '', ...props }) => {
  return (
    <Link
      to={to}
      className={`${className} focus:outline-none focus:ring-0 hover:no-underline`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
