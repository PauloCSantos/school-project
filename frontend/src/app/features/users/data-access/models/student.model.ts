export interface StudentModel {
  id: string;
  name: string;
  email: string;
  role: 'student';
  paymentYear?: number;
}
