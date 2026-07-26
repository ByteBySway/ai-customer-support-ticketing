import { NextResponse } from 'next/server';
import { classifyTicketAI } from '../../data';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = classifyTicketAI(body.subject || "", body.description || "");
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
