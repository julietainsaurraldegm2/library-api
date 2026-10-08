import { User as UserModel } from "../models/User.js";
import type { User } from "../types/user.js";

export async function findUserByEmail(email: string){
const row = await UserModel.findOne({where: {email} });
return row ? row.toJSON() : null; 
}

export async function createUser(email: string, passwordHash: string): Promise <User>{
const row = await UserModel.create({email, passwordHash});
return row.toJSON() 

}