export interface RegisterUser {
  first_name: string;
  last_name?: string; 
  email: string;
  phone: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone: string;
  password: string; 
  created_at: Date;
}