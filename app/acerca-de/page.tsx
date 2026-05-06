export default function AcercaDePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Acerca de Este Sistema</h1>
      
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
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">¿Esto reemplaza SECOP II?</h3>
            <p className="text-gray-700">
              No. Es una capa complementaria que añade integridad criptográfica.
              SECOP II sigue siendo la fuente oficial de información.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">¿Es verificable públicamente?</h3>
            <p className="text-gray-700">
              Sí. Puedes validar cualquier transacción en Polygonscan sin necesidad de autenticación.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">¿Qué pasa con datos sensibles?</h3>
            <p className="text-gray-700">
              Se almacena solo el hash SHA-256, no el documento original.
              El hash no permite reconstruir el contenido.
            </p>
          </div>
        </div>
      </section>

      {/* Créditos */}
      <section className="border-t pt-8 mt-12">
        <h2 className="text-xl font-semibold mb-4">Créditos</h2>
        <p className="text-gray-700 mb-2">
          <strong>Universidad:</strong> Universidad de los Andes
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Autor:</strong> Joseph Steven Linares Gutiérrez
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Año:</strong> 2026
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Prototipo académico — No tiene valor jurídico
        </p>
      </section>
    </div>
  );
}