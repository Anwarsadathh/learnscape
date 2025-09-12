import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  disabled = false 
}: ButtonProps) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
    outline: "border-2 border-white text-white hover:bg-white hover:text-blue-600",
    gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-2xl"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
