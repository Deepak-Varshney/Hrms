import mongoose, { Schema, Model } from 'mongoose';
import { AttendanceStatus } from '@/types';

export interface IAttendance {
  _id?: string;
  attendanceId: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    attendanceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
AttendanceSchema.index({ employeeId: 1, date: 1 });
AttendanceSchema.index({ date: 1, status: 1 });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
