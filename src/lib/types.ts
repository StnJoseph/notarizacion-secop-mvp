// Tipos para registros de notarización
export interface Verificacion {
  campo: string;
  valor_api: string | null;
  valor_pdf: string | null;
  resultado: "OK" | "INCONSISTENTE" | "DATO_AUSENTE" | "ADVERTENCIA" | "NO_VERIFICABLE";
  detalle: string;
}

export interface CamposPDF {
  valor_pdf: string;
  numero_proceso_pdf: string | null;
  tipo_proceso_pdf: string;
  duracion_pdf: string;
  fecha_fin_pdf: string;
  proveedor_pdf: string | null;
  valor_numerico_pdf: number;
}

export interface RegistroNotarizacion {
  notice_uid: string;
  id_contrato: string;
  hash_sha256: string;
  timestamp_pipeline: string;
  n_paginas: number;
  clasificacion: "CONSISTENTE" | "INCONSISTENTE" | "DATO_AUSENTE" | "ADVERTENCIA" | "NO_VERIFICABLE";
  n_inconsistencias: number;
  verificaciones: Verificacion[];
  inconsistencias: string[];
  campos_pdf: CamposPDF;
  ruta_local: string;
  error: string;
}

export interface ComprobantesBlockchain {
  notice_uid: string;
  id_contrato: string;
  hash_sha256: string;
  clasificacion: "CONSISTENTE" | "INCONSISTENTE" | "DATO_AUSENTE" | "ADVERTENCIA" | "NO_VERIFICABLE";
  tx_hash: string;
  block_number: number;
  block_timestamp: string;
  contract_address: string;
  chain_id: number;
  estado: "REGISTRADO" | "PENDIENTE";
  error: string;
  gas_usado: number;
}

// Tipo unificado que el frontend usa
export interface ProofRecord extends RegistroNotarizacion, ComprobantesBlockchain {
  polygonscan_url: string;
  dias_desde_notarizacion: number;
  badge_color: string;
  badge_text: string;
}