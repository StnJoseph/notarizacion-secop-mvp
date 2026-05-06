import Badge from './Badge'
import type { Verificacion } from '../lib/types'

type BadgeClasificacion =
  | 'CONSISTENTE'
  | 'INCONSISTENTE'
  | 'ADVERTENCIA'
  | 'DATO_AUSENTE'
  | 'NO_VERIFICABLE'

function toBadge(resultado: Verificacion['resultado']): BadgeClasificacion {
  return resultado === 'OK' ? 'CONSISTENTE' : resultado
}

interface Props {
  verificaciones: Verificacion[]
}

export default function VerificationTable({ verificaciones }: Props) {
  return (
    <div className="w-full">
      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3 text-left font-semibold">Campo</th>
              <th className="px-4 py-3 text-left font-semibold">Valor API</th>
              <th className="px-4 py-3 text-left font-semibold">Valor PDF</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {verificaciones.map((v, i) => (
              <tr
                key={v.campo}
                className={`border-b border-gray-200 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">{v.campo}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{v.valor_api ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{v.valor_pdf ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge clasificacion={toBadge(v.resultado)} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-3">
        {verificaciones.map((v) => (
          <div key={v.campo} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="font-semibold text-gray-800 text-sm">{v.campo}</span>
              <Badge clasificacion={toBadge(v.resultado)} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <span className="block text-gray-400 mb-0.5 font-medium uppercase tracking-wide text-[10px]">
                  API
                </span>
                <span className="block truncate">{v.valor_api ?? '—'}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-0.5 font-medium uppercase tracking-wide text-[10px]">
                  PDF
                </span>
                <span className="block truncate">{v.valor_pdf ?? '—'}</span>
              </div>
            </div>
            {v.detalle && (
              <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-100 pt-2">
                {v.detalle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
