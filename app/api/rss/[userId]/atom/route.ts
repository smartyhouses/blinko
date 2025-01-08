import { generateFeed } from '@/server/routers/helper';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url);
  const rows = searchParams.get('rows') ? parseInt(searchParams.get('rows')!) : 20;
  const origin = request.headers.get('origin') || request.headers.get('host') || 'http://localhost:1111';
  const fullOrigin = origin.startsWith('http') ? origin : `http://${origin}`;
  const feed = await generateFeed(Number(params.userId), fullOrigin, rows);
  
  return new NextResponse(feed.atom1(), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=10800',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}