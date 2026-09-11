import { NextResponse } from 'next/server';
import { runSystemTestSuite } from '@/lib/testing/test-suite';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const suiteResults = runSystemTestSuite();
  return NextResponse.json({
    status: suiteResults.passed === suiteResults.total ? 'PASSED' : 'FAILED',
    timestamp: new Date().toISOString(),
    version: '0.0.1',
    summary: `${suiteResults.passed}/${suiteResults.total} pruebas superadas exitosamente.`,
    testSuite: suiteResults,
  });
}
