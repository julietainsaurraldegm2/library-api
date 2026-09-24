import {Router} from "express"
import * as authorsRepository from "../repositories/authors.repository.js"

const router = Router();

router.get("/", async (_req, res)=> {
    const authors = await authorsRepository.findAll();
    res.json(authors);
});

router.get("/:id", async (_req, res)=> {
    const author = await authorsRepository.findById(Number(req.params.id));
    if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  res.json(author);
});

router.delete("/:id", async (req, res) => {
  const removed = await authorsRepository.remove(Number(req.params.id));
  if (!removed) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  res.status(204).send();
});
 
export default router;
 