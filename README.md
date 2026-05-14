# Notarizacion SECOP MVP

Prototipo academico de un portal de verificacion de integridad de documentos contractuales del sistema de compras publicas colombiano (SECOP II), con registro inmutable de huellas criptograficas en la blockchain de Polygon Amoy.

Este proyecto corresponde al trabajo de grado de la Facultad de Ingeniería de la Universidad de los Andes (2026). Su proposito es demostrar la viabilidad tecnica de emplear tecnologia blockchain como capa de auditoria ciudadana sobre documentos oficiales de contratacion publica, sin reemplazar ni modificar los sistemas institucionales existentes.

---

## Descripcion del sistema

SECOP II publica documentos PDF de contratos publicos, pero no ofrece mecanismos nativos de verificacion criptografica que garanticen que un documento no ha sido alterado despues de su publicacion. Este prototipo aborda esa limitacion mediante el siguiente proceso:

1. Se descarga el PDF de cada contrato desde SECOP II y se calcula su huella SHA-256.
2. Se extraen los campos relevantes del PDF (valor, proveedor, duracion, etc.) y se comparan con los datos del API oficial de SECOP II.
3. Cada huella SHA-256 se registra en un contrato inteligente desplegado en la red de prueba Polygon Amoy (EVM, chain ID 80002).
4. Los resultados del procesamiento, la comparacion y el registro en blockchain se almacenan en un archivo JSON estatico.
5. El portal web permite consultar ese archivo, verificar la consistencia de los datos y acceder al comprobante blockchain de cada contrato.

El portal es de solo lectura. No requiere autenticacion, no conecta en tiempo real con SECOP II ni con la blockchain, y toda la informacion que presenta proviene del archivo `public/data/datos.json`, generado previamente por el pipeline de procesamiento.

**Advertencia:** este sistema es un prototipo academico sin validez legal. No modifica ni reemplaza a SECOP II.

---

## Arquitectura general

```
Pipeline (externo al portal)
  └── Descarga PDFs de SECOP II
  └── Calcula hashes SHA-256
  └── Compara PDF vs API
  └── Registra hashes en Polygon Amoy
  └── Genera datos.json

Portal web (este repositorio)
  └── Sirve datos.json como recurso estatico
  └── Permite buscar y consultar comprobantes
  └── Muestra comparaciones campo a campo
  └── Enlaza con el explorador de bloques Polygonscan
```

**Contrato inteligente:** `0xFda33F967F6ed22856ee542910663B180b3Cc79C`  
**Red:** Polygon Amoy Testnet (chain ID: 80002)  
**Explorador:** https://amoy.polygonscan.com

---

## Tecnologias utilizadas

| Capa | Tecnologia |
|------|------------|
| Framework web | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 con PostCSS |
| Biblioteca de interfaz | React 19 |
| Manejo de fechas | date-fns 4 (locale es) |
| Linting | ESLint 9 |
| Blockchain | Polygon Amoy Testnet |

No se utiliza base de datos relacional, ORM, ni rutas de API en Next.js. El sistema es una aplicacion estatica con renderizado del lado del cliente.

---

## Estructura del proyecto

```
notarizacion-secop-mvp/
├── app/
│   ├── layout.tsx          # Layout raiz (Navbar y Footer)
│   ├── page.tsx            # Pagina de inicio (hero, estadisticas, proceso)
│   ├── buscar/
│   │   └── page.tsx        # Busqueda y detalle de comprobantes
│   └── acerca-de/
│       └── page.tsx        # Preguntas frecuentes y descripcion del sistema
├── src/
│   ├── components/
│   │   ├── Badge.tsx               # Indicador de estado (CONSISTENTE, INCONSISTENTE, etc.)
│   │   ├── BlockchainInfoPanel.tsx # Datos de la transaccion en blockchain
│   │   ├── ComprobanteSummary.tsx  # Resumen del comprobante con hash y metadatos
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchBar.tsx           # Barra de busqueda con autocompletado y debounce
│   │   ├── TabSwitch.tsx           # Navegacion por pestanas
│   │   └── VerificationTable.tsx  # Tabla de comparacion API vs PDF
│   └── lib/
│       ├── data.ts         # Carga y consulta de datos.json, calculo de estadisticas
│       ├── types.ts        # Interfaces TypeScript de todos los modelos de datos
│       └── utils.ts        # Funciones auxiliares (fechas, colores, formato de hash)
└── public/
    └── data/
        └── datos.json      # Conjunto de datos pre-procesados (fuente unica de verdad)
```

