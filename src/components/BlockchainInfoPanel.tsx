'use client'

import { useState } from 'react'

interface Props {
  txHash: string
  blockNumber: number
  timestamp: string
  gas: number
  contractAddress: string
}

function shortHash(hash: string): string {
  if (hash.length <= 22) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-10)}`
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

function diasDesde(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  return `hace ${days} días`
}

function CopyButton({
  value,
  label = 'Copiar',
}: {
  value: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copiado' : label}
      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 text-xs text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
    >
      {copied ? (
        <>
          <span className="text-emerald-600 font-medium">Copiado</span>
        </>
      ) : (
        <>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

function DataLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
      {children}
    </p>
  )
}

export default function BlockchainInfoPanel({
  txHash,
  blockNumber,
  timestamp,
  gas,
  contractAddress,
}: Props) {
  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 space-y-4">
      <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
        Registro en Blockchain · Polygon Amoy
      </h3>

      {/* TX Hash */}
      <div className="bg-white rounded-lg border border-blue-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DataLabel>Transaction Hash</DataLabel>
            <p className="font-mono text-sm text-gray-800 break-all">{shortHash(txHash)}</p>
          </div>
          <CopyButton value={txHash} label="Copiar TX" />
        </div>
      </div>

      {/* Contract Address */}
      <div className="bg-white rounded-lg border border-blue-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DataLabel>Contrato en Blockchain</DataLabel>
            <p className="font-mono text-sm text-gray-800 break-all">{shortHash(contractAddress)}</p>
          </div>
          <CopyButton value={contractAddress} label="Copiar" />
        </div>
      </div>

      {/* Metadata grid: 2 cols desktop, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-blue-100 p-4">
          <DataLabel>Número de Bloque</DataLabel>
          <p className="font-mono text-sm font-semibold text-gray-800">
            #{blockNumber.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-blue-100 p-4">
          <DataLabel>Gas Usado</DataLabel>
          <p className="font-mono text-sm font-semibold text-gray-800">
            {gas.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-blue-100 p-4 sm:col-span-2">
          <DataLabel>Timestamp</DataLabel>
          <p className="text-sm text-gray-800">{formatDate(timestamp)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{diasDesde(timestamp)}</p>
        </div>
      </div>

      {/* Full-width Polygonscan button */}
      <a
        href={`https://amoy.polygonscan.com/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-lg transition-colors text-sm"
      >
        Ver Transacción en Polygonscan
      </a>
    </div>
  )
}
