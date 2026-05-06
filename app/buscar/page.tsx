"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buscarComprobante, obtenerTodosLosNoticeUIDs } from "@/src/lib/data";
import { ProofRecord } from "@/src/lib/types";

// Componente interno que usa useSearchParams
function BuscarContent() {
  const searchParams = useSearchParams();
  const noticeUID = searchParams.get("id");
  
  const [proof, setProof] = useState<ProofRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [allUIDs, setAllUIDs] = useState<string[]>([]);

  // Cargar todos los UIDs disponibles
  useEffect(() => {
    obtenerTodosLosNoticeUIDs().then(setAllUIDs);
  }, []);

  // Buscar comprobante cuando hay ID
  useEffect(() => {
    if (!noticeUID) {
      setProof(null);
      setNotFound(false);
      return;
    }
    
    setLoading(true);
    setNotFound(false);
    
    buscarComprobante(noticeUID)
      .then((result) => {
        if (result) {
          setProof(result);
        } else {
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.error("Error buscando:", error);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [noticeUID]);

  // SIN resultado aún
  if (!noticeUID) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Buscar Comprobante</h1>
        
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            Ingresa un noticeUID del SECOP II para verificar su integridad.
          </p>
          {/* SearchBar irá aquí cuando lo generes con Claude */}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Comprobantes disponibles:</h2>
          <div className="space-y-2">
            {allUIDs.map((uid) => (
              <a
                key={uid}
                href={`/buscar?id=${uid}`}
                className="block p-3 bg-white rounded border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                {uid}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Cargando comprobante...</span>
        </div>
      </div>
    );
  }

  // No encontrado
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-700 mb-4">❌ No encontrado</h1>
          <p className="text-red-800 mb-4">
            El noticeUID <code className="bg-red-100 px-2 py-1 rounded">{noticeUID}</code> no está registrado.
          </p>
          <button
            onClick={() => window.location.href = "/buscar"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ← Nueva búsqueda
          </button>
        </div>
      </div>
    );
  }

  // ENCONTRADO
  if (!proof) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Comprobante Encontrado</h1>
        <p className="text-gray-600 text-sm mb-1">
          <strong>Notice UID:</strong> {proof.notice_uid}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>ID Contrato:</strong> {proof.id_contrato}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">
          Componentes de resultado aquí (tabs, tabla, blockchain info)
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => window.location.href = "/buscar"}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Nueva búsqueda
        </button>
        <a
          href={proof.polygonscan_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔗 Ver en Polygonscan
        </a>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  );
}