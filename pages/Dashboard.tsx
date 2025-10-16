import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllAttendance } from '../services/employeeService';
import type { Attendance } from '../types';
import { AttendanceStatus } from '../types';
import { StatCard } from '../components/StatCard';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { InfoCircleIcon } from '../components/icons/InfoCircleIcon';

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
}

const Dashboard: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const attendanceData = await fetchAllAttendance();
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const { todayStats, monthStats } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    const calculateStats = (data: Attendance[]): AttendanceStats => {
      return data.reduce((acc, record) => {
        if (record.status === AttendanceStatus.PRESENT) acc.present++;
        else if (record.status === AttendanceStatus.ABSENT) acc.absent++;
        else if (record.status === AttendanceStatus.LATE) acc.late++;
        return acc;
      }, { present: 0, absent: 0, late: 0 });
    };

    const todayRecords = attendance.filter(a => a.date === today);
    const monthRecords = attendance.filter(a => a.date.startsWith(currentMonth));

    return {
      todayStats: calculateStats(todayRecords),
      monthStats: calculateStats(monthRecords),
    };
  }, [attendance]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
          Welcome! Here's a summary of attendance.
        </p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Present" value={todayStats.present} icon={<CheckCircleIcon className="w-8 h-8 text-green-500"/>} isLoading={isLoading}/>
            <StatCard title="Absent" value={todayStats.absent} icon={<XCircleIcon className="w-8 h-8 text-red-500"/>} isLoading={isLoading}/>
            <StatCard title="Late" value={todayStats.late} icon={<InfoCircleIcon className="w-8 h-8 text-yellow-500"/>} isLoading={isLoading}/>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">This Month's Attendance Records</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Present" value={monthStats.present} icon={<CheckCircleIcon className="w-8 h-8 text-green-500"/>} isLoading={isLoading}/>
            <StatCard title="Absent" value={monthStats.absent} icon={<XCircleIcon className="w-8 h-8 text-red-500"/>} isLoading={isLoading}/>
            <StatCard title="Late" value={monthStats.late} icon={<InfoCircleIcon className="w-8 h-8 text-yellow-500"/>} isLoading={isLoading}/>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
