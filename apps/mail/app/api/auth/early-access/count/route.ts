import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { earlyAccess } from '@zero/db/schema';
import { processIP } from '@/app/api/utils';
import { count } from 'drizzle-orm';
import { redis } from '@/lib/redis';
import { db } from '@zero/db';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1m'),
  analytics: true,
  prefix: 'ratelimit:early-access-count',
});

export async function GET(req: NextRequest) {
  try {
    const ip = processIP(req);
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    };

    if (!success) {
      console.log(`Rate limit exceeded for IP ${ip}. Remaining: ${remaining}`);
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    const result = await db.select({ count: count() }).from(earlyAccess);
    const signupCount = result[0]?.count || 0;

    return NextResponse.json({ count: signupCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching early access count:', error);

    return NextResponse.json({ count: 0 }, { status: 400 });
  }
}
