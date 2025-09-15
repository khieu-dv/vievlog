import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'public/games/unhaunter/pkg/unhaunter.js');
    const fileContent = readFileSync(filePath, 'utf-8');
    
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Failed to read unhaunter.js:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}