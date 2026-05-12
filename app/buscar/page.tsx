"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { buscarComprobante, obtenerTodosLosNoticeUIDs, obtenerTodosLosRegistros } from "@/src/lib/data";
import { ProofRecord, RegistroNotarizacion } from "@/src/lib/types";
import SearchBar from "@/src/components/SearchBar";
import Badge from "@/src/components/Badge";
import TabSwitch from "@/src/components/TabSwitch";
import VerificationTable from "@/src/components/VerificationTable";
import BlockchainInfoPanel from "@/src/components/BlockchainInfoPanel";
import ComprobanteSummary from "@/src/components/ComprobanteSummary";

type FiltroClasificacion = "Todos" | "CONSISTENTE" | "INCONSISTENTE" | "ADVERTENCIA" | "NO_VERIFICABLE";

const FILTROS: FiltroClasificacion[] = ["Todos", "CONSISTENTE", "INCONSISTENTE", "ADVERTENCIA", "NO_VERIFICABLE"];

const COLORES_FILTRO: Record<Exclude<FiltroClasificacion, "Todos">, string> = {
  CONSISTENTE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INCONSISTENTE: "bg-rose-50 text-rose-700 border-rose-200",
  ADVERTENCIA: "bg-amber-50 text-amber-700 border-amber-200",
  NO_VERIFICABLE: "bg-slate-50 text-slate-700 border-slate-200",
};

function BuscarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idContrato = searchParams.get("id");

  const [proof, setProof] = useState<ProofRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("comprobante");
  const [registros, setRegistros] = useState<RegistroNotarizacion[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<FiltroClasificacion>("Todos");

  useEffect(() => {
    obtenerTodosLosRegistros().then(setRegistros);
  }, []);

  useEffect(() => {
    if (!idContrato) {
      setProof(null);
      setNotFound(false);
      return;
    }
    
    setLoading(true);
    setNotFound(false);
    
    buscarComprobante(idContrato)
      .then((result) => {
        if (result) {
          setProof(result);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [idContrato]);

  // Sin búsqueda
  if (!idContrato) {
    const conteoPorClasificacion = registros.reduce<Record<string, number>>((acc, r) => {
      acc[r.clasificacion] = (acc[r.clasificacion] || 0) + 1;
      return acc;
    }, {});

    const conteoFiltro = (f: FiltroClasificacion) =>
      f === "Todos" ? registros.length : conteoPorClasificacion[f] || 0;

    const registrosFiltrados =
      filtroActivo === "Todos"
        ? registros
        : registros.filter((r) => r.clasificacion === filtroActivo);

    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Buscar Comprobante</h1>

        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Ingresa un ID de contrato del SECOP II para verificar su integridad.
            Los comprobantes disponibles aparecerán en el autocompletado mientras escribes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {FILTROS.map((f) => {
            const activo = filtroActivo === f;
            let className = "px-4 py-2 rounded-full text-sm font-semibold border transition-colors ";
            if (f === "Todos") {
              className += activo
                ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";
            } else {
              className += activo
                ? COLORES_FILTRO[f]
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";
            }
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFiltroActivo(f)}
                className={className}
              >
                {f} ({conteoFiltro(f)})
              </button>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Mostrando {registrosFiltrados.length} de {registros.length} contratos
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {registrosFiltrados.map((r) => (
            <div
              key={r.id_contrato}
              onClick={() => router.push(`/buscar?id=${r.id_contrato}`)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#1e3a8a] transition-all cursor-pointer p-4"
            >
              <p className="font-mono text-sm text-gray-500 mb-1">{r.notice_uid}</p>
              <p className="font-semibold text-gray-900 text-base mb-3">{r.id_contrato}</p>
              <div className="mb-3">
                <Badge clasificacion={r.clasificacion} size="sm" />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {r.n_inconsistencias > 0 && (
                  <span>Inconsistencias: {r.n_inconsistencias}</span>
                )}
                <span>Páginas: {r.n_paginas}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando comprobante...</p>
        </div>
      </div>
    );
  }

  // No encontrado
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-red-700 mb-4">No encontrado</h1>
            <p className="text-red-800 mb-6 text-lg">
              El ID de contrato <code className="bg-red-100 px-3 py-1 rounded font-mono text-sm">{idContrato}</code> no está registrado en este sistema.
            </p>
            <button
              onClick={() => window.location.href = "/buscar"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              ← Nueva búsqueda
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proof) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Comprobante de Verificación</h1>
            <p className="text-gray-700 mb-1">
              <strong className="text-gray-900">Notice UID:</strong>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{proof.notice_uid}</code>
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">ID Contrato:</strong>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{proof.id_contrato}</code>
            </p>
          </div>
          <div>
            <Badge clasificacion={proof.clasificacion} size="lg" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Páginas</p>
            <p className="text-xl font-bold text-gray-900">{proof.n_paginas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Inconsistencias</p>
            <p className="text-xl font-bold text-gray-900">{proof.n_inconsistencias}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Verificaciones</p>
            <p className="text-xl font-bold text-gray-900">{proof.verificaciones.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Registrado hace</p>
            <p className="text-xl font-bold text-gray-900">{proof.dias_desde_notarizacion} días</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <TabSwitch
          tabs={[
            { id: "comprobante", label: "Comprobante" },
            { id: "verificacion", label: "Verificación" },
            { id: "blockchain", label: "Blockchain" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === "comprobante" && (
            <ComprobanteSummary proof={proof} />
          )}
          
          {activeTab === "verificacion" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Verificación API vs PDF
              </h2>
              <p className="text-gray-600 mb-6">
                Comparación entre los datos publicados en la API del SECOP II
                y los campos extraídos del documento contractual PDF.
              </p>
              <VerificationTable verificaciones={proof.verificaciones} />
            </div>
          )}
          
          {activeTab === "blockchain" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Información de Blockchain
              </h2>
              <p className="text-gray-600 mb-6">
                Detalles del registro inmutable en Polygon Amoy Testnet.
              </p>
              <BlockchainInfoPanel
                txHash={proof.tx_hash}
                blockNumber={proof.block_number}
                timestamp={proof.block_timestamp}
                gas={proof.gas_usado}
                contractAddress={proof.contract_address}
              />
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          onClick={() => window.location.href = "/buscar"}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          ← Nueva búsqueda
        </button>
        <a
          href={proof.polygonscan_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver en Polygonscan
        </a>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  );
}