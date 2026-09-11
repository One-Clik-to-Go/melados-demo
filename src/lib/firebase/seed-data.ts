import {
  Estudiante,
  EstudianteIdentidad,
  Escuela
} from '@/types/database';

export const SEED_ESCUELAS: Escuela[] = [
  // Veraguas
  { id_escuela: 'esc-san-pedro-nolasco', nombre_escuela: 'Escuela San Pedro Nolasco', sede_region: 'Veraguas - Cañazas' },
  { id_escuela: 'esc-canazas-centro', nombre_escuela: 'Escuela Cañazas Centro', sede_region: 'Veraguas - Cañazas' },
  { id_escuela: 'esc-el-pantano', nombre_escuela: 'Escuela El Pantano', sede_region: 'Veraguas - Cañazas' },
  { id_escuela: 'esc-el-bale', nombre_escuela: 'Escuela El Bale', sede_region: 'Veraguas - Cañazas' },
  { id_escuela: 'esc-san-francisco-montana', nombre_escuela: 'Centro Educativo San Francisco de la Montaña', sede_region: 'Veraguas - San Francisco' },
  { id_escuela: 'esc-belisario-porras-santiago', nombre_escuela: 'Escuela Belisario Porras', sede_region: 'Veraguas - Santiago' },
  { id_escuela: 'esc-anexa-el-canada', nombre_escuela: 'Escuela Anexa El Canadá', sede_region: 'Veraguas - Santiago' },
  { id_escuela: 'esc-jose-merida-la-mesa', nombre_escuela: 'Escuela José de la Cruz Mérida', sede_region: 'Veraguas - La Mesa' },
  { id_escuela: 'esc-los-valles', nombre_escuela: 'Escuela Los Valles', sede_region: 'Veraguas - Alto de Piedra' },

  // Comarca Ngäbe-Buglé
  { id_escuela: 'esc-nurum-centro', nombre_escuela: 'Escuela Rural Ñurüm Centro', sede_region: 'Comarca Ngäbe-Buglé - Ñurüm' },
  { id_escuela: 'esc-alto-saldana', nombre_escuela: 'Escuela Alto Saldaña', sede_region: 'Comarca Ngäbe-Buglé - Munä' },
  { id_escuela: 'esc-soloy', nombre_escuela: 'Centro Educativo Soloy', sede_region: 'Comarca Ngäbe-Buglé - Besikö' },
  { id_escuela: 'esc-llano-tugri', nombre_escuela: 'Centro Educativo Llano Tugrí', sede_region: 'Comarca Ngäbe-Buglé - Buäbti' },
  { id_escuela: 'esc-hato-chami', nombre_escuela: 'Escuela Hato Chamí', sede_region: 'Comarca Ngäbe-Buglé - Nole Duima' },
  { id_escuela: 'esc-lajero', nombre_escuela: 'Escuela Lajero', sede_region: 'Comarca Ngäbe-Buglé - Nole Duima' },
  { id_escuela: 'esc-cerro-iglesia', nombre_escuela: 'Escuela Cerro Iglesia', sede_region: 'Comarca Ngäbe-Buglé - San Félix' },

  // Chiriquí
  { id_escuela: 'esc-antonio-sucre-david', nombre_escuela: 'Escuela Antonio José de Sucre', sede_region: 'Chiriquí - David' },
  { id_escuela: 'esc-francia-david', nombre_escuela: 'Escuela República de Francia', sede_region: 'Chiriquí - David' },
  { id_escuela: 'esc-venezuela-david', nombre_escuela: 'Escuela República de Venezuela', sede_region: 'Chiriquí - David' },
  { id_escuela: 'esc-puerto-armuelles', nombre_escuela: 'Centro Educativo Puerto Armuelles', sede_region: 'Chiriquí - Barú' },
  { id_escuela: 'esc-boquete-centro', nombre_escuela: 'Escuela José María Roy', sede_region: 'Chiriquí - Boquete' },
  { id_escuela: 'esc-volcan-centro', nombre_escuela: 'Escuela Volcán Centro', sede_region: 'Chiriquí - Tierras Altas' },
  { id_escuela: 'esc-bugaba-centro', nombre_escuela: 'Escuela Justo Abel Castillo', sede_region: 'Chiriquí - Bugaba' },

  // Coclé
  { id_escuela: 'esc-churuquita-chiquita', nombre_escuela: 'Centro Educativo Churuquita Chiquita', sede_region: 'Coclé - Penonomé' },
  { id_escuela: 'esc-simeon-conte', nombre_escuela: 'Escuela Simeón Conte', sede_region: 'Coclé - Penonomé' },
  { id_escuela: 'esc-alejandro-tapia', nombre_escuela: 'Escuela Alejandro Tapia Escobar', sede_region: 'Coclé - Aguadulce' },
  { id_escuela: 'esc-el-roble', nombre_escuela: 'Escuela El Roble', sede_region: 'Coclé - Aguadulce' },
  { id_escuela: 'esc-anton-centro', nombre_escuela: 'Escuela República de Honduras', sede_region: 'Coclé - Antón' },

  // Panamá Centro
  { id_escuela: 'esc-belisario-porras-panama', nombre_escuela: 'Escuela Belisario Porras', sede_region: 'Panamá Centro - San Francisco' },
  { id_escuela: 'esc-jose-arango-bethania', nombre_escuela: 'Escuela José Agustín Arango', sede_region: 'Panamá Centro - Bethania' },
  { id_escuela: 'esc-chile-calidonia', nombre_escuela: 'Escuela República de Chile', sede_region: 'Panamá Centro - Calidonia' },
  { id_escuela: 'esc-federico-zuniga-tocumen', nombre_escuela: 'Escuela Federico Zúñiga Feliú', sede_region: 'Panamá Centro - Tocumen' },
  { id_escuela: 'esc-estados-unidos', nombre_escuela: 'Escuela Estados Unidos de América', sede_region: 'Panamá Centro - San Felipe' },
  { id_escuela: 'esc-manuel-espinosa', nombre_escuela: 'Escuela Manuel Espinosa Batista', sede_region: 'Panamá Centro - Parque Lefevre' },

  // Panamá Oeste
  { id_escuela: 'esc-pedro-pablo-sanchez', nombre_escuela: 'Escuela Pedro Pablo Sánchez', sede_region: 'Panamá Oeste - La Chorrera' },
  { id_escuela: 'esc-zaida-nunez', nombre_escuela: 'Escuela Zaida Z. Núñez', sede_region: 'Panamá Oeste - La Chorrera' },
  { id_escuela: 'esc-arraijan-centro', nombre_escuela: 'Escuela Fernando de Lesseps', sede_region: 'Panamá Oeste - Arraiján' },
  { id_escuela: 'esc-chame-centro', nombre_escuela: 'Escuela Carlos A. Mendoza', sede_region: 'Panamá Oeste - Chame' },
  { id_escuela: 'esc-capira-centro', nombre_escuela: 'Escuela Federico Velásquez', sede_region: 'Panamá Oeste - Capira' },

  // Colón
  { id_escuela: 'esc-uruguay-colon', nombre_escuela: 'Escuela República de Uruguay', sede_region: 'Colón - Colón Centro' },
  { id_escuela: 'esc-cristobal-colon', nombre_escuela: 'Centro Educativo Cristóbal Colón', sede_region: 'Colón - Cristóbal' },
  { id_escuela: 'esc-salamanca-colon', nombre_escuela: 'Escuela Salamanca', sede_region: 'Colón - Salamanca' },
  { id_escuela: 'esc-chagres-centro', nombre_escuela: 'Escuela Nuevo Chagres', sede_region: 'Colón - Chagres' },

  // Herrera & Los Santos
  { id_escuela: 'esc-juana-ramirez-chitre', nombre_escuela: 'Escuela Juana Ramírez', sede_region: 'Herrera - Chitré' },
  { id_escuela: 'esc-sergio-perez-chitre', nombre_escuela: 'Escuela Sergio Pérez Delgado', sede_region: 'Herrera - Chitré' },
  { id_escuela: 'esc-pese-centro', nombre_escuela: 'Escuela I联Pese Centro', sede_region: 'Herrera - Pesé' },
  { id_escuela: 'esc-nicanor-villalaz-las-tablas', nombre_escuela: 'Escuela Nicanor Villalaz', sede_region: 'Los Santos - Las Tablas' },
  { id_escuela: 'esc-juana-arco-guarare', nombre_escuela: 'Escuela Juana de Arco', sede_region: 'Los Santos - Guararé' },

  // Darién
  { id_escuela: 'esc-meteti-centro', nombre_escuela: 'Centro Educativo Metetí Centro', sede_region: 'Darién - Pinogana' },
  { id_escuela: 'esc-la-palma-darien', nombre_escuela: 'Escuela La Palma', sede_region: 'Darién - Chepigana' },
  { id_escuela: 'esc-yaviza-centro', nombre_escuela: 'Escuela Yaviza Centro', sede_region: 'Darién - Pinogana' },

  // Bocas del Toro & Comarcas Guna / Emberá
  { id_escuela: 'esc-changuinola-centro', nombre_escuela: 'Escuela Changuinola Centro', sede_region: 'Bocas del Toro - Changuinola' },
  { id_escuela: 'esc-almirante-centro', nombre_escuela: 'Escuela Almirante Centro', sede_region: 'Bocas del Toro - Almirante' },
  { id_escuela: 'esc-isla-colon', nombre_escuela: 'Escuela Rogelio Ibarra', sede_region: 'Bocas del Toro - Isla Colón' },
  { id_escuela: 'esc-el-porvenir-guna', nombre_escuela: 'Escuela El Porvenir', sede_region: 'Comarca Guna Yala' },
  { id_escuela: 'esc-carti-sugdup', nombre_escuela: 'Escuela Cartí Sugdup', sede_region: 'Comarca Guna Yala' },
  { id_escuela: 'esc-union-choco-embera', nombre_escuela: 'Escuela Unión Chocó', sede_region: 'Comarca Emberá-Wounaan' },
];

