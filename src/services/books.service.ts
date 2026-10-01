import * as booksRepository from "../repositories/books.repository.js";
import * as authorsRepository from "../repositories/authors.repository.js";
import * as loansRepository from "../repositories/loans.repository.js";
import type { Book, BookFilters, NewBook, UpdateBook } from "../types/books.js";
import type { Page, Pagination } from "../types/common.js";
 
export async function search(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {
  return booksRepository.search(filters, pagination);
}
 
export async function getOne(id: number): Promise<Book | "BOOK_NOT_FOUND"> {
  const book = await booksRepository.findById(id);
  if (!book) return "BOOK_NOT_FOUND";
  return book;
}
 
export async function create(data: NewBook): Promise<Book | "AUTHOR_NOT_FOUND"> {
  const author = await authorsRepository.findById(data.author_id);
  if (!author) return "AUTHOR_NOT_FOUND";
 
  return booksRepository.create(data);
}
 
export async function update(
  id: number,
  changes: UpdateBook
): Promise<Book | "BOOK_NOT_FOUND" | "AUTHOR_NOT_FOUND"> {
  if (changes.author_id !== undefined) {
    const author = await authorsRepository.findById(changes.author_id);
    if (!author) return "AUTHOR_NOT_FOUND";
  }
 
  const book = await booksRepository.update(id, changes);
  if (!book) return "BOOK_NOT_FOUND";
  return book;
}
 
export async function remove(id: number): Promise<"DELETED" | "BOOK_NOT_FOUND" | "HAS_LOANS"> {
  const book = await booksRepository.findById(id);
  if (!book) return "BOOK_NOT_FOUND";
 
  const loanCount = await loansRepository.countByBook(id) ?? 0;
  if (loanCount > 0) return "HAS_LOANS";
 
  await booksRepository.remove(id);
  return "DELETED";
}
 