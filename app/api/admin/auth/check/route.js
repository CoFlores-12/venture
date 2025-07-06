import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const adminSession = request.cookies.get('admin-session');
    
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'No admin session found' },
        { status: 200 }
      );
    }

    const sessionData = JSON.parse(adminSession.value);
    
    // Validate admin session
    if (!sessionData.isAdmin || sessionData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Invalid admin session' },
        { status: 200 }
      );
    }

    // Check if session is expired (7 days)
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 200 }
      );
    }

    // Return admin data (without sensitive information)
    return NextResponse.json({
      success: true,
      admin: {
        id: sessionData.id,
        name: sessionData.name,
        email: sessionData.email,
        role: sessionData.role
      }
    });

  } catch (error) {
    console.error('Admin session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid session data' },
      { status: 200 }
    );
  }
} 