export const SEED_ESTUDIANTES: Estudiante[] = [
  {
    id_estudiante: 'est-uuid-001',
    codigo_anonimo: 'EST-P2026-1001',
    tipo_grupo: 'Programa',
    es_ucpn: true,
    cet_origen: 'CET Cañazas',
    generacion_egreso_cet: 2022,
    nivel_egreso_cet: 'Alto',
    genero: 'M',
    anio_nacimiento: 2017,
    asistio_kinder: true,
    escuela_actual_id: 'esc-san-pedro-nolasco',
    nombre_escuela: 'Escuela San Pedro Nolasco',
    grado_actual: 2,
    activo: true,
  },
  {
    id_estudiante: 'est-uuid-002',
    codigo_anonimo: 'EST-P2026-1002',
    tipo_grupo: 'Programa',
    es_ucpn: false,
    cet_origen: 'CET Cañazas',
    generacion_egreso_cet: 2022,
    nivel_egreso_cet: 'Medio',
    genero: 'F',
    anio_nacimiento: 2017,
    asistio_kinder: true,
    escuela_actual_id: 'esc-san-pedro-nolasco',
    nombre_escuela: 'Escuela San Pedro Nolasco',
    grado_actual: 2,
    activo: true,
  },
  {
    id_estudiante: 'est-uuid-003',
    codigo_anonimo: 'EST-C2026-2001',
    tipo_grupo: 'Control',
    es_ucpn: false,
    cet_origen: 'N/A (Comunidad Control)',
    genero: 'M',
    anio_nacimiento: 2017,
    asistio_kinder: false,
    escuela_actual_id: 'esc-canazas-centro',
    nombre_escuela: 'Escuela Cañazas Centro',
    grado_actual: 2,
    activo: true,
  },
  {
    id_estudiante: 'est-uuid-004',
    codigo_anonimo: 'EST-P2026-1003',
    tipo_grupo: 'Programa',
    es_ucpn: true,
    cet_origen: 'CET Ñurüm',
    generacion_egreso_cet: 2022,
    nivel_egreso_cet: 'Alto',
    genero: 'F',
    anio_nacimiento: 2017,
    asistio_kinder: true,
    escuela_actual_id: 'esc-nurum-centro',
    nombre_escuela: 'Escuela Rural Ñurüm Centro',
    grado_actual: 2,
    activo: true,
  },
];

export const SEED_IDENTIDADES: Record<string, EstudianteIdentidad> = {
  'EST-P2026-1001': { estudiante_id: 'est-uuid-001', nombre_completo: 'Carlos Eduardo Mendoza' },
  'EST-P2026-1002': { estudiante_id: 'est-uuid-002', nombre_completo: 'María Isabel Rodríguez' },
  'EST-C2026-2001': { estudiante_id: 'est-uuid-003', nombre_completo: 'Juan Diego Pérez' },
  'EST-P2026-1003': { estudiante_id: 'est-uuid-004', nombre_completo: 'Ana Lucía Gómez' },
};
