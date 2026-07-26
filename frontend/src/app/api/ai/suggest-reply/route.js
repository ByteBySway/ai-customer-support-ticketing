import { NextResponse } from 'next/server';
import { generateAIReply } from '../../data';

export async function POST(request) {
  try {
    const body = await request.json();
    const replyText = generateAIReply(body);
    return NextResponse.json({ success: true, data: { suggestedReply: replyText } });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
