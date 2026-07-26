import { NextResponse } from 'next/server';
import { agents } from '../data';

export async function GET() {
  return NextResponse.json({ success: true, data: agents });
}
