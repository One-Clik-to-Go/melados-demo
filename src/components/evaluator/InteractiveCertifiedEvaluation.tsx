'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Play, Pause, RotateCcw,
  Sparkles, BookOpen, Calculator, Volume2, HelpCircle, Save, Award, ChevronRight
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Certified EGRA Items Data
// ---------------------------------------------------------------------------
export const EGRA_LETRAS = [
  'L', 'm', 'S', 'a', 'p', 'R', 't', 'O', 'e', 'd',
  'B', 'i', 'n', 'C', 'u', 'M', 'f', 'g', 'J', 'v',
  'L', 'a', 's', 'p', 'r', 't', 'o', 'e', 'd', 'b',
  'i', 'n', 'c', 'u', 'm', 'f', 'g', 'j', 'v', 'A',
  'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'
];

export const EGRA_SONIDOS = [
  '/m/', '/s/', '/p/', '/l/', '/t/', '/d/', '/n/', '/r/', '/c/', '/b/',
  '/f/', '/g/', '/j/', '/ch/', '/ll/', '/v/', '/z/', '/y/', '/k/', '/x/',
  '/a/', '/e/', '/i/', '/o/', '/u/', '/ma/', '/sa/', '/pa/', '/la/', '/ta/',
  '/da/', '/na/', '/ra/', '/ca/', '/ba/', '/fa/', '/ga/', '/ja/', '/ve/', '/so/',
  '/pe/', '/lu/', '/ti/', '/do/', '/ni/', '/re/', '/co/', '/bu/', '/fi/', '/go/'
];

export const EGRA_PALABRAS_SIMPLES = [
  'mamá', 'sol', 'pan', 'casa', 'gato', 'perro', 'mesa', 'flor', 'agua', 'niño',
  'niña', 'libro', 'lápiz', 'escuela', 'árbol', 'luna', 'estrella', 'vaca', 'pato', 'bola',
  'carro', 'tren', 'leche', 'queso', 'fruta', 'juego', 'amigo', 'amor', 'vida', 'luz',
  'mar', 'río', 'mano', 'pie', 'ojo', 'boca', 'nariz', 'pelo', 'ropa', 'zapato',
  'silla', 'puerta', 'ventana', 'cielo', 'sol', 'nube', 'lluvia', 'viento', 'tierra', 'campo'
];

export const EGRA_PSEUDOPALABRAS = [
  'lut', 'pem', 'risa', 'buco', 'tam', 'fol', 'gip', 'naz', 'vop', 'che',
  'mido', 'sota', 'pelu', 'bamo', 'fisa', 'gura', 'jelo', 'chapa', 'lura', 'veta',
  'bisu', 'fomo', 'gani', 'jita', 'zope', 'mabu', 'sepo', 'pima', 'lori', 'tufe',
  'dumi', 'nabo', 'rati', 'cobe', 'bele', 'fejo', 'gapa', 'jimu', 'vori', 'zeti',
  'palu', 'bema', 'fida', 'gope', 'juri', 'veba', 'zimu', 'mefa', 'sobi', 'pitu'
];

export const EGRA_PASAJE_TEXTO = "Un día soleado, el perrito Tobi salió a jugar al parque. Vio una mariposa de colores brillantes y la siguió hasta un hermoso árbol de mangos. Tobi intentó saltar para atraparla, pero se cayó sobre la hierba suave. La mariposa voló feliz hacia el cielo azul, y Tobi regresó a casa muy contento.";

export const EGRA_PREGUNTAS_LECTURA = [
  { id: 'q1', pregunta: '1. ¿Cómo se llamaba el perrito?', opciones: ['Tobi', 'Max', 'Firulais'], correcta: 'Tobi' },
  { id: 'q2', pregunta: '2. ¿A dónde salió a jugar Tobi?', opciones: ['Al parque', 'A la playa', 'A la escuela'], correcta: 'Al parque' },
  { id: 'q3', pregunta: '3. ¿Qué animal siguió Tobi?', opciones: ['Una mariposa', 'Un gato', 'Un pájaro'], correcta: 'Una mariposa' },
  { id: 'q4', pregunta: '4. ¿Hasta dónde la siguió?', opciones: ['Hasta un árbol de mangos', 'Hasta la casa', 'Hasta el río'], correcta: 'Hasta un árbol de mangos' },
  { id: 'q5', pregunta: '5. ¿Cómo regresó Tobi a casa?', opciones: ['Muy contento', 'Enojado', 'Triste'], correcta: 'Muy contento' }
];

