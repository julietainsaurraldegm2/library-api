import bcrypt from "bcryptjs";
import { Jwt } from "jsonwebtoken";
import type { TokenPayload } from "../types/user.js";
import * as usersRepository from "../repositories/"

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function register(
  email: string,
  password: string
): Promise<"REGISTERED" | "EMAIL_TAKEN"> {
  const existing = await usersRepository.findByEmail(email);
  if (existing) return "EMAIL_TAKEN";
   const passwordHash = await bcrypt.hash(password, 10);
  await usersRepository.create(email, passwordHash);
  return "REGISTERED";
}
 
export async function login(emai: string, password: string): Promise <string | "INVALID_CREDENTIALS">{
const user = await usersRepository.findByEmail(email);
  if (!user) return "INVALID_CREDENTIALS";
 
  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return "INVALID_CREDENTIALS";
 
  const payload: TokenPayload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
 