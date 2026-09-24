import { Book as BookModel } from "../models/index.js";
import type { Book, NewBook, UpdateBook, BookFilters } from "../types/books.js";
import type { Page, Pagination } from "../types/common.js";

export async function findById(id: number): Promise< Book| null >{
        const row = await BookModel.findByPk(id);
         return row ? row.toJSON() : null
    }

//export async function search(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {}

export async function create(data: NewBook): Promise<Book>{
        const row = await BookModel.create({...data, available: true});
         return row.toJSON();
}

export async function update(id: number, changes: UpdateBook): Promise<Book | null>{
        const row = await BookModel.findByPk(id);
        if(!row) return null;
        await row.update(changes);
        return row.toJSON();
}

export async function remove(id: number): Promise<boolean>{
        const deleted = await BookModel.destroy({where: {id}});
        return deleted > 0
}

