import { NextRequest, NextResponse } from 'next/server';
import { searchCandidates } from '@/lib/cosmic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ candidates: [] });
  }

  try {
    const candidates = await searchCandidates(query.trim());
    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search candidates' },
      { status: 500 }
    );
  }
}