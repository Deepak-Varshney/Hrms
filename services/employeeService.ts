import type { Employee, FetchParams, FetchResult, NewEmployee, Attendance, AttendanceStatus, FetchAttendanceParams } from '../types';
import { EmployeeStatus, AttendanceStatus as AStatus } from '../types';

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const positions = ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "Marketing Specialist", "HR Manager"];
const departments = ["Engineering", "Product", "Design", "Data", "Marketing", "Human Resources"];

const generateMockEmployees = (count: number): Employee[] => {
  const employees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const hireDate = new Date();
    hireDate.setDate(hireDate.getDate() - Math.floor(Math.random() * 1825)); // Hired within the last 5 years
    
    employees.push({
      id: `EMP-${1001 + i}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@corp.com`,
      position: positions[i % positions.length],
      department: departments[i % departments.length],
      hireDate: hireDate.toISOString().split('T')[0],
      salary: 50000 + Math.floor(Math.random() * 100000),
      status: Object.values(EmployeeStatus)[i % Object.values(EmployeeStatus).length],
    });
  }
  return employees;
};

let mockEmployees: Employee[] = generateMockEmployees(128);
let mockAttendance: Attendance[] = [];
let attendanceIdCounter = 1;

// Generate some mock attendance data for the last 30 days
const generateMockAttendance = () => {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        mockEmployees.forEach(emp => {
            // ~80% chance of being present
            if (Math.random() < 0.8) {
                const rand = Math.random();
                let status: AttendanceStatus;
                if(rand < 0.9) status = AStatus.PRESENT;
                else status = AStatus.LATE;

                mockAttendance.push({
                    id: `ATT-${attendanceIdCounter++}`,
                    employeeId: emp.id,
                    date: dateString,
                    status: status,
                });
            } else if (Math.random() < 0.5) { // ~10% chance of being absent
                 mockAttendance.push({
                    id: `ATT-${attendanceIdCounter++}`,
                    employeeId: emp.id,
                    date: dateString,
                    status: AStatus.ABSENT,
                });
            }
            // ~10% no record for the day
        });
    }
};

generateMockAttendance();


export const fetchEmployees = (params: FetchParams): Promise<FetchResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { page, limit, nameFilter, statusFilter } = params;

      let filteredData = mockEmployees;

      if (nameFilter) {
        filteredData = filteredData.filter(emp =>
          emp.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (statusFilter) {
        filteredData = filteredData.filter(emp => emp.status === statusFilter);
      }

      const totalCount = filteredData.length;
      const startIndex = (page - 1) * limit;
      const paginatedData = filteredData.slice(startIndex, startIndex + limit);

      resolve({
        data: paginatedData,
        totalCount: totalCount,
      });
    }, 500); // Simulate network delay
  });
};

export const getAllEmployees = (): Promise<Employee[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockEmployees);
        }, 100);
    });
};


export const createEmployee = (employeeData: NewEmployee): Promise<Employee> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newEmployee: Employee = {
        id: `EMP-${1001 + mockEmployees.length}`,
        ...employeeData,
      };
      mockEmployees.unshift(newEmployee); // Add to the beginning of the array
      resolve(newEmployee);
    }, 300);
  });
};

export const updateEmployee = (updatedEmployee: Employee): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(emp => emp.id === updatedEmployee.id);
      if (index !== -1) {
        mockEmployees[index] = updatedEmployee;
        resolve(updatedEmployee);
      } else {
        reject(new Error('Employee not found'));
      }
    }, 300);
  });
};

export const deleteEmployee = (employeeId: string): Promise<{ success: true }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      mockEmployees = mockEmployees.filter(emp => emp.id !== employeeId);
      resolve({ success: true });
    }, 300);
  });
};

export const addAttendance = (employeeId: string, date: string, status: AttendanceStatus): Promise<Attendance> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newAttendance: Attendance = {
                id: `ATT-${attendanceIdCounter++}`,
                employeeId,
                date,
                status,
            };
            mockAttendance.unshift(newAttendance);
            resolve(newAttendance);
        }, 300);
    });
};

export const fetchAllAttendance = (): Promise<Attendance[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockAttendance);
        }, 400);
    });
};

export const fetchAttendancePage = (params: FetchAttendanceParams): Promise<{ data: Attendance[], totalCount: number }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const { page, limit, nameFilter, statusFilter, dateFilter } = params;
            
            const employeeNameMap = mockEmployees.reduce((acc, emp) => {
                acc[emp.id] = emp.name;
                return acc;
            }, {} as Record<string, string>);

            let filteredData = mockAttendance;

            if (nameFilter) {
                const lowerNameFilter = nameFilter.toLowerCase();
                filteredData = filteredData.filter(att => 
                    employeeNameMap[att.employeeId]?.toLowerCase().includes(lowerNameFilter)
                );
            }

            if (statusFilter) {
                filteredData = filteredData.filter(att => att.status === statusFilter);
            }

            if (dateFilter) {
                filteredData = filteredData.filter(att => att.date === dateFilter);
            }
            
            // Sort by date descending
            filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const totalCount = filteredData.length;
            const startIndex = (page - 1) * limit;
            const paginatedData = filteredData.slice(startIndex, startIndex + limit);

            resolve({
                data: paginatedData,
                totalCount: totalCount,
            });
        }, 500);
    });
};
