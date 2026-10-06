import {Request, Response } from "express";
import * as authService from "../services/auth.service.js"

export async function register(req: Request, res: Response){

    const {email, password} = req.body;

     if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return res.status(400).json({ error: "email and password are required" });
  }

  const result = await authService.register(email,password);
  if(result === "EMAIL_TAKEN")
    return res.status(409).json({error: "email already registered"})

  res.status(201).json({message: "user registered"})
}

export async function login(req: Request, res: Response){
    const {email, password} = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
          return res.status(400).json({ error: "email and password are required" });
  }
    const result = await authService.login(email, password);
    if (result === "INVALID_CREDENTIALS") {
          return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ token: result });
}