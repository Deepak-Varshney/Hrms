export enum EmployeeStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated',
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: EmployeeStatus;
}

export type NewEmployee = Omit<Employee, 'id'>;

export interface FetchParams {
  page: number;
  limit: number;
  nameFilter: string;
  statusFilter: EmployeeStatus | '';
}

export interface FetchResult {
  data: Employee[];
  totalCount: number;
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
}

export interface FetchAttendanceParams {
  page: number;
  limit: number;
  nameFilter: string;
  statusFilter: AttendanceStatus | '';
  dateFilter: string;
}
