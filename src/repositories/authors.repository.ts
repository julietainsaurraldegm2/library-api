import {Author as AuthorModel} from "../models/index.js"

import type {Author} from "../types/author.js"

export async function findAll(): Promise<Author[]>{
    const rows = await AuthorModel.findAll();
    return rows.map((row)=> row.toJSON());
}


export async function findById(id: number): Promise <Author | null >{
    const row = await AuthorModel.findByPk(id);
    return row ? row.toJSON() : null

}

export async function remove(id: number): Promise <boolean>{
    const deleted = await AuthorModel.destroy({where: {id}});
    return deleted > 0;
    
}
