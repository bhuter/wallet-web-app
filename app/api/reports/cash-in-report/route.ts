import { NextResponse } from 'next/server';
import client from '../../utils/db'; // Adjust the import to match your DB client setup

export async function GET() {
  try {
    // Calculate date ranges
    const today = new Date();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6); // End of current week (Saturday)

    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7); // Start of previous week
    const endOfPreviousWeek = new Date(startOfCurrentWeek);
    endOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 1); // End of previous week

    // Fetch transactions within the date ranges
    const query = `
      SELECT 
        TO_CHAR(CAST(created_at AS date), 'Dy') AS day, -- Get day of the week as a short name (e.g., Mon, Tue)
        SUM(CASE 
              WHEN CAST(created_at AS date) >= $1 AND CAST(created_at AS date) <= $2 THEN CAST(amount AS INTEGER)
              ELSE 0
            END) AS current,
        SUM(CASE 
              WHEN CAST(created_at AS date) >= $3 AND CAST(created_at AS date) <= $4 THEN CAST(amount AS INTEGER)
              ELSE 0
            END) AS previous
      FROM transactions
      WHERE CAST(created_at AS date) BETWEEN $3 AND $2 AND tr_type = 'cash-in' -- Ensure data covers both weeks
      GROUP BY TO_CHAR(CAST(created_at AS date), 'Dy')
      ORDER BY CASE 
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Sun' THEN 1 -- Order days starting with Monday
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Mon' THEN 2
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Tue' THEN 3
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Wed' THEN 4
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Thu' THEN 5
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Fri' THEN 6
        WHEN TO_CHAR(CAST(created_at AS date), 'Dy') = 'Sat' THEN 7
      END;
    `;

    const result = await client.query(query, [
      startOfCurrentWeek,
      endOfCurrentWeek,
      startOfPreviousWeek,
      endOfPreviousWeek,
    ]);

    // Format the response data
    const data = result.rows.map((row: any) => ({
      day: row.day,
      current: parseInt(row.current, 10) || 0,
      previous: parseInt(row.previous, 10) || 0,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transaction sums:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction sums' }, { status: 500 });
  }
}