export const EGRA_PREGUNTAS_AUDITIVA = [
  { id: 'a1', pregunta: '1. ¿Con quién vive María en la historia?', opciones: ['Con su abuelita', 'Con su tía', 'Sola'], correcta: 'Con su abuelita' },
  { id: 'a2', pregunta: '2. ¿Qué hace María todas las mañanas?', opciones: ['Alimenta a las gallinas', 'Lava la ropa', 'Juega fútbol'], correcta: 'Alimenta a las gallinas' },
  { id: 'a3', pregunta: '3. ¿Dónde vive María?', opciones: ['En Cañazas', 'En Panamá Centro', 'En David'], correcta: 'En Cañazas' },
  { id: 'a4', pregunta: '4. ¿Qué encontró un día cerca del gallinero?', opciones: ['Un huevo dorado', 'Una moneda', 'Una flor'], correcta: 'Un huevo dorado' },
  { id: 'a5', pregunta: '5. ¿Dónde guardaron el huevo?', opciones: ['En una cajita de madera', 'En la cocina', 'En la mochila'], correcta: 'En una cajita de madera' }
];

// ---------------------------------------------------------------------------
// Certified EGMA Items Data
// ---------------------------------------------------------------------------
export const EGMA_NUMEROS = [
  '3', '8', '12', '19', '25', '34', '40', '57', '63', '71',
  '86', '92', '100', '105', '120', '214', '350', '408', '500', '1000'
];

export const EGMA_COMPARACION = [
  { n1: 7, n2: 4, mayor: 7 },
  { n1: 12, n2: 19, mayor: 19 },
  { n1: 35, n2: 29, mayor: 35 },
  { n1: 48, n2: 84, mayor: 84 },
  { n1: 60, n2: 16, mayor: 60 },
  { n1: 93, n2: 97, mayor: 97 },
  { n1: 120, n2: 102, mayor: 120 },
  { n1: 250, n2: 205, mayor: 250 },
  { n1: 410, n2: 401, mayor: 410 },
  { n1: 899, n2: 900, mayor: 900 }
];

export const EGMA_SECUENCIAS = [
  { seq: '2, 4, __, 8', opciones: ['5', '6', '7'], correcta: '6' },
  { seq: '5, 10, __, 20', opciones: ['12', '15', '18'], correcta: '15' },
  { seq: '10, 20, __, 40', opciones: ['25', '30', '35'], correcta: '30' },
  { seq: '3, 6, 9, __', opciones: ['10', '11', '12'], correcta: '12' },
  { seq: '100, 200, __, 400', opciones: ['250', '300', '350'], correcta: '300' },
  { seq: '15, 14, __, 12', opciones: ['13', '11', '10'], correcta: '13' },
  { seq: '25, 30, 35, __', opciones: ['38', '40', '45'], correcta: '40' },
  { seq: '50, 45, __, 35', opciones: ['42', '40', '38'], correcta: '40' },
  { seq: '4, 8, 12, __', opciones: ['14', '15', '16'], correcta: '16' },
  { seq: '90, 80, __, 60', opciones: ['75', '70', '65'], correcta: '70' }
];

export const EGMA_SUMAS = [
  { eq: '2 + 1', res: 3 }, { eq: '3 + 3', res: 6 }, { eq: '5 + 2', res: 7 }, { eq: '4 + 4', res: 8 },
  { eq: '6 + 3', res: 9 }, { eq: '7 + 2', res: 9 }, { eq: '5 + 5', res: 10 }, { eq: '8 + 1', res: 9 },
  { eq: '9 + 3', res: 12 }, { eq: '10 + 5', res: 15 }, { eq: '7 + 6', res: 13 }, { eq: '8 + 5', res: 13 },
  { eq: '9 + 7', res: 16 }, { eq: '12 + 4', res: 16 }, { eq: '15 + 3', res: 18 }, { eq: '11 + 9', res: 20 },
  { eq: '14 + 6', res: 20 }, { eq: '18 + 2', res: 20 }, { eq: '20 + 10', res: 30 }, { eq: '25 + 15', res: 40 }
];

