import React from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface SidebarProps {
  currentPath: string;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: DashboardIcon },
  { path: '/employees', label: 'Employees', icon: UsersIcon },
  { path: '/attendance', label: 'Attendance', icon: CalendarIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">HRMS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map(item => {
          const isActive = currentPath === item.path;
          return (
            <a
              key={item.path}
              href={`#${item.path}`}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
