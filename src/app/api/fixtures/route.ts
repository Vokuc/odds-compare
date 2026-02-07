import { NextRequest, NextResponse } from 'next/server';
import { getLeagues, getUpcomingMatches } from '@/services/repository';

export async function GET(request: NextRequest) {
  try {
    const leagues = await getLeagues();
    const matches = await getUpcomingMatches(7);

    return NextResponse.json({
      success: true,
      data: {
        leagues,
        matches,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
