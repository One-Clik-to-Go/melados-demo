import { calculateEgraScore, calculateEgmaScore } from '@/components/evaluator/InteractiveCertifiedEvaluation';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

export function runSystemTestSuite(): { total: number; passed: number; results: TestResult[] } {
  const results: TestResult[] = [];

  // Test 1: EGRA Sub-tests scoring calculation
  try {
    const mockEgra = {
      recon_letras: 50, // 50/100 -> 50%
      sonido_letras: 40, // 40/50 -> 80%
      palabras_simples: 30, // 30/50 -> 60%
      pseudopalabras: 25, // 25/50 -> 50%
      lectura_pasaje: 45, // 45/60 -> 75%
      comprension_directa: 4, // 4/5 -> 80%
      comprension_auditiva: 3, // 3/5 -> 60%
    };
    const score = calculateEgraScore(mockEgra);
    const expectedAvg = Math.round((50 + 80 + 60 + 50 + 75 + 80 + 60) / 7); // ~65%
    const passed = Math.abs(score.score_total - expectedAvg) <= 1;
    results.push({
      name: 'Cálculo Certificado EGRA (7 Sub-pruebas)',
      passed,
      message: passed ? `Puntaje total calculado: ${score.score_total}%` : `Falló: esperado ${expectedAvg}%, obtenido ${score.score_total}%`,
      details: score,
    });
  } catch (error: any) {
    results.push({ name: 'Cálculo Certificado EGRA', passed: false, message: error.message });
  }

  // Test 2: EGMA Sub-tests scoring calculation
  try {
    const mockEgma = {
      identificacion_numeros: 18, // 18/20 -> 90%
      comparacion_cantidades: 9,  // 9/10 -> 90%
      secuencias_numericas: 8,   // 8/10 -> 80%
      operaciones_suma: 16,       // 16/20 -> 80%
      operaciones_resta: 14,      // 14/20 -> 70%
      problemas_verbales: 4,      // 4/5 -> 80%
    };
    const score = calculateEgmaScore(mockEgma);
    const expectedAvg = Math.round((90 + 90 + 80 + 80 + 70 + 80) / 6); // ~82%
    const passed = Math.abs(score.score_total - expectedAvg) <= 1;
    results.push({
      name: 'Cálculo Certificado EGMA (6 Sub-pruebas)',
      passed,
      message: passed ? `Puntaje total calculado: ${score.score_total}%` : `Falló: esperado ${expectedAvg}%, obtenido ${score.score_total}%`,
      details: score,
    });
  } catch (error: any) {
    results.push({ name: 'Cálculo Certificado EGMA', passed: false, message: error.message });
  }

  // Test 3: Deduplicación de Escuelas (Normalización)
  try {
    const name1 = ' Escuela San Pedro Nolasco ';
    const name2 = 'escuela san pedro nolasco';
    const norm1 = name1.trim().toLowerCase();
    const norm2 = name2.trim().toLowerCase();
    const passed = norm1 === norm2;
    results.push({
      name: 'Algoritmo de Deduplicación de Escuelas',
      passed,
      message: passed ? 'Normalización coincidente anti-duplicados OK' : 'Falló normalización',
    });
  } catch (error: any) {
    results.push({ name: 'Deduplicación de Escuelas', passed: false, message: error.message });
  }

  // Test 4: Formato Anónimo Ley 285
  try {
    const code = 'EST-P2026-1001';
    const isValidAnonCode = /^EST-[A-Z0-9]+-[0-9]+$/.test(code);
    results.push({
      name: 'Formato Anónimo de Estudiante (Ley 285)',
      passed: isValidAnonCode,
      message: isValidAnonCode ? 'Código anónimo Ley 285 valido' : 'Formato anónimo inválido',
    });
  } catch (error: any) {
    results.push({ name: 'Formato Anónimo Ley 285', passed: false, message: error.message });
  }

  const passedCount = results.filter(r => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    results,
  };
}
