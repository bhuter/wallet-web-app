// File: app/api/transactions/sum/route.ts
import { NextResponse } from 'next/server';
import client from '../../utils/db'; // Adjust the import to match your DB client setup

export async function GET() {
  try {
    const result = await client.query(`
      SELECT tr_type, SUM(CAST(amount AS INTEGER)) AS total
      FROM transactions
      GROUP BY tr_type
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching transaction sums:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction sums' }, { status: 500 });
  }
}
