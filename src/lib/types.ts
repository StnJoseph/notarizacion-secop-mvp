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

type Clasificacion = "CONSISTENTE" | "INCONSISTENTE" | "DATO_AUSENTE" | "ADVERTENCIA" | "NO_VERIFICABLE";

// Refleja el formato de datos.json (campos blockchain con prefijo bc_)
export interface DatoUnificado {
  notice_uid: string;
  id_contrato: string;
  hash_sha256: string;
  timestamp_pipeline: string;
  n_paginas: number;
  ruta_local: string;
  campos_pdf: CamposPDF;
  clasificacion: Clasificacion;
  n_inconsistencias: number;
  verificaciones: Verificacion[];
  inconsistencias: string[];
  bc_estado: "REGISTRADO" | "PENDIENTE";
  bc_tx_hash: string;
  bc_block_number: number;
  bc_block_timestamp: string;
  bc_contract_address: string;
  bc_chain_id: number;
  bc_gas_usado: number;
  bc_error: string;
  error: string;
}

export type RegistroNotarizacion = DatoUnificado;

// Extiende DatoUnificado con aliases normalizados de campos bc_ y campos calculados
export interface ProofRecord extends DatoUnificado {
  tx_hash: string;
  block_number: number;
  block_timestamp: string;
  contract_address: string;
  chain_id: number;
  gas_usado: number;
  estado: "REGISTRADO" | "PENDIENTE";
  polygonscan_url: string;
  dias_desde_notarizacion: number;
  badge_color: string;
  badge_text: string;
}