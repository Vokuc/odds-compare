import { NextRequest, NextResponse } from 'next/server';
import { getBookmakers } from '@/services/repository';

export async function GET(request: NextRequest) {
  try {
    const bookmakers = await getBookmakers();

    return NextResponse.json({
      success: true,
      data: bookmakers,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmakers' },
      { status: 500 }
    );
  }
}
