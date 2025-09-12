import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg ${hover ? 'hover:shadow-2xl transition-all duration-300 hover:-translate-y-2' : ''} ${className}`}>
      {children}
    </div>
  );
}
