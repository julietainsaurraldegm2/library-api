import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const users: { email: string; passwordHash: string; role: "admin" | "member" }[] = [];

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash, role: "member" });
  res.status(201).json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

export default router;