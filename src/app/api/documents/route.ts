// ~/app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { documentsService } from '~/lib/pocketbase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const filter = searchParams.get('filter') || '';
    const userId = searchParams.get('userId');

    let result;
    if (userId) {
      result = await documentsService.getUserDocuments(userId, page, perPage);
    } else {
      result = await documentsService.getAll(page, perPage, filter);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, description, author, category, tags, published } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json(
        { error: 'Title, slug, content, and author are required' },
        { status: 400 }
      );
    }

    const document = await documentsService.create({
      title,
      slug,
      content,
      description,
      author,
      category,
      tags,
      published: published || false,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}