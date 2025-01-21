import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";;

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { TransactionCategory, TransactionType, Details, Account, Amount, initializedDate } = await req.json();

    // Input validation
    if (!TransactionCategory || !TransactionType || !Details || !Account || !Amount|| !initializedDate) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    const status = "Paid";
    try {
      

        // Insert the new transaction into the database
        const inserttransactionSql = `
            INSERT INTO transactions (tr_category, tr_type, account, amount, details, created_at, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const insertValues = [TransactionCategory, TransactionType, Account, Amount, Details, initializedDate, status];
        const result = await client.query(inserttransactionSql, insertValues);

        return NextResponse.json({ 
            message: "Transaction added successfully!", 
            transaction: result.rows[0] 
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding transaction:", error);
        return NextResponse.json({ 
            message: "Error: " + (error instanceof Error ? error.message : "Unknown error") 
        }, { status: 500 });
    }
}
