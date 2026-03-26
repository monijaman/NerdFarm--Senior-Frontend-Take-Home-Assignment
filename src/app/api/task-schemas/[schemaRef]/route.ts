import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ schemaRef: string }> },
) {
  const { schemaRef } = await params;
  const fileName = `schema-${schemaRef}.json`;
  const filePath = path.join(process.cwd(), 'mocks', fileName);

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Schema not found' }, { status: 404 });
  }
}
