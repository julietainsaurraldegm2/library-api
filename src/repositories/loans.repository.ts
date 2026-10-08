import { sequelize } from "../db/connection.js";
import { Book as BookModel, Loan as LoanModel } from "../models/index.js";
import type { Loan, NewLoan } from "../types/loan.js";
 
export async function findAll(activeOnly: boolean): Promise<Loan[]> {
  const rows = await LoanModel.findAll({
    where: activeOnly ? { return_date: null } : {},
    order: [["id", "ASC"]],
  });
  return rows.map((row) => row.toJSON());
}
 
export async function findById(id: number): Promise<Loan | null> {
  const row = await LoanModel.findByPk(id);
  return row ? row.toJSON() : null;
}
 
export async function countByBook(bookId: number): Promise<number> {
  return LoanModel.count({ where: { book_id: bookId } });
}
 
export async function create(data: NewLoan, loanDate: string): Promise<Loan> {
  return sequelize.transaction(async (t) => {
    const row = await LoanModel.create(
      { book_id: data.book_id, member_name: data.member_name, loan_date: loanDate },
      { transaction: t }
    );
    await BookModel.update(
      { available: false },
      { where: { id: data.book_id }, transaction: t }
    );
    return row.toJSON();
  });
}
 
export async function registerReturn(
  id: number,
  returnDate: string
): Promise<Loan | null> {
  return sequelize.transaction(async (t) => {
    const row = await LoanModel.findByPk(id, { transaction: t });
    if (!row) return null;
    await row.update({ return_date: returnDate }, { transaction: t });
    await BookModel.update(
      { available: true },
      { where: { id: row.book_id }, transaction: t }
    );
    return row.toJSON();
  });
}
