import { NextResponse } from 'next/server';
import { fetchEvaluationChartData } from '@/lib/firebase/server-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const chartData = await fetchEvaluationChartData();
  return NextResponse.json(chartData);
}
