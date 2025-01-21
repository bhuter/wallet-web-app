import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";;

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { budget_amount, expiry_date } = await req.json();

    // Input validation
    if (!budget_amount || !expiry_date) {
        return NextResponse.json({ message: "Category name is required." }, { status: 400 });
    }
    try {
      

        // Insert the new transaction into the database
        const inserttransactionSql = `
            INSERT INTO budgets (amount, expiry_date, status, created_at)
            VALUES ($1, $2, $3, NOW()) RETURNING *
        `;
        const insertValues = [budget_amount, expiry_date, "active"];
        const result = await client.query(inserttransactionSql, insertValues);

        return NextResponse.json({ 
            message: "Budget added successfully!", 
            transaction: result.rows[0] 
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding budget:", error);
        return NextResponse.json({ 
            message: "Error: " + (error instanceof Error ? error.message : "Unknown error") 
        }, { status: 500 });
    }
}
