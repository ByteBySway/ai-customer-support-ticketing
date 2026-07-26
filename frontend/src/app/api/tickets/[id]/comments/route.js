import { NextResponse } from 'next/server';
import { comments } from '../../../data';

export async function GET(request, { params }) {
  const { id } = params;
  const list = comments[id] || [];
  return NextResponse.json({ success: true, data: list });
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    if (!body.text) {
      return NextResponse.json({ success: false, message: "Comment text required" }, { status: 400 });
    }

    if (!comments[id]) comments[id] = [];
    const newComment = {
      id: `c_${Date.now()}`,
      author: body.author || "Support Agent",
      role: body.role || "Agent",
      text: body.text,
      timestamp: new Date().toISOString()
    };
    comments[id].push(newComment);

    return NextResponse.json({ success: true, data: newComment });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
