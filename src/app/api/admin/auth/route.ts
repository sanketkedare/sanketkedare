import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD_HASH, hashPassword } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const trimmedPassword = String(password).trim();
    const computedHash = await hashPassword(trimmedPassword);

    // Verify SHA-256 hash or exact password match
    const isValid = computedHash === ADMIN_PASSWORD_HASH || trimmedPassword === 'Kedare@200';

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        token: ADMIN_PASSWORD_HASH,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
