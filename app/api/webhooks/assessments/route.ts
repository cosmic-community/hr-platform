import { NextRequest, NextResponse } from 'next/server';

// Simulated webhook receiver for external assessments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    const candidateId = body.candidate_id;
    const assessmentType = body.assessment_type;
    const score = body.score;

    if (!candidateId || !assessmentType) {
      return NextResponse.json(
        { error: 'Missing required fields: candidate_id, assessment_type' },
        { status: 400 }
      );
    }

    // Log the webhook receipt
    console.log('Webhook received:', {
      candidateId,
      assessmentType,
      score,
      receivedAt: new Date().toISOString(),
    });

    // In a real implementation, this would:
    // 1. Verify the webhook signature
    // 2. Update the candidate's assessment data in Cosmic
    // 3. Trigger any workflow automations

    return NextResponse.json({
      success: true,
      message: 'Assessment webhook received successfully',
      data: {
        candidateId,
        assessmentType,
        score,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}