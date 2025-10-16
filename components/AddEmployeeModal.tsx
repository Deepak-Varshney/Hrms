'use client';

import React, { useState } from 'react';
import type { NewEmployee } from '@/types';
import { EmployeeStatus } from '@/types';
import { XIcon } from './icons/XIcon';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: NewEmployee) => Promise<void>;
}

const initialFormData: NewEmployee = {
  name: '',
  email: '',
  position: '',
  department: '',
  hireDate: new Date().toISOString().split('T')[0],
  salary: 50000,
  status: EmployeeStatus.ACTIVE,
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewEmployee>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
        newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email is not valid.';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required.';
    if (!formData.department.trim()) newErrors.department = 'Department is required.';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be a positive number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    setFormData(initialFormData);
    onClose();
  };
  
  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all overflow-hidden" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
                Add New Employee
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
               <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
              </div>
               <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
                    <input type="number" name="salary" id="salary" min="0" step="1000" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                </div>
                <div>
                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hire Date</label>
                    <input type="date" name="hireDate" id="hireDate" value={formData.hireDate} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  {Object.values(EmployeeStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
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
              {isSaving ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
