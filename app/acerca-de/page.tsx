'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '¿Qué es la notarización digital de contratos?',
    a: 'La notarización digital es el proceso de calcular una huella criptográfica única (hash SHA-256) de un documento y registrarla en una red blockchain pública. Esto permite demostrar que el documento existía en un momento determinado y que no ha sido alterado, sin necesidad de una entidad certificadora central.',
  },
  {
    q: '¿Cómo sé que un contrato no ha sido modificado?',
    a: 'Descarga el PDF del contrato desde el SECOP II, calcula su hash SHA-256 con el comando certutil -hashfile contrato.pdf SHA256 en Windows, o shasum -a 256 contrato.pdf en Mac/Linux, y compáralo con el hash registrado en el comprobante. Si coinciden, el documento es íntegro.',
  },
  {
    q: '¿Qué significa que un contrato sea INCONSISTENTE?',
    a: 'Significa que el sistema detectó una diferencia entre los metadatos publicados por la API del SECOP II y los datos extraídos del documento PDF. Las dimensiones verificadas son: valor del contrato, modalidad de contratación, proveedor adjudicado, duración y fecha de terminación. Una inconsistencia no implica necesariamente irregularidad — puede ser un error de digitación o una actualización no sincronizada.',
  },
  {
    q: '¿Por qué se usa blockchain para el registro?',
    a: 'La blockchain garantiza que el registro del hash sea inmutable: una vez inscrito en un bloque confirmado, no puede modificarse sin invalidar todos los bloques posteriores. Esto elimina la dependencia de confiar en el sistema de notarización, ya que la evidencia es pública y verificable por cualquier persona.',
  },
  {
    q: '¿Qué es Polygon Amoy y por qué se usa?',
    a: 'Polygon Amoy es la red de pruebas oficial de Polygon, compatible con la Ethereum Virtual Machine (EVM). Se usa en este prototipo porque permite ejecutar contratos inteligentes reales en una red distribuida sin costo económico, manteniendo el mismo comportamiento técnico que una red principal.',
  },
  {
    q: '¿Cómo puedo verificar el contrato inteligente directamente?',
    a: 'El contrato está desplegado en la dirección 0xFda33F967F6ed22856ee542910663B180b3Cc79C en Polygon Amoy. Puedes consultarlo en amoy.polygonscan.com o llamar directamente a su función verificarHash() con el hash SHA-256 del documento que quieres comprobar.',
  },
  {
    q: '¿Este sistema reemplaza al SECOP II?',
    a: 'No. Este prototipo implementa una arquitectura híbrida que extiende las capacidades del SECOP II sin modificarlo. El SECOP II sigue siendo el sistema oficial de contratación pública. Esta capa de notarización actúa como un complemento de verificación independiente.',
  },
  {
    q: '¿Tiene valor jurídico este comprobante?',
    a: 'No. Este es un prototipo académico desarrollado como trabajo de grado en la Universidad de los Andes. Los comprobantes generados no tienen valor probatorio legal. El sistema demuestra la viabilidad técnica de la arquitectura propuesta.',
  },
]

export default function AcercaDePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sección 1 — Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Acerca del Sistema</h1>
          <p className="text-blue-200 mb-6">
            Prototipo académico — Universidad de los Andes · Ingeniería de Sistemas y Computación · 2026
          </p>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Este sistema implementa una arquitectura híbrida que extiende el SECOP II con una capa de
            verificación criptográfica e inmutabilidad basada en blockchain. Permite a cualquier ciudadano
            comprobar que un documento contractual no ha sido modificado desde su registro, sin depender
            de la confianza en ninguna entidad administrativa.
          </p>
        </div>
      </section>

      {/* Sección 2 — Datos técnicos */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔐</div>
              <div className="text-sm text-gray-500 mb-1">Algoritmo</div>
              <div className="font-semibold text-gray-900">SHA-256</div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">⛓️</div>
              <div className="text-sm text-gray-500 mb-1">Red blockchain</div>
              <div className="font-semibold text-gray-900">Polygon Amoy · Chain ID 80002</div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📄</div>
              <div className="text-sm text-gray-500 mb-1">Contrato inteligente</div>
              <a
                href="https://amoy.polygonscan.com/address/0xFda33F967F6ed22856ee542910663B180b3Cc79C"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-600 hover:underline break-all"
              >
                0xFda33F967F...Cc79C
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3 — FAQ acordeón */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas frecuentes</h2>
          {faqs.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white">
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{item.q}</span>
                <span
                  className={`ml-4 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-200 overflow-hidden ${
                  openIndex === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 4 — Footer informativo */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Desarrollado por Joseph Steven Linares Gutiérrez · Ingeniería de Sistemas y Computación ·
            Universidad de los Andes · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
