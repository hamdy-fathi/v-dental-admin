export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string; // Auto-generated timestamp
  updatedAt: string; // Auto-generated timestamp
}
