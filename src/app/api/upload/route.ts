import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'receipt.jpg';

  if (!request.body) {
    return NextResponse.json({ error: 'No file body' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 },
    );
  }
}
