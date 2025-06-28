import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Nollställda data - börjar från scratch med riktiga värden
    const realData = {
      totalClicks: 0,
      totalConversions: 0,
      revenue: 0,
      topProducts: []
    };

    return NextResponse.json(realData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Spara till localStorage som fallback för nu
    console.log('Click tracked:', body);
    
    return NextResponse.json({ 
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
