import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toaster } from './components/Toaster';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

const routes: { [key: string]: React.ComponentType } = {
  '/': Dashboard,
  '/employees': Employees,
  '/attendance': Attendance,
};

const App: React.FC = () => {
  const [path, setPath] = useState(window.location.hash.substring(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.substring(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    // Set initial path in case hash is missing
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const PageComponent = routes[path] || routes['/'];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 flex">
      <Sidebar currentPath={path} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <PageComponent />
      </main>
      <Toaster />
    </div>
  );
};

export default App;
