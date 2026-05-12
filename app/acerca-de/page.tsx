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
    a: 'Significa que el sistema detectó una diferencia entre los metadatos publicados por la API del SECOP II y los datos extraídos del documento PDF. Las dimensiones verificadas son: valor del contrato, modalidad de contratación, proveedor adjudicado, duración y fecha de terminación. Una inconsistencia no implica necesariamente irregularidad, puede ser un error de digitación o una actualización no sincronizada.',
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
    a: 'El contrato está desplegado en Polygon Amoy. Puedes consultarlo en el explorador de bloques o llamar directamente a su función verificarHash() con el hash SHA-256 del documento que quieres comprobar.',
    link: { text: '0xFda33F967F6ed22856ee542910663B180b3Cc79C', href: 'https://amoy.polygonscan.com/address/0xFda33F967F6ed22856ee542910663B180b3Cc79C' },
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Acerca de Este Sistema</h1>

      {/* Problema */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">El Problema</h2>
        <p className="text-gray-700 mb-3">
          SECOP II es transparente pero los documentos pueden alterarse después de su publicación.
          No hay cadena de custodia inmutable que garantice la integridad del documento.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Documentos PDF pueden modificarse</li>
          <li>No hay verificación criptográfica</li>
          <li>Falta auditoría ciudadana técnica</li>
        </ul>
      </section>

      {/* Solución */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">La Solución</h2>
        <p className="text-gray-700 mb-3">
          Sistema de notarización digital que registra hashes criptográficos en blockchain:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Hash SHA-256 del documento original</li>
          <li>Registro inmutable en Polygon Amoy Testnet</li>
          <li>Verificación pública sin autenticación</li>
          <li>Comparación automática API vs PDF</li>
        </ul>
      </section>

      {/* Arquitectura */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Arquitectura del Sistema</h2>
        <div className="space-y-4">
          {[
            { num: 1, title: "Entrada", desc: "API SODA del SECOP II" },
            { num: 2, title: "Procesamiento", desc: "Descarga, extracción, normalización, hash" },
            { num: 3, title: "Notarización", desc: "Registro en Polygon Amoy Testnet" },
            { num: 4, title: "Verificación", desc: "Comparación de hashes y metadatos" },
            { num: 5, title: "Consulta", desc: "Portal público sin autenticación" },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Preguntas Frecuentes</h2>
        <div>
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
                <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 font-mono text-blue-600 hover:underline break-all"
                    >
                      {item.link.text}
                    </a>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Créditos */}
      <section className="border-t pt-8 mt-12">
        <h2 className="font-semibold text-gray-900 text-lg mb-4">Créditos</h2>
        <p className="text-gray-700 mb-2">
          <strong>Universidad:</strong> Universidad de los Andes
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Autor:</strong> Joseph Steven Linares Gutiérrez
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Año:</strong> 2026
        </p>
      </section>
    </div>
  );
}
