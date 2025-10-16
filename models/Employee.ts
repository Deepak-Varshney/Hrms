import mongoose, { Schema, Model } from 'mongoose';
import { EmployeeStatus } from '@/types';

export interface IEmployee {
  _id?: string;
  employeeId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: EmployeeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    hireDate: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EmployeeStatus),
      default: EmployeeStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for filtering and sorting
EmployeeSchema.index({ name: 1, status: 1 });

const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
