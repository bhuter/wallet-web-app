export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import client from "../utils/db"; // Adjust the path as needed

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract parameters from the query string
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = "SELECT * FROM transactions";
    const params: any[] = [];
    const conditions = [];

    // Handle date range filtering
    if (date_from && date_to) {
      conditions.push(`created_at BETWEEN $${params.length + 1} AND $${params.length + 2}`);
      params.push(date_from, date_to);
    }

    // Handle search
    if (search) {
      conditions.push(
        `(account ILIKE $${params.length + 1} OR details ILIKE $${params.length + 1} OR amount::text ILIKE $${params.length + 1})`
      );
      params.push(`%${search}%`);
    }

    // Apply conditions
    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Handle sorting
    if (sort) {
      if (["momo", "bank", "cash", "card"].includes(sort)) {
        query += ` AND tr_type = $${params.length + 1}`;
        params.push(sort);
      } else if (sort === "category") {
        query += " ORDER BY tr_category ASC";
      }
    } else {
      query += " ORDER BY t_id DESC";
    }

    // Execute the query
    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
