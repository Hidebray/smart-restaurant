
import React, { useEffect } from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle } from 'lucide-react';

const Toast: React.FC = () => {
  const { isOpen, message, hideToast } = useToastStore();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideToast]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] animate-fade-in-down">
        <div className="flex items-center p-4 text-sm text-gray-800 bg-green-100 rounded-lg shadow-lg dark:bg-gray-800 dark:text-green-400" role="alert">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
            <span className="font-medium">{message}</span>
        </div>
    </div>
  );
};

export default Toast;
