"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/src/components/SearchBar";
import { buscarComprobante } from "@/src/lib/data";
import { ProofRecord } from "@/src/lib/types";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const noticeUID = searchParams.get("id");
  
  const [proof, setProof] = useState<ProofRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!noticeUID) return;
    
    setLoading(true);
    buscarComprobante(noticeUID)
      .then((result) => {
        if (result) {
          setProof(result);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [noticeUID]);

  // SIN resultado aún
  if (!noticeUID) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Buscar Comprobante</h1>
        <SearchBar />
        <p className="mt-8 text-gray-600">
          Ingresa un noticeUID del SECOP II para verificar su integridad.
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <p>Cargando...</p>
      </div>
    );
  }

  // No encontrado
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">No encontrado</h1>
        <p>El noticeUID "{noticeUID}" no está registrado.</p>
        <button
          onClick={() => window.location.href = "/buscar"}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Nueva búsqueda
        </button>
      </div>
    );
  }

  // ENCONTRADO - aquí agregaremos las vistas después
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Comprobante Encontrado</h1>
      <p className="mb-2"><strong>Notice UID:</strong> {proof?.notice_uid}</p>
      <p className="mb-2"><strong>Contrato:</strong> {proof?.id_contrato}</p>
      
      {/* Aquí agregaremos tabs y componentes después */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <p>Vistas detalladas próximamente...</p>
      </div>
    </div>
  );
}