export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import client from "../utils/db"; // Adjust the path as needed

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const filter_from = searchParams.get("date_from");
    const filter_to = searchParams.get("date_to");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = "SELECT * FROM accounts";
   
    const params: any[] = [];

    const conditions = [];
    if (filter_from || filter_to) {
      conditions.push(`created_at BETWEEN  $${params.length + 1} AND $${params.length + 2}`);
      params.push(filter_from, filter_to);
    }
    if (search) {
      conditions.push(`(account ILIKE $${params.length + 1} OR holder_name ILIKE $${params.length + 1} OR acc_type ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    if (sort) {
      if (sort === "momo") {
        query += " WHERE acc_type = 'momo'";
      } else if (sort === "bank") {
        query += " WHERE acc_type = 'bank'";
      }else if (sort === "cash") {
        query += " WHERE acc_type = 'cash'";
      } else if (sort === "card") {
        query += " WHERE acc_type = 'card'";
      } else if (sort === "category") {
        query += " ORDER BY holder_name ASC";
      }
    } else {
      query += " ORDER BY acc_id DESC";
    }

    const result = await client.query(query, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
