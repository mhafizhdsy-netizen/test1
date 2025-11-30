
import React from 'react';
import { GitRoverIcon } from '../../assets/icon';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 64, message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse"></div>
        
        {/* Animated Icon */}
        <GitRoverIcon 
          className="animate-float" 
          style={{ width: size, height: size }} 
        />
      </div>
      
      {/* Optional loading text */}
      {message ? (
        <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          {message}
        </p>
      ) : (
        <div className="mt-6 flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-50/80 dark:bg-base-950/80 backdrop-blur-sm transition-all duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px] transition-all duration-300">
      {content}
    </div>
  );
};

export default LoadingSpinner;