export const EGMA_RESTAS = [
  { eq: '3 - 1', res: 2 }, { eq: '5 - 2', res: 3 }, { eq: '7 - 3', res: 4 }, { eq: '8 - 4', res: 4 },
  { eq: '9 - 5', res: 4 }, { eq: '10 - 2', res: 8 }, { eq: '6 - 6', res: 0 }, { eq: '12 - 3', res: 9 },
  { eq: '14 - 5', res: 9 }, { eq: '15 - 7', res: 8 }, { eq: '18 - 6', res: 12 }, { eq: '20 - 5', res: 15 },
  { eq: '13 - 8', res: 5 }, { eq: '16 - 9', res: 7 }, { eq: '17 - 7', res: 10 }, { eq: '19 - 4', res: 15 },
  { eq: '20 - 10', res: 10 }, { eq: '25 - 10', res: 15 }, { eq: '30 - 15', res: 15 }, { eq: '50 - 25', res: 25 }
];

export const EGMA_PROBLEMAS = [
  { id: 'p1', problema: '1. Pedro tiene 3 canicas y le regala 1 a su hermano. ¿Cuántas canicas le quedan?', respuesta: 2 },
  { id: 'p2', problema: '2. En un árbol hay 4 pájaros y llegan 3 más. ¿Cuántos pájaros hay en total?', respuesta: 7 },
  { id: 'p3', problema: '3. Ana compró 10 naranjas y comió 4 con su familia. ¿Cuántas naranjas le quedan?', respuesta: 6 },
  { id: 'p4', problema: '4. En el aula hay 8 niños y 7 niñas. ¿Cuántos estudiantes hay en total?', respuesta: 15 },
  { id: 'p5', problema: '5. Carlos tiene 12 balones y los reparte en partes iguales entre 3 amigos. ¿Cuántos balones recibe cada amigo?', respuesta: 4 }
];

interface InteractiveProps {
  instrument: 'EGRA' | 'EGMA';
  onScoresCalculated: (scores: any) => void;
}

