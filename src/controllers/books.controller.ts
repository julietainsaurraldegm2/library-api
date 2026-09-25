import { Request, Response } from "express";
import * as booksRepository from "../repositories/books.repository.js";
import type { NewBook, BookFilters, UpdateBook } from "../types/books.js";
import type { Pagination } from "../types/common.js";

function toInt(value: unknown): number | null {
  if (typeof value !== "string") return null;
  if (!/^-?\d+$/.test(value)) return null;
  return Number(value);
}
 
function parseId(raw: unknown): number | null {
  const id = toInt(raw);
  if (id === null || id < 1) return null;
  return id;
}
 
export async function search(req: Request, res: Response) {
  const filters: BookFilters = {
      title: "",
      available: false,
      author_id: 0
  };
 
  if (req.query.title !== undefined) {
    if (typeof req.query.title !== "string" || req.query.title.trim() === "") {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    filters.title = req.query.title;
  }
 
  if (req.query.available !== undefined) {
    if (req.query.available !== "true" && req.query.available !== "false") {
      return res.status(400).json({ error: "available must be 'true' or 'false'" });
    }
    filters.available = req.query.available === "true";
  }
 
  if (req.query.author_id !== undefined) {
    const authorId = toInt(req.query.author_id);
    if (authorId === null || authorId < 1) {
      return res.status(400).json({ error: "author_id must be an integer greater than 0" });
    }
    filters.author_id = authorId;
  }
 
  let page = 1;
  if (req.query.page !== undefined) {
    const parsed = toInt(req.query.page);
    if (parsed === null || parsed < 1) {
      return res.status(400).json({ error: "page must be an integer greater than 0" });
    }
    page = parsed;
  }
 
  let limit = 10;
  if (req.query.limit !== undefined) {
    const parsed = toInt(req.query.limit);
    if (parsed === null || parsed < 1) {
      return res.status(400).json({ error: "limit must be an integer greater than 0" });
    }
    limit = parsed > 50 ? 50 : parsed;
  }
 
  const pagination: Pagination = { page, limit };
  const result = await booksRepository.search(filters, pagination);
  res.json(result);
}

export async function getOne(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Id must be an integer greater than 0" });
  }
 
  const book = await booksRepository.findById(id);
  if (book == null) {
    return res.status(404).json({ error: "Book not found" });
  }
 
  res.json(book);
}

export async function create(req: Request, res: Response){
    const data : NewBook = {title: req.body.title, year: req.body.year, author_id: req.body.author_id};
    const book = await booksRepository.create(data);
    res.status(201).json(book)
}

export async function update(req: Request, res: Response){
    const id = parseId(req.params.id);
    if(id === null ){
        return res.status(400).json({error: "Id must be integer greater than 0"});
    }
    const changes : UpdateBook = {}
    if(req.body.title !== undefined) changes.title = req.body.title;
    if(req.body.year !== undefined) changes.year = req.body.title;
    if(req.body.author_id !== undefined) changes.author_id;

    const book = await booksRepository.update(id, changes);
    if (book == null ){
        return res.status(404).json({error: "Book not found"})
    }
}

export async function replace(req: Request, res: Response){

}

export async function remove(req: Request, res: Response){}