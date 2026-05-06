'use client'

import { useState } from 'react'
import type { ProofRecord } from '../lib/types'
import Badge from './Badge'

interface Props {
  proof: ProofRecord
}

type BadgeClasificacion =
  | 'CONSISTENTE'
  | 'INCONSISTENTE'
  | 'ADVERTENCIA'
  | 'DATO_AUSENTE'
  | 'NO_VERIFICABLE'

function toBadge(resultado: string): BadgeClasificacion {
  return resultado === 'OK' ? 'CONSISTENTE' : (resultado as BadgeClasificacion)
}

export default function ComprobanteSummary({ proof }: Props) {
  const [hashCopied, setHashCopied] = useState(false)

  async function handleCopyHash() {
    await navigator.clipboard.writeText(proof.hash_sha256)
    setHashCopied(true)
    setTimeout(() => setHashCopied(false), 2000)
  }

  const topVerificaciones = proof.verificaciones.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Hash SHA-256 */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Hash SHA-256
            </p>
            <p className="font-mono text-xs text-gray-700 break-all leading-relaxed">
              {proof.hash_sha256}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyHash}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-white transition-colors"
          >
            {hashCopied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600">Copiado</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification summary table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Verificaciones
          <span className="ml-2 text-gray-400 font-normal text-xs">
            ({proof.verificaciones.length} campos
            {proof.verificaciones.length > 5 && ' · mostrando primeros 5'})
          </span>
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
                  Dimensión
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {topVerificaciones.map((v, i) => (
                <tr key={v.campo} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{v.campo}</td>
                  <td className="px-4 py-2.5">
                    <Badge clasificacion={toBadge(v.resultado)} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual verification instructions */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Cómo verificar manualmente</h3>
        <ol className="space-y-4 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a237e] text-white text-xs flex items-center justify-center font-bold mt-0.5">
              1
            </span>
            <span>
              Descarga el PDF oficial del contrato desde{' '}
              <a
                href="https://www.secop.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                SECOP II
              </a>{' '}
              usando el identificador{' '}
              <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                {proof.notice_uid}
              </code>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a237e] text-white text-xs flex items-center justify-center font-bold mt-0.5">
              2
            </span>
            <span>
              Calcula el hash SHA-256 del archivo descargado:{' '}
              <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                sha256sum contrato.pdf
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a237e] text-white text-xs flex items-center justify-center font-bold mt-0.5">
              3
            </span>
            <span>
              Compara el resultado con el hash SHA-256 mostrado arriba. Deben ser idénticos.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a237e] text-white text-xs flex items-center justify-center font-bold mt-0.5">
              4
            </span>
            <span>
              Confirma el registro en{' '}
              <a
                href={`https://amoy.polygonscan.com/tx/${proof.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                Polygonscan
              </a>{' '}
              y verifica que el hash del input data coincide.
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}
