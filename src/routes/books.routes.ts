import { Router } from "express";
import * as booksController from "../controllers/books.controller.js"
import { authenticateToken, authorizeRole } from "../authentication.middleware.js";

const router = Router()

router.get("/", booksController.search);
router.get("/:id", booksController.getOne);
router.post("/", authenticateToken, booksController.create);
router.patch("/:id", authenticateToken, booksController.update);
router.put("/:id", authenticateToken, booksController.replace);
router.delete("/:id", authenticateToken, authorizeRole("ADMIN"), booksController.remove);

export default router