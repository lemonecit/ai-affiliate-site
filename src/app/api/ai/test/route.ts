import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        recommendedProducts: [],
        insights: ["Test insight"],
        summary: {
          totalRecommendations: 0,
          averageScore: 0,
          topCategory: "Test"
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI recommendations' },
      { status: 500 }
    );
  }
}
