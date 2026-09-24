import {Router} from "express"
import * as authorsRepository from "../repositories/authors.repository.js"

const router = Router();

router.get("/", async (_req, res)=> {
    const authors = await authorsRepository.findAll();
    res.json(authors);
});

router.get("/:id", async (_req, res)=> {
    const author = await authorsRepository.findById(Number(_req.params.id));
    if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  res.json(author);
});

export default router