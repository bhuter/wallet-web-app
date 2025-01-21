import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";;

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { holder_name, accountNumber, accountType, currency } = await req.json();

    // Input validation
    if (!holder_name || !accountNumber || !accountType || !currency) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    const status = "Active";
    try {
      

        // Insert the new transaction into the database
        const inserttransactionSql = `
            INSERT INTO accounts (holder_name, account, acc_type, currency, status, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
        `;
        const insertValues = [holder_name, accountNumber, accountType, currency, status];
        const result = await client.query(inserttransactionSql, insertValues);

        return NextResponse.json({ 
            message: "Account added successfully!", 
            transaction: result.rows[0] 
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding account:", error);
        return NextResponse.json({ 
            message: "Error: " + (error instanceof Error ? error.message : "Unknown error") 
        }, { status: 500 });
    }
}
