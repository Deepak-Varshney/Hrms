import { EmployeeTable } from '@/components/EmployeeTable';

export default function EmployeesPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Employee Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
          Browse, filter, and manage employee records.
        </p>
      </header>
      <EmployeeTable />
    </div>
  );
}
