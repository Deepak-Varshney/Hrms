'use server';

import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { Employee as EmployeeType, NewEmployee, FetchParams, FetchResult, EmployeeStatus } from '@/types';
import { revalidatePath } from 'next/cache';

// Helper function to convert MongoDB document to Employee type
function toEmployeeType(doc: any): EmployeeType {
  return {
    id: doc.employeeId,
    name: doc.name,
    email: doc.email,
    position: doc.position,
    department: doc.department,
    hireDate: doc.hireDate,
    salary: doc.salary,
    status: doc.status,
  };
}

// Generate employee ID
async function generateEmployeeId(): Promise<string> {
  await connectDB();
  const count = await Employee.countDocuments();
  return `EMP-${1001 + count}`;
}

export async function fetchEmployees(params: FetchParams): Promise<FetchResult> {
  try {
    await connectDB();

    const { page, limit, nameFilter, statusFilter } = params;

    // Build query
    const query: any = {};

    if (nameFilter) {
      query.name = { $regex: nameFilter, $options: 'i' };
    }

    if (statusFilter) {
      query.status = statusFilter;
    }

    // Get total count
    const totalCount = await Employee.countDocuments(query);

    // Get paginated data
    const skip = (page - 1) * limit;
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const data = employees.map(toEmployeeType);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

export async function getAllEmployees(): Promise<EmployeeType[]> {
  try {
    await connectDB();
    const employees = await Employee.find().sort({ createdAt: -1 }).lean();
    return employees.map(toEmployeeType);
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw new Error('Failed to fetch all employees');
  }
}

export async function createEmployee(employeeData: NewEmployee): Promise<EmployeeType> {
  try {
    await connectDB();

    const employeeId = await generateEmployeeId();

    const newEmployee = await Employee.create({
      employeeId,
      ...employeeData,
    });

    revalidatePath('/employees');
    revalidatePath('/');

    return toEmployeeType(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    throw new Error('Failed to create employee');
  }
}

export async function updateEmployee(updatedEmployee: EmployeeType): Promise<EmployeeType> {
  try {
    await connectDB();

    const employee = await Employee.findOneAndUpdate(
      { employeeId: updatedEmployee.id },
      {
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        position: updatedEmployee.position,
        department: updatedEmployee.department,
        hireDate: updatedEmployee.hireDate,
        salary: updatedEmployee.salary,
        status: updatedEmployee.status,
      },
      { new: true, lean: true }
    );

    if (!employee) {
      throw new Error('Employee not found');
    }

    revalidatePath('/employees');
    revalidatePath('/');

    return toEmployeeType(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw new Error('Failed to update employee');
  }
}

export async function deleteEmployee(employeeId: string): Promise<{ success: boolean }> {
  try {
    await connectDB();

    const result = await Employee.deleteOne({ employeeId });

    if (result.deletedCount === 0) {
      throw new Error('Employee not found');
    }

    revalidatePath('/employees');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw new Error('Failed to delete employee');
  }
}
