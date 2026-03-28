import { redis } from '@/config/redis.config';
import { NextResponse } from 'next/server';

export async function GET() {
  await redis.set("test:key", "Hello Redis", "EX", 60);

  const value = await redis.get("test:key");

  return NextResponse.json({
    success: true,
    message: "Value set and retrieved successfully",
    data: value,
  })
}