export const InteractiveCertifiedEvaluation: React.FC<InteractiveProps> = ({
  instrument,
  onScoresCalculated
}) => {
  // EGRA States
  const [letrasStatus, setLetrasStatus] = useState<Record<number, boolean>>({});
  const [sonidosStatus, setSonidosStatus] = useState<Record<number, boolean>>({});
  const [palabrasStatus, setPalabrasStatus] = useState<Record<number, boolean>>({});
  const [pseudoStatus, setPseudoStatus] = useState<Record<number, boolean>>({});
  const [wordsMissed, setWordsMissed] = useState<Record<number, boolean>>({});
  const [respuestasLectura, setRespuestasLectura] = useState<Record<string, string>>({});
  const [respuestasAuditiva, setRespuestasAuditiva] = useState<Record<string, string>>({});

  // EGMA States
  const [numStatus, setNumStatus] = useState<Record<number, boolean>>({});
  const [compStatus, setCompStatus] = useState<Record<number, number>>({});
  const [seqStatus, setSeqStatus] = useState<Record<number, string>>({});
  const [sumasStatus, setSumasStatus] = useState<Record<number, boolean>>({});
  const [restasStatus, setRestasStatus] = useState<Record<number, boolean>>({});
  const [probStatus, setProbStatus] = useState<Record<string, number>>({});

  // Timer 60 seconds
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Recalculate scores and notify parent
  useEffect(() => {
    if (instrument === 'EGRA') {
      const correctLetras = Object.values(letrasStatus).filter(Boolean).length;
      const correctSonidos = Object.values(sonidosStatus).filter(Boolean).length;
      const correctPalabras = Object.values(palabrasStatus).filter(Boolean).length;
      const correctPseudo = Object.values(pseudoStatus).filter(Boolean).length;

      const pasajeWords = EGRA_PASAJE_TEXTO.split(' ');
      const totalWords = pasajeWords.length;
      const missedCount = Object.values(wordsMissed).filter(Boolean).length;
      const correctPasaje = Math.max(0, totalWords - missedCount);

      let correctLectura = 0;
      EGRA_PREGUNTAS_LECTURA.forEach(q => {
        if (respuestasLectura[q.id] === q.correcta) correctLectura++;
      });

      let correctAuditiva = 0;
      EGRA_PREGUNTAS_AUDITIVA.forEach(q => {
        if (respuestasAuditiva[q.id] === q.correcta) correctAuditiva++;
      });

      onScoresCalculated({
        recon_letras: correctLetras,
        sonido_letras: correctSonidos,
        palabras_simples: correctPalabras,
        pseudopalabras: correctPseudo,
        lectura_pasaje: correctPasaje,
        comprension_directa: correctLectura,
        comprension_auditiva: correctAuditiva,
      });
    } else {
      const correctNum = Object.values(numStatus).filter(Boolean).length;

      let correctComp = 0;
      EGMA_COMPARACION.forEach((item, idx) => {
        if (compStatus[idx] === item.mayor) correctComp++;
      });

      let correctSeq = 0;
      EGMA_SECUENCIAS.forEach((item, idx) => {
        if (seqStatus[idx] === item.correcta) correctSeq++;
      });

      const correctSumas = Object.values(sumasStatus).filter(Boolean).length;
      const correctRestas = Object.values(restasStatus).filter(Boolean).length;

      let correctProb = 0;
      EGMA_PROBLEMAS.forEach(p => {
        if (probStatus[p.id] === p.respuesta) correctProb++;
      });

      onScoresCalculated({
        identificacion_numeros: correctNum,
        comparacion_cantidades: correctComp,
        secuencias_numericas: correctSeq,
        operaciones_suma: correctSumas,
        operaciones_resta: correctRestas,
        problemas_verbales: correctProb,
      });
    }
  }, [
    instrument, letrasStatus, sonidosStatus, palabrasStatus, pseudoStatus,
    wordsMissed, respuestasLectura, respuestasAuditiva, numStatus, compStatus,
    seqStatus, sumasStatus, restasStatus, probStatus, onScoresCalculated
  ]);

  const toggleItem = (setter: React.Dispatch<React.SetStateAction<Record<number, boolean>>>, index: number) => {
    setter(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Timer Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-4 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
            timeLeft <= 10 ? 'bg-red-500 text-white animate-bounce' : 'bg-proninez-teal text-white'
          }`}>
            {timeLeft}s
          </div>
          <div>
            <div className="text-xs font-bold">Temporizador de Prueba (60s)</div>
            <div className="text-[11px] text-gray-400">Marque las respuestas del estudiante en tiempo real</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTimerActive(!timerActive)}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{timerActive ? 'Pausar' : 'Iniciar Reloj'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setTimeLeft(60); setTimerActive(false); }}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all"
            title="Reiniciar reloj"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* EGRA certified items */}
      {instrument === 'EGRA' && (
        <div className="space-y-8">
          {/* Sub-test 1: Letras */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-teal text-white flex items-center justify-center text-xs">1</span>
                <span>Reconocimiento del Nombre de las Letras (100 ítems)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-teal">
                {Object.values(letrasStatus).filter(Boolean).length} / 100 correctas
              </span>
            </div>
            <p className="text-xs text-gray-500">Toque las letras que el estudiante lea CORRECTAMENTE:</p>

            <div className="grid grid-cols-10 gap-1.5 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-center">
              {EGRA_LETRAS.map((letra, idx) => {
                const active = !!letrasStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setLetrasStatus, idx)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-teal text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {letra}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 2: Sonidos de Letras */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-green text-white flex items-center justify-center text-xs">2</span>
                <span>Conocimiento del Sonido de las Letras (50 ítems)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-green">
                {Object.values(sonidosStatus).filter(Boolean).length} / 50 correctos
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-52 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-center">
              {EGRA_SONIDOS.map((snd, idx) => {
                const active = !!sonidosStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setSonidosStatus, idx)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-green text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {snd}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 3: Palabras Simples */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-pink text-white flex items-center justify-center text-xs">3</span>
                <span>Lectura de Palabras Frecuentes Simples (50 palabras)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-pink">
                {Object.values(palabrasStatus).filter(Boolean).length} / 50 correctas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              {EGRA_PALABRAS_SIMPLES.map((word, idx) => {
                const active = !!palabrasStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setPalabrasStatus, idx)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-pink text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 4: Pseudopalabras */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-teal text-white flex items-center justify-center text-xs">4</span>
                <span>Lectura de Pseudopalabras (Palabras Inventadas - 50 ítems)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-teal">
                {Object.values(pseudoStatus).filter(Boolean).length} / 50 correctas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              {EGRA_PSEUDOPALABRAS.map((word, idx) => {
                const active = !!pseudoStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setPseudoStatus, idx)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-teal text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 5: Pasaje de Texto */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-green text-white flex items-center justify-center text-xs">5</span>
                <span>Lectura de Pasaje en Voz Alta (60 palabras)</span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold">Toque las palabras OMITIDAS o INCORRECTAS</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap gap-2 text-xs leading-relaxed">
              {EGRA_PASAJE_TEXTO.split(' ').map((word, idx) => {
                const isMissed = !!wordsMissed[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setWordsMissed, idx)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isMissed
                        ? 'bg-red-500 text-white line-through font-bold shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 6: Comprensión Lectora */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-proninez-pink text-white flex items-center justify-center text-xs">6</span>
              <span>Comprensión Lectora Directa (5 Preguntas)</span>
            </h3>
            <div className="space-y-3">
              {EGRA_PREGUNTAS_LECTURA.map(q => (
                <div key={q.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-800">{q.pregunta}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.opciones.map(opt => {
                      const selected = respuestasLectura[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setRespuestasLectura(prev => ({ ...prev, [q.id]: opt }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? opt === q.correcta
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-test 7: Comprensión Auditiva */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-proninez-teal text-white flex items-center justify-center text-xs">7</span>
              <span>Comprensión Auditiva (5 Preguntas tras relato del evaluador)</span>
            </h3>
            <div className="space-y-3">
              {EGRA_PREGUNTAS_AUDITIVA.map(q => (
                <div key={q.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-800">{q.pregunta}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.opciones.map(opt => {
                      const selected = respuestasAuditiva[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setRespuestasAuditiva(prev => ({ ...prev, [q.id]: opt }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? opt === q.correcta
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EGMA certified items */}
      {instrument === 'EGMA' && (
        <div className="space-y-8">
          {/* Sub-test 1: Identificación de Números */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-teal text-white flex items-center justify-center text-xs">1</span>
                <span>Identificación de Números (20 ítems)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-teal">
                {Object.values(numStatus).filter(Boolean).length} / 20 correctos
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-10 gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-center">
              {EGMA_NUMEROS.map((num, idx) => {
                const active = !!numStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setNumStatus, idx)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-proninez-teal text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 2: Comparación de Cantidades */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-proninez-green text-white flex items-center justify-center text-xs">2</span>
              <span>Comparación de Cantidades (10 pares - Indique cuál número es MAYOR)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EGMA_COMPARACION.map((pair, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Par {idx + 1}:</span>
                  <div className="flex gap-2">
                    {[pair.n1, pair.n2].map(n => {
                      const selected = compStatus[idx] === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCompStatus(prev => ({ ...prev, [idx]: n }))}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? n === pair.mayor
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-test 3: Secuencias Numéricas */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-proninez-pink text-white flex items-center justify-center text-xs">3</span>
              <span>Secuencias Numéricas y Número Faltante (10 series)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EGMA_SECUENCIAS.map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-mono font-bold text-gray-900">{item.seq}</div>
                  <div className="flex gap-2">
                    {item.opciones.map(opt => {
                      const selected = seqStatus[idx] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSeqStatus(prev => ({ ...prev, [idx]: opt }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? opt === item.correcta
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-test 4: Operaciones de Suma */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-teal text-white flex items-center justify-center text-xs">4</span>
                <span>Operaciones Básicas de Suma (20 ejercicios)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-teal">
                {Object.values(sumasStatus).filter(Boolean).length} / 20 correctas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 text-center font-mono">
              {EGMA_SUMAS.map((item, idx) => {
                const active = !!sumasStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setSumasStatus, idx)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-teal text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {item.eq} = {item.res}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 5: Operaciones de Resta */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-proninez-green text-white flex items-center justify-center text-xs">5</span>
                <span>Operaciones Básicas de Resta (20 ejercicios)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-proninez-green">
                {Object.values(restasStatus).filter(Boolean).length} / 20 correctas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 text-center font-mono">
              {EGMA_RESTAS.map((item, idx) => {
                const active = !!restasStatus[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(setRestasStatus, idx)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-proninez-green text-white shadow-sm scale-105'
                        : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {item.eq} = {item.res}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-test 6: Problemas Verbales */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-proninez-pink text-white flex items-center justify-center text-xs">6</span>
              <span>Problemas Verbales de Razonamiento (5 ejercicios)</span>
            </h3>
            <div className="space-y-3">
              {EGMA_PROBLEMAS.map(p => (
                <div key={p.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-800">{p.problema}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Respuesta del niño:</span>
                    <input
                      type="number"
                      value={probStatus[p.id] ?? ''}
                      onChange={(e) => setProbStatus(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                      placeholder="Ingrese número"
                      className="bg-white border border-gray-300 rounded-xl px-3 py-1 text-xs font-mono font-bold text-gray-900 w-32 focus:outline-none focus:border-proninez-pink"
                    />
                    {probStatus[p.id] !== undefined && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        probStatus[p.id] === p.respuesta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {probStatus[p.id] === p.respuesta ? 'Correcto ✅' : 'Incorrecto ❌'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function calculateEgraScore(scores: {
  recon_letras?: number;
  sonido_letras?: number;
  palabras_simples?: number;
  pseudopalabras?: number;
  lectura_pasaje?: number;
  comprension_directa?: number;
  comprension_auditiva?: number;
}) {
  const s1 = Math.min(100, scores.recon_letras || 0);
  const s2 = Math.min(100, ((scores.sonido_letras || 0) / 50) * 100);
  const s3 = Math.min(100, ((scores.palabras_simples || 0) / 50) * 100);
  const s4 = Math.min(100, ((scores.pseudopalabras || 0) / 50) * 100);
  const s5 = Math.min(100, ((scores.lectura_pasaje || 0) / 60) * 100);
  const s6 = Math.min(100, ((scores.comprension_directa || 0) / 5) * 100);
  const s7 = Math.min(100, ((scores.comprension_auditiva || 0) / 5) * 100);

  const score_total = Math.round((s1 + s2 + s3 + s4 + s5 + s6 + s7) / 7);
  return { score_total, s1, s2, s3, s4, s5, s6, s7 };
}

export function calculateEgmaScore(scores: {
  identificacion_numeros?: number;
  comparacion_cantidades?: number;
  secuencias_numericas?: number;
  operaciones_suma?: number;
  operaciones_resta?: number;
  problemas_verbales?: number;
}) {
  const m1 = Math.min(100, ((scores.identificacion_numeros || 0) / 20) * 100);
  const m2 = Math.min(100, ((scores.comparacion_cantidades || 0) / 10) * 100);
  const m3 = Math.min(100, ((scores.secuencias_numericas || 0) / 10) * 100);
  const m4 = Math.min(100, ((scores.operaciones_suma || 0) / 20) * 100);
  const m5 = Math.min(100, ((scores.operaciones_resta || 0) / 20) * 100);
  const m6 = Math.min(100, ((scores.problemas_verbales || 0) / 5) * 100);

  const score_total = Math.round((m1 + m2 + m3 + m4 + m5 + m6) / 6);
  return { score_total, m1, m2, m3, m4, m5, m6 };
}

