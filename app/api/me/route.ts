// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/middleware/auths';

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
console.log('from me',userId)
  if (!userId) {
    return NextResponse.json({ status: 401, msg: 'Not authenticated' });
  }

  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json({ status: 404, msg: 'User not found' });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500, msg: 'Server error' });
  }
}
