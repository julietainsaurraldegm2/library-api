export type Role = "admin" | "member";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface NewUser {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: Role;
}