'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Employee, NewEmployee } from '@/types';
import { EmployeeStatus, AttendanceStatus } from '@/types';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/actions/employeeActions';
import { addAttendance } from '@/actions/attendanceActions';
import { PAGE_SIZE } from '@/constants';
import { Pagination } from './Pagination';
import { SearchIcon } from './icons/SearchIcon';
import { FilterXIcon } from './icons/FilterXIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';
import { AttendanceModal } from './AttendanceModal';
import { toast } from 'sonner';

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

const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const statusClasses = useMemo(() => {
        switch (status) {
            case EmployeeStatus.ACTIVE:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case EmployeeStatus.ON_LEAVE:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case EmployeeStatus.TERMINATED:
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
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);


export const EmployeeTable: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameFilter, setNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<EmployeeStatus | ''>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const debouncedNameFilter = useDebounce(nameFilter, 300);

    const loadEmployees = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchEmployees({
                page: currentPage,
                limit: PAGE_SIZE,
                nameFilter: debouncedNameFilter,
                statusFilter: statusFilter
            });
            setEmployees(result.data);
            setTotalCount(result.totalCount);
        } catch (error) {
            toast.error('Failed to load employees.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedNameFilter, statusFilter]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedNameFilter, statusFilter]);
    
    const clearFilters = () => {
      setNameFilter('');
      setStatusFilter('');
      setCurrentPage(1);
    };

    const handleAddEmployee = async (employeeData: NewEmployee) => {
        await createEmployee(employeeData);
        toast.success('Employee added successfully!');
        setNameFilter('');
        setStatusFilter('');
        if (currentPage !== 1) setCurrentPage(1);
        else loadEmployees();
    };

    const handleUpdateEmployee = async (employeeData: Employee) => {
        await updateEmployee(employeeData);
        toast.success('Employee updated successfully!');
        setIsDetailsModalOpen(false);
        setSelectedEmployee(null);
        loadEmployees();
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(employeeId);
            toast.success('Employee deleted successfully!');
            loadEmployees();
        }
    };
    
    const handleAddAttendance = async (employeeId: string, date: string, status: AttendanceStatus) => {
        await addAttendance(employeeId, date, status);
        toast.success('Attendance recorded successfully!');
        setIsAttendanceModalOpen(false);
        setSelectedEmployee(null);
    }

    const openDetailsModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDetailsModalOpen(true);
    };
    
    const openAttendanceModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsAttendanceModalOpen(true);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
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
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | '')}
                                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.values(EmployeeStatus).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                {(nameFilter || statusFilter) && (
                                    <button onClick={clearFilters} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md" aria-label="Clear filters">
                                        <FilterXIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex-shrink-0">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Add Employee</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hire Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Salary</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        {isLoading ? <TableSkeleton /> : (
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                               {employees.length > 0 ? employees.map((employee) => (
                                    <tr key={employee.id} onClick={() => openDetailsModal(employee)} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{employee.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{employee.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{employee.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{employee.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{employee.hireDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(employee.salary)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <StatusBadge status={employee.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); openAttendanceModal(employee); }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1" title="Add Attendance">
                                                    <CalendarIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(employee.id); }} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1" title="Delete Employee">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            No employees found matching your criteria.
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
            <AddEmployeeModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddEmployee}
            />
            <EmployeeDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => { setIsDetailsModalOpen(false); setSelectedEmployee(null); }}
                onSave={handleUpdateEmployee}
                employee={selectedEmployee}
            />
            <AttendanceModal
                isOpen={isAttendanceModalOpen}
                onClose={() => { setIsAttendanceModalOpen(false); setSelectedEmployee(null); }}
                onSave={handleAddAttendance}
                employee={selectedEmployee}
            />
        </>
    );
};
