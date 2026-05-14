import { DatoUnificado, RegistroNotarizacion, ProofRecord } from "./types";
import { calcularDiasDesde } from "./utils";

let datosCache: DatoUnificado[] | null = null;

async function cargarDatos(): Promise<DatoUnificado[]> {
  if (datosCache) return datosCache;

  try {
    const response = await fetch("/data/datos.json");
    const data: DatoUnificado[] = await response.json();
    datosCache = data;
    return data;
  } catch (error) {
    console.error("Error cargando datos:", error);
    return [];
  }
}

export async function obtenerTodosLosNoticeUIDs(): Promise<string[]> {
  const datos = await cargarDatos();
  return datos.map((d) => d.id_contrato);
}

export async function obtenerTodosLosRegistros(): Promise<RegistroNotarizacion[]> {
  return cargarDatos();
}

export async function buscarComprobante(idContrato: string): Promise<ProofRecord | null> {
  const datos = await cargarDatos();
  const dato = datos.find((d) => d.id_contrato === idContrato);
  if (!dato) return null;

  return {
    ...dato,
    tx_hash: dato.bc_tx_hash,
    block_number: dato.bc_block_number,
    block_timestamp: dato.bc_block_timestamp,
    contract_address: dato.bc_contract_address,
    chain_id: dato.bc_chain_id,
    gas_usado: dato.bc_gas_usado,
    estado: dato.bc_estado,
    polygonscan_url: `https://amoy.polygonscan.com/tx/${dato.bc_tx_hash}`,
    dias_desde_notarizacion: calcularDiasDesde(dato.bc_block_timestamp),
    badge_color: "",
    badge_text: "",
  };
}

export async function obtenerEstadisticas() {
  const datos = await cargarDatos();

  const total = datos.length;
  const consistentes = datos.filter((d) => d.clasificacion === "CONSISTENTE").length;
  const inconsistentes = datos.filter((d) => d.clasificacion === "INCONSISTENTE").length;

  return {
    total,
    consistentes,
    inconsistentes,
    porcentajeConsistencia: total > 0 ? Math.round((consistentes / total) * 100) : 0,
    blockchain: datos[0]?.bc_contract_address || "N/A",
  };
}