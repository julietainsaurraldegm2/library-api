export interface Loan {
    id: number;
    book_id: number;
    member_name: string;
    loan_date: string;
    return_date: string | null;
}

export interface NewLoan {
    book_id: number;
    member_name: string;
}

export type LoanReturn = string;