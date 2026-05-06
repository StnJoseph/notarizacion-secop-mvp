'use client'

import { useState } from 'react'

interface Props {
  txHash: string
  blockNumber: number
  timestamp: string
  gas: number
}

function shortHash(hash: string): string {
  if (hash.length <= 22) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-10)}`
}

export default function BlockchainInfoPanel({ txHash, blockNumber, timestamp, gas }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const polygonscanUrl = `https://amoy.polygonscan.com/tx/${txHash}`

  const formattedDate = new Date(timestamp).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 space-y-4">
      <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
        Registro en Blockchain · Polygon Amoy
      </h3>

      {/* TX Hash card */}
      <div className="bg-white rounded-lg border border-blue-100 p-4">
        <p className="text-xs text-gray-400 font-medium mb-1">Transaction Hash</p>
        <p className="font-mono text-sm text-gray-800 break-all">{shortHash(txHash)}</p>
        <p className="font-mono text-xs text-gray-400 mt-0.5 break-all hidden sm:block">{txHash}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <a
            href={polygonscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a237e] text-white text-xs font-medium rounded-md hover:bg-[#283593] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Ver en Polygonscan
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {copied ? (
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
                Copiar TX Hash
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border border-blue-100 p-3">
          <p className="text-xs text-gray-400 font-medium mb-1">Bloque</p>
          <p className="font-mono text-sm font-semibold text-gray-800">#{blockNumber.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-100 p-3">
          <p className="text-xs text-gray-400 font-medium mb-1">Timestamp</p>
          <p className="text-sm text-gray-800">{formattedDate}</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-100 p-3">
          <p className="text-xs text-gray-400 font-medium mb-1">Gas usado</p>
          <p className="font-mono text-sm font-semibold text-gray-800">{gas.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
