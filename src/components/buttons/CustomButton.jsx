import React from 'react';

const CustomButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  loading = false, 
  loadingText = 'Đang xử lý...',
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
