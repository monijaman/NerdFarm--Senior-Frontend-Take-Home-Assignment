import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export function GET() {
  const filePath = path.join(process.cwd(), 'mocks', 'tasks.json');
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return NextResponse.json(data);
}
