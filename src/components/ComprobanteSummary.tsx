'use client'

import { useState } from 'react'
import type { ProofRecord } from '../lib/types'
import Badge from './Badge'
import VerificationTable from './VerificationTable'

interface Props {
  proof: ProofRecord
}

type BadgeClasificacion =
  | 'CONSISTENTE'
  | 'INCONSISTENTE'
  | 'ADVERTENCIA'
  | 'DATO_AUSENTE'
  | 'NO_VERIFICABLE'

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

export default function ComprobanteSummary({ proof }: Props) {
  const [hashCopied, setHashCopied] = useState(false)

  async function handleCopyHash() {
    await navigator.clipboard.writeText(proof.hash_sha256)
    setHashCopied(true)
    setTimeout(() => setHashCopied(false), 2000)
  }

  const preview = proof.verificaciones.slice(0, 5)
  const remaining = proof.verificaciones.length - 5

  return (
    <div className="space-y-6">
      {/* ── 1. Huella Criptográfica ── */}
      <section className="rounded-xl border border-gray-200 p-5 bg-white">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Huella Criptográfica SHA-256
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Identificador único del documento en el momento de su notarización. Cualquier
          modificación al PDF produce un hash completamente distinto.
        </p>

        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
            <p className="font-mono text-xs text-gray-700 break-all leading-relaxed select-all">
              {proof.hash_sha256}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyHash}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {hashCopied ? (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600">Copiado</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar Hash
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── 2. Metadatos ── */}
      <section className="rounded-xl border border-gray-200 p-5 bg-white">
        <h2 className="text-base font-bold text-gray-900 mb-4">Metadatos del Documento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Páginas
            </p>
            <p className="text-2xl font-bold text-gray-800">{proof.n_paginas}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Notarizado
            </p>
            <p className="text-sm text-gray-700">{formatDate(proof.timestamp_pipeline)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Clasificación
            </p>
            <Badge clasificacion={proof.clasificacion as BadgeClasificacion} size="md" />
          </div>
        </div>
      </section>

      {/* ── 3. Verificaciones ── */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            Verificaciones de Campos
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({proof.verificaciones.length} campos)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <VerificationTable verificaciones={preview} />
          {remaining > 0 && (
            <p className="mt-3 text-sm text-gray-400 text-center">
              + {remaining} verificación{remaining === 1 ? '' : 'es'} más
            </p>
          )}
        </div>
      </section>

      {/* ── 4. Verificación Manual ── */}
      <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          ¿Cómo verificar esto manualmente?
        </h2>
        <ol className="space-y-5 text-sm text-gray-700">
          <li className="flex gap-3">
            <StepBadge n={1} />
            <div>
              <p className="font-medium mb-1">Descarga el PDF desde SECOP II</p>
              <p className="text-gray-500">
                Busca el contrato con identificador{' '}
                <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono text-xs text-gray-800">
                  {proof.notice_uid}
                </code>{' '}
                en el portal oficial y descarga el documento PDF.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <StepBadge n={2} />
            <div>
              <p className="font-medium mb-2">Calcula el SHA-256 del archivo descargado</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">
                    Windows (CMD)
                  </p>
                  <code className="block bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs text-gray-800 break-all">
                    certutil -hashfile archivo.pdf SHA256
                  </code>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">
                    Linux / macOS
                  </p>
                  <code className="block bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs text-gray-800">
                    shasum -a 256 archivo.pdf
                  </code>
                </div>
              </div>
            </div>
          </li>

          <li className="flex gap-3">
            <StepBadge n={3} />
            <div>
              <p className="font-medium mb-1">Compara con el hash mostrado arriba</p>
              <p className="text-gray-500">
                Los valores deben ser idénticos, carácter por carácter. Cualquier diferencia
                indica que el documento fue modificado después de la notarización.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <StepBadge n={4} />
            <div>
              <p className="font-medium mb-1">Verifica en Polygonscan</p>
              <p className="text-gray-500">
                Abre la transacción en{' '}
                <a
                  href={`https://amoy.polygonscan.com/tx/${proof.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
                >
                  Polygonscan Amoy
                </a>{' '}
                y confirma que el campo <em>Input Data</em> contiene el hash SHA-256 del documento.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  )
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a8a] text-white text-xs flex items-center justify-center font-bold mt-0.5">
      {n}
    </span>
  )
}
