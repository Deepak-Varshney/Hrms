import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Attendance, Employee } from '../types';
import { AttendanceStatus } from '../types';
import { fetchAttendancePage, getAllEmployees } from '../services/employeeService';
import { PAGE_SIZE } from '../constants';
import { Pagination } from '../components/Pagination';
import { SearchIcon } from '../components/icons/SearchIcon';
import { FilterXIcon } from '../components/icons/FilterXIcon';
import { toast } from '../lib/sonner';

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const AttendanceStatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const statusClasses = useMemo(() => {
        switch (status) {
            case AttendanceStatus.PRESENT:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case AttendanceStatus.LATE:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case AttendanceStatus.ABSENT:
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    }, [status]);
    
    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = PAGE_SIZE }) => (
    <tbody>
        {Array.from({ length: rows }).map((_, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);


const Attendance: React.FC = () => {
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
    const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameFilter, setNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | ''>('');
    const [dateFilter, setDateFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const debouncedNameFilter = useDebounce(nameFilter, 300);

    useEffect(() => {
        getAllEmployees().then(employees => {
            const map = employees.reduce((acc, emp) => {
                acc[emp.id] = emp.name;
                return acc;
            }, {} as Record<string, string>);
            setEmployeeMap(map);
        });
    }, []);

    const loadAttendance = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchAttendancePage({
                page: currentPage,
                limit: PAGE_SIZE,
                nameFilter: debouncedNameFilter,
                statusFilter: statusFilter,
                dateFilter: dateFilter,
            });
            setAttendanceRecords(result.data);
            setTotalCount(result.totalCount);
        } catch (error) {
            toast.error('Failed to load attendance records.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedNameFilter, statusFilter, dateFilter]);

    useEffect(() => {
        if (Object.keys(employeeMap).length > 0) {
            loadAttendance();
        }
    }, [loadAttendance, employeeMap]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedNameFilter, statusFilter, dateFilter]);
    
    const clearFilters = () => {
      setNameFilter('');
      setStatusFilter('');
      setDateFilter('');
      setCurrentPage(1);
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Attendance Records
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    View and filter all employee attendance records.
                </p>
            </header>
            
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                           <div className="relative w-full sm:max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter by name..."
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={e => setDateFilter(e.target.value)}
                                className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | '')}
                                className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">All Statuses</option>
                                {Object.values(AttendanceStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                             {(nameFilter || statusFilter || dateFilter) && (
                                <button onClick={clearFilters} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md" aria-label="Clear filters">
                                    <FilterXIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        {isLoading ? <TableSkeleton /> : (
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                               {attendanceRecords.length > 0 ? attendanceRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{employeeMap[record.employeeId] || 'Unknown Employee'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{record.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <AttendanceStatusBadge status={record.status} />
                                        </td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            No attendance records found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
                 <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Attendance;
