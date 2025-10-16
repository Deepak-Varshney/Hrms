import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
        ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {icon}
      </div>
    </div>
  );
};