---

## Modelo de datos principal

Cada registro en `datos.json` corresponde a un contrato y tiene la siguiente estructura simplificada:

```typescript
{
  id_contrato: string;           // Identificador del contrato en SECOP II
  notice_uid: string;            // Identificador del proceso de contratacion
  hash_sha256: string;           // Huella criptografica SHA-256 del PDF
  timestamp_pipeline: string;    // Fecha y hora del procesamiento

  campos_pdf: { ... };           // Datos extraidos del PDF

  clasificacion: "CONSISTENTE" | "INCONSISTENTE" | "DATO_AUSENTE" | "ADVERTENCIA";
  n_inconsistencias: number;
  verificaciones: Verificacion[]; // Comparacion campo a campo entre API y PDF

  bc_estado: "REGISTRADO" | "PENDIENTE";
  bc_tx_hash: string;            // Hash de la transaccion en Polygon Amoy
  bc_block_number: number;
  bc_contract_address: string;
  bc_chain_id: number;           // 80002
}
```

---

## Flujo de uso del portal

**Pagina de inicio (`/`)**  
Presenta estadisticas globales calculadas a partir de `datos.json`: total de contratos procesados, porcentaje de consistencia, conteo por clasificacion.

**Busqueda (`/buscar`)**  
Sin parametros, muestra todos los contratos con filtros por clasificacion. Al seleccionar uno (o al acceder con `?id=<id_contrato>`), se despliega el detalle en tres pestanas:

- *Comprobante:* hash SHA-256, metadatos del procesamiento, resumen de verificacion y guia para verificacion manual independiente.
- *Verificacion:* tabla comparativa campo a campo entre los datos del API de SECOP II y los extraidos del PDF.
- *Blockchain:* hash de transaccion, numero de bloque, gas utilizado y enlace directo a Polygonscan.

**Acerca de (`/acerca-de`)**  
Explica el problema, la solucion, la arquitectura del sistema y responde preguntas frecuentes sobre el funcionamiento y las limitaciones del prototipo.

---

## Requisitos previos

- Node.js >= 18
- npm >= 9 (o yarn / pnpm equivalente)

No se requiere ninguna clave de API, variable de entorno ni conexion a base de datos.

---

## Instalacion y ejecucion

**1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd notarizacion-secop-mvp
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar el servidor de desarrollo**

```bash
npm run dev
```

El portal estara disponible en `http://localhost:3000`.

**4. Compilar para produccion**

```bash
npm run build
npm run start
```

**5. Verificar calidad del codigo**

```bash
npm run lint
```

---

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3000 |
| `npm run build` | Compila la aplicacion para produccion |
| `npm run start` | Inicia el servidor de produccion tras compilar |
| `npm run lint` | Ejecuta ESLint sobre el codigo fuente |

---

## Verificacion manual independiente

El sistema esta disenado para que cualquier persona pueda verificar de forma autonoma la integridad de un documento sin depender del portal. El proceso es el siguiente:

1. Descargar el PDF del contrato desde SECOP II.
2. Calcular su huella SHA-256 localmente (por ejemplo, con `certutil -hashfile archivo.pdf SHA256` en Windows o `sha256sum archivo.pdf` en Linux/macOS).
3. Comparar el hash obtenido con el registrado en el portal.
4. Consultar la transaccion correspondiente directamente en https://amoy.polygonscan.com usando el hash de transaccion (`bc_tx_hash`) visible en la pestana Blockchain del comprobante.

---

## Limitaciones y alcance

- Los datos son estaticos y corresponden a un conjunto acotado de contratos procesados durante el desarrollo del proyecto.
- La red Polygon Amoy es una red de prueba; las transacciones no tienen valor economico real.
- El sistema no ofrece garantias de disponibilidad permanente.
- Este prototipo no tiene validez legal ni sustituye los mecanismos oficiales de SECOP II.
