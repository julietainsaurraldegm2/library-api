import express, { Request, Response } from "express";
import { sequelize } from "./db/connection.js";
import docsRouter from "./docs.js";
import authorsRouter from "./routes/authors.routes.js";
import booksRouter from "./routes/books.routes.js";
import "dotenv/config";


const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json());

// Logging
app.use((req: Request, res: Response, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

// Ruta de prueba
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Library API running",
    docs: `http://localhost:${PORT}/docs`,
  });
});

// Documentación
app.use("/docs", docsRouter);

// Rutas
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);
// app.use("/loans", loansRouter);

// Manejo centralizado de errores
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error("Error:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Errores no manejados de Promises
process.on("unhandledRejection", (error) => {
  console.error(" Unhandled error:", error);
});

async function start() {
  await sequelize.authenticate();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Docs available at    http://localhost:${PORT}/docs`);
  });
}

start();
