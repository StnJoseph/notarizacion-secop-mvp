'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { obtenerEstadisticas } from '@/src/lib/data'

type Stats = {
  total: number
  consistentes: number
  inconsistentes: number
  porcentajeConsistencia: number
  blockchain: string
}

const STEPS = [
  {
    num: 1,
    title: 'Entrada',
    description: 'Obtención de contratos desde la API oficial de SECOP II.',
  },
  {
    num: 2,
    title: 'Procesamiento',
    description: 'Extracción de campos relevantes y generación del hash SHA-256.',
  },
  {
    num: 3,
    title: 'Notarización',
    description: 'Registro inmutable del hash en la red blockchain Polygon Amoy.',
  },
  {
    num: 4,
    title: 'Verificación',
    description: 'Comparación automática entre los datos de la API y el PDF oficial.',
  },
  {
    num: 5,
    title: 'Consulta',
    description: 'Acceso público al comprobante de integridad de cada contrato.',
  },
]

function consistenciaColor(pct: number): string {
  if (pct >= 70) return 'text-emerald-600'
  if (pct >= 50) return 'text-amber-500'
  return 'text-rose-600'
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    obtenerEstadisticas()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="min-h-[400px] flex items-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Portal de Verificación
            <br className="hidden sm:block" />
            de Integridad
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Verifica la integridad de contratos públicos colombianos registrados en blockchain
          </p>
          <Link
            href="/buscar"
            className="inline-block bg-white text-[#1e3a8a] font-semibold px-8 py-4 text-lg rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Buscar Comprobante
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📄</span>
                  <span className="text-sm font-medium text-gray-500">Total contratos</span>
                </div>
                <p className="text-4xl font-bold text-[#1e3a8a]">{stats.total}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📊</span>
                  <span className="text-sm font-medium text-gray-500">Consistencia</span>
                </div>
                <p className={`text-4xl font-bold ${consistenciaColor(stats.porcentajeConsistencia)}`}>
                  {stats.porcentajeConsistencia}%
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">✅</span>
                  <span className="text-sm font-medium text-gray-500">Consistentes</span>
                </div>
                <p className="text-4xl font-bold text-emerald-600">{stats.consistentes}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm font-medium text-gray-500">Inconsistencias</span>
                </div>
                <p className="text-4xl font-bold text-rose-600">{stats.inconsistentes}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Cinco pasos para garantizar la transparencia e integridad de los contratos públicos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
