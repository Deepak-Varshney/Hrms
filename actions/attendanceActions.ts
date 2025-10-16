'use server';

import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { Attendance as AttendanceType, AttendanceStatus, FetchAttendanceParams } from '@/types';
import { revalidatePath } from 'next/cache';

// Helper function to convert MongoDB document to Attendance type
function toAttendanceType(doc: any): AttendanceType {
  return {
    id: doc.attendanceId,
    employeeId: doc.employeeId,
    date: doc.date,
    status: doc.status,
  };
}

// Generate attendance ID
async function generateAttendanceId(): Promise<string> {
  await connectDB();
  const count = await Attendance.countDocuments();
  return `ATT-${1 + count}`;
}

export async function addAttendance(
  employeeId: string,
  date: string,
  status: AttendanceStatus
): Promise<AttendanceType> {
  try {
    await connectDB();

    const attendanceId = await generateAttendanceId();

    // Check if attendance already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({ employeeId, date });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();
      revalidatePath('/attendance');
      revalidatePath('/');
      return toAttendanceType(existingAttendance);
    }

    // Create new attendance record
    const newAttendance = await Attendance.create({
      attendanceId,
      employeeId,
      date,
      status,
    });

    revalidatePath('/attendance');
    revalidatePath('/');

    return toAttendanceType(newAttendance);
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw new Error('Failed to add attendance');
  }
}

export async function fetchAllAttendance(): Promise<AttendanceType[]> {
  try {
    await connectDB();
    const attendance = await Attendance.find().sort({ date: -1 }).lean();
    return attendance.map(toAttendanceType);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    throw new Error('Failed to fetch all attendance');
  }
}

export async function fetchAttendancePage(
  params: FetchAttendanceParams
): Promise<{ data: AttendanceType[]; totalCount: number }> {
  try {
    await connectDB();

    const { page, limit, nameFilter, statusFilter, dateFilter } = params;

    // Build query
    const query: any = {};

    if (statusFilter) {
      query.status = statusFilter;
    }

    if (dateFilter) {
      query.date = dateFilter;
    }

    // If name filter is provided, we need to find matching employees first
    let employeeIds: string[] | undefined;
    if (nameFilter) {
      const Employee = (await import('@/models/Employee')).default;
      const employees = await Employee.find(
        { name: { $regex: nameFilter, $options: 'i' } },
        { employeeId: 1 }
      ).lean();
      employeeIds = employees.map((emp: any) => emp.employeeId);

      if (employeeIds.length === 0) {
        return { data: [], totalCount: 0 };
      }

      query.employeeId = { $in: employeeIds };
    }

    // Get total count
    const totalCount = await Attendance.countDocuments(query);

    // Get paginated data
    const skip = (page - 1) * limit;
    const attendance = await Attendance.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const data = attendance.map(toAttendanceType);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching attendance page:', error);
    throw new Error('Failed to fetch attendance page');
  }
}
