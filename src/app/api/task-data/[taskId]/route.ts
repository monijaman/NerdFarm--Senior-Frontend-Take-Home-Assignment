import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const filePath = path.join(process.cwd(), 'mocks', 'task-data.json');
  const allData = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<
    string,
    Record<string, unknown>
  >;

  const taskData = allData[taskId] ?? null;
  return NextResponse.json(taskData);
}
