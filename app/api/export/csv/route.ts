import { NextRequest, NextResponse } from 'next/server';
import { getCandidates, getOfferLetters } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'candidates';

  try {
    if (type === 'new-hires') {
      // Export accepted offers as CSV for onboarding
      const offers = await getOfferLetters();
      const acceptedOffers = offers.filter(
        (o) => getMetafieldValue(o.metadata?.offer_status) === 'Accepted'
      );

      const headers = ['Position', 'Candidate', 'Salary', 'Currency', 'Start Date', 'Signed Date'];
      const rows = acceptedOffers.map((offer) => {
        const candidateObj = offer.metadata?.candidate;
        const candidateName = candidateObj && typeof candidateObj === 'object' && 'title' in candidateObj
          ? String(candidateObj.title) : '';

        return [
          getMetafieldValue(offer.metadata?.position),
          candidateName,
          String(offer.metadata?.offered_salary || ''),
          getMetafieldValue(offer.metadata?.currency),
          getMetafieldValue(offer.metadata?.start_date),
          getMetafieldValue(offer.metadata?.signed_date),
        ].map((v) => `"${v.replace(/"/g, '""')}"`).join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="new-hires-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default: export all candidates
    const candidates = await getCandidates();
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Source', 'AI Score', 'Applied Date', 'Tags'];
    const rows = candidates.map((c) => {
      const position = c.metadata?.applied_position;
      const positionTitle = position && typeof position === 'object' && 'title' in position
        ? String(position.title) : '';

      return [
        getMetafieldValue(c.metadata?.full_name) || c.title,
        getMetafieldValue(c.metadata?.email),
        getMetafieldValue(c.metadata?.phone),
        positionTitle,
        getMetafieldValue(c.metadata?.source),
        String(c.metadata?.ai_ranking_score || ''),
        getMetafieldValue(c.metadata?.applied_date),
        getMetafieldValue(c.metadata?.tags),
      ].map((v) => `"${v.replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="candidates-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}