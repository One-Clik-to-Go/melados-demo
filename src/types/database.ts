export type UserRole = 'ADMIN' | 'EVALUADOR' | 'VIEWER';

export type TipoGrupo = 'Programa' | 'Control';
export type NivelEgresoCET = 'Alto' | 'Medio' | 'Bajo' | 'Al limite' | 'Normal';
export type Genero = 'M' | 'F';

export interface Escuela {
  id_escuela: string;
  nombre_escuela: string;
  sede_region: string;
  creado_en?: string;
}

export interface Estudiante {
  id_estudiante: string;
  codigo_anonimo: string;
  tipo_grupo: TipoGrupo;
  es_ucpn?: boolean; // Una Computadora Por Niño (UCPN)
  cet_origen: string; // Centro de Estimulación Temprana (CET)
  generacion_egreso_cet?: number;
  nivel_egreso_cet?: NivelEgresoCET;
  genero: Genero;
  anio_nacimiento: number;
  fecha_nacimiento?: string;
  email_acudiente?: string;
  matricula_escolar?: string;
  asistio_kinder: boolean;
  escuela_actual_id: string;
  nombre_escuela?: string;
  grado_actual: number; // 1 to 6
  activo: boolean;
  creado_en?: string;
}

export interface EstudianteIdentidad {
  estudiante_id: string;
  codigo_anonimo?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  nombre_completo: string;
  cedula_matricula?: string;
  cedula?: string;
  email_acudiente?: string;
  fecha_nacimiento?: string;
  creado_en?: string;
}

export interface EvaluacionEGRA {
  id_evaluacion_egra: string;
  estudiante_id: string;
  codigo_anonimo?: string;
  grado_evaluado: 2 | 6;
  fecha_aplicacion: string;
  evaluador_nombre: string;
  recon_letras_score: number;
  lectura_oral_score: number;
  comprension_score: number;
  fluidez_score: number;
  score_total: number;
  observaciones?: string;
  sincronizado_en?: string;
}

export interface EvaluacionEGMA {
  id_evaluacion_egma: string;
  estudiante_id: string;
  codigo_anonimo?: string;
  grado_evaluado: 2 | 6;
  fecha_aplicacion: string;
  evaluador_nombre: string;
  numeracion_score: number;
  conteo_score: number;
  operaciones_score: number;
  logica_score: number;
  score_total: number;
  observaciones?: string;
  sincronizado_en?: string;
}

export interface EvaluacionSDQ {
  id_evaluacion_sdq: string;
  estudiante_id: string;
  codigo_anonimo?: string;
  fecha_aplicacion: string;
  scoring_conductual: number;
  scoring_hiperactividad: number;
  scoring_emocional: number;
  scoring_prosocial: number;
  scoring_pares: number;
  score_total_dificultades: number;
  sincronizado_api: boolean;
  creado_en?: string;
}

export interface SeguimientoEscolar {
  id_seguimiento: string;
  estudiante_id: string;
  anio_escolar: number;
  grado: number;
  porcentaje_asistencia: number;
  promedio_lectura_boletin?: number;
  promedio_matematica_boletin?: number;
  repitente: boolean;
  desercion: boolean;
  creado_en?: string;
}

export interface SyncQueueItem {
  id_transaccion: string;
  tabla_destino: 'evaluaciones_egra' | 'evaluaciones_egma' | 'evaluaciones_sdq' | 'estudiantes';
  operacion_tipo: 'INSERT' | 'UPDATE';
  payload_json: string;
  creado_en: string;
  estado_sync: 'PENDIENTE' | 'COMPLETADO' | 'ERROR';
  reintentos: number;
  ultimo_error?: string;
}

export interface EvaluationIngestPayload {
  id_transaccion?: string;
  instrumento?: 'EGRA' | 'EGMA' | 'SDQ';
  codigo_anonimo?: string;
  tipo_grupo?: TipoGrupo;
  evaluador_nombre?: string;
  grado_evaluado?: number;
  escuela_actual_id?: string;
  respuestas?: Record<string, any>;
  scoring_calculado?: {
    score_total: number;
    sub_scores?: Record<string, any>;
  };
  observaciones_evaluador?: string;
  fecha_aplicacion?: string;
  dispositivo_id?: string;
  meta?: {
    dispositivo_id: string;
    evaluador_nombre: string;
    fecha_captura: string;
  };
  estudiante?: {
    codigo_anonimo: string;
    tipo_grupo: TipoGrupo;
    cet_origen: string;
    generacion_egreso_cet?: number;
    escuela_actual_id: string;
    grado_actual: number;
  };
  evaluacion_academicas?: {
    instrumento: 'EGRA' | 'EGMA' | 'SDQ';
    grado_evaluado: number;
    scoring_calculado: Record<string, number>;
    observaciones?: string;
  };
}

export interface AlertaAsistencia {
  estudiante_id: string;
  codigo_anonimo: string;
  porcentaje_asistencia: number;
  nombre_escuela: string;
  grado: number;
  tipo_grupo: TipoGrupo;
}

export interface DashboardStats {
  total_estudiantes: number;
  estudiantes_programa: number;
  estudiantes_control: number;
  promedio_egra_programa: number;
  promedio_egra_control: number;
  promedio_egma_programa: number;
  promedio_egma_control: number;
  asistencia_promedio_programa: number;
  asistencia_promedio_control: number;
  alertas_desercion_total: number;
  alertas_asistencia_list?: AlertaAsistencia[];
}
