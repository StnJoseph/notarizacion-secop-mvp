import { RegistroNotarizacion, ComprobantesBlockchain, ProofRecord } from "./types";
import { calcularDiasDesde } from "./utils";

let registrosCache: RegistroNotarizacion[] | null = null;
let blockchainCache: ComprobantesBlockchain[] | null = null;

export async function cargarRegistros(): Promise<RegistroNotarizacion[]> {
  if (registrosCache) return registrosCache;
  
  try {
    const response = await fetch("/data/registros_notarizacion.json");
    const data: RegistroNotarizacion[] = await response.json();
    registrosCache = data;
    return data;  // ← FIX: devuelve data en vez de cache
  } catch (error) {
    console.error("Error cargando registros:", error);
    return [];
  }
}

export async function cargarBlockchain(): Promise<ComprobantesBlockchain[]> {
  if (blockchainCache) return blockchainCache;
  
  try {
    const response = await fetch("/data/comprobantes_blockchain.json");
    const data: ComprobantesBlockchain[] = await response.json();
    blockchainCache = data;
    return data;  // ← FIX: devuelve data en vez de cache
  } catch (error) {
    console.error("Error cargando blockchain:", error);
    return [];
  }
}

export async function obtenerTodosLosNoticeUIDs(): Promise<string[]> {
  const registros = await cargarRegistros();
  return registros.map((r) => r.id_contrato);
}

export async function buscarComprobante(idContrato: string): Promise<ProofRecord | null> {
  const registros = await cargarRegistros();
  const blockchain = await cargarBlockchain();
  
  const registro = registros.find((r) => r.id_contrato === idContrato);
  if (!registro) return null;
  
  const blockchainData = blockchain.find((b) => b.notice_uid === registro.notice_uid);
  if (!blockchainData) return null;
  
  const proof: ProofRecord = {
    ...registro,
    tx_hash: blockchainData.tx_hash,
    block_number: blockchainData.block_number,
    block_timestamp: blockchainData.block_timestamp,
    contract_address: blockchainData.contract_address,
    chain_id: blockchainData.chain_id,
    gas_usado: blockchainData.gas_usado,
    polygonscan_url: `https://amoy.polygonscan.com/tx/${blockchainData.tx_hash}`,
    dias_desde_notarizacion: calcularDiasDesde(blockchainData.block_timestamp),
    badge_color: "",
    badge_text: "",
    estado: "REGISTRADO"
  };
  
  return proof;
}

export async function obtenerEstadisticas() {
  const registros = await cargarRegistros();
  const blockchain = await cargarBlockchain();
  
  const total = registros.length;
  const consistentes = registros.filter((r) => r.clasificacion === "CONSISTENTE").length;
  const inconsistentes = registros.filter((r) => r.clasificacion === "INCONSISTENTE").length;
  
  return {
    total,
    consistentes,
    inconsistentes,
    porcentajeConsistencia: total > 0 ? Math.round((consistentes / total) * 100) : 0,
    blockchain: blockchain[0]?.contract_address || "N/A",
  };
}