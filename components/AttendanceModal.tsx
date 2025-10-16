'use client';

import React, { useState } from 'react';
import type { Employee } from '@/types';
import { AttendanceStatus } from '@/types';
import { XIcon } from './icons/XIcon';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, date: string, status: AttendanceStatus) => Promise<void>;
  employee: Employee | null;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose, onSave, employee }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    
    setIsSaving(true);
    await onSave(employee.id, date, status);
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    // Reset state on close
    setDate(new Date().toISOString().split('T')[0]);
    setStatus(AttendanceStatus.PRESENT);
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
                  Record Attendance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For {employee.name}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" name="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select name="status" id="status" value={status} onChange={e => setStatus(e.target.value as AttendanceStatus)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  {Object.values(AttendanceStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
