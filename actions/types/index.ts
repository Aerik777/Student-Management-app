export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface IStudent {
  _id?: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  enrollmentDate: Date;
}

export interface ICourse {
  _id?: string;
  title: string;
  code: string;
  credits: number;
  facultyId: string;
}