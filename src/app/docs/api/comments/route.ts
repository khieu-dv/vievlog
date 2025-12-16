// ~/app/docs/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getComments, createComment } from '@/features/comments/services/comments';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const docPath = searchParams.get('doc_path');

  if (!docPath) {
    return NextResponse.json({ error: 'doc_path is required' }, { status: 400 });
  }

  try {
    const comments = await getComments(docPath);
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doc_path, content, author_id, author_name } = body;

    if (!doc_path || !content || !author_id || !author_name) {
      return NextResponse.json(
        { error: 'doc_path, content, author_id, and author_name are required' },
        { status: 400 }
      );
    }

    const comment = await createComment({
      doc_path,
      content,
      author_id,
      author_name,
    });

    if (!comment) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}