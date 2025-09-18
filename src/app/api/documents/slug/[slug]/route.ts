// ~/app/api/documents/slug/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { documentsService } from '~/lib/pocketbase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const document = await documentsService.getBySlug(slug);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document by slug:', error);
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }
}