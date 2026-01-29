export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  birthOfDate: Date;
  email: string;
  phone: number;
  type: 'user' | 'customer';
  created_at: string;
}
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: number;
  role: string;
  type: 'user' | 'customer';
  created_at: string;
}

export class CustomerModel {
  id?: number | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  username: string | null;
  phoneNumber: number | null;
  birthOfDate: Date | null;
  type: 'user' | 'customer';
  avatar: string | null;

  constructor(editData?: CustomerModel) {
    this.id = editData?.id || null;
    this.firstName = editData?.firstName || null;
    this.lastName = editData?.lastName || null;
    this.fullName = editData?.fullName || null;
    this.email = editData?.email || null;
    this.username = editData?.username || null;
    this.type = 'customer';
    this.phoneNumber = editData?.phoneNumber || null;
    this.birthOfDate = editData?.birthOfDate || null;
    this.avatar = editData?.avatar || null;
  }
}
export class UserModel {
  id?: number | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  username: string | null;
  type: 'user' | 'customer';
  phoneNumber: number | null;
  role: string | null;
  birthOfDate: Date | null;
  avatar: string | null;

  constructor(editData?: UserModel) {
    this.id = editData?.id || null;
    this.firstName = editData?.firstName || null;
    this.lastName = editData?.lastName || null;
    this.fullName = editData?.fullName || null;
    this.email = editData?.email || null;
    this.username = editData?.username || null;
    this.phoneNumber = editData?.phoneNumber || null;
    this.type = 'user';
    this.role = editData?.role || null;
    this.birthOfDate = editData?.birthOfDate || null;
    this.avatar = editData?.avatar || null;
  }
}
export class ChangePasswordModel {
  id?: number | null;
  password: string | null;
  password_confirmation: string | null;

  constructor(editData?: ChangePasswordModel) {
    this.id = editData?.id || null;
    this.password = editData?.password || null;
    this.password_confirmation = editData?.password_confirmation || null;
  }
}
