import { AttendanceTable } from '@/components/AttendanceTable';

export default function AttendancePage() {
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
      <AttendanceTable />
    </div>
  );
}
