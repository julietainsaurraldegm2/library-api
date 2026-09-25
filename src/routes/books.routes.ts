import { Router, Request, Response, NextFunction } from "express";
import * as booksRepository from "../repositories/books.repository.js"
import type { NewBook, UpdateBook } from "../types/books.js";

const router = Router();
router.get("/", async (_req, res) => {
     const page = await booksRepository.search({
         title: "",
         available: false,
         author_id: 0
     }, { page: 1, limit: 10 });
     res.json(page);
    });

router.get("/:id", async (req, res) => {
  const book = await booksRepository.findById(Number(req.params.id));
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json(book);
});

router.post("/", async(req, res)=>{
    const book = await booksRepository.create(req.body as NewBook);
    res.status(201).json(book);
});

router.put("/:id", async(req, res)=>{
    const book = await booksRepository.update( Number(req.params.id), req.body as UpdateBook);
    if(!book){
        res.status(404).json({error: "Book not found"})
            return;

    };
    res.json(book)
});

   router.patch("/:id", async (req, res) => {
     const book = await booksRepository.update(Number(req.params.id), req.body as UpdateBook);
     if (!book) {
       res.status(404).json({ error: "Book not found" });
       return;
     }
     res.json(book);
   });

router.delete("/:id", async(req, res)=>{
    const removed = await booksRepository.remove(Number(req.params.id));
    if(!removed){
        res.status(404).json({error: "Book not found"});
        return;
    }
    res.status(204).send();
});

export default router