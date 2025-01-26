import { NextResponse } from 'next/server';
import disclaimers from './disclaimers.json';

export function GET() {
  return NextResponse.json(disclaimers, { status: 200 });
}
