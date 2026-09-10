// Carga de datos: infracciones.json + entidades.json
// Los JSON viven en /public y se cargan con fetch.

// ============================================================
// BACKEND DEMO — Google Sheets + Apps Script
// Poné acá la URL del Web App (ver backend/apps-script.gs)
// ============================================================
const SHEETS_API_URL = ''; // TODO(André): pegar URL del Web App

/**
 * Consulta las multas de una placa al backend de Google Sheets.
 * Si no hay URL configurada o falla, devuelve [] (la UI usa fallback).
 * @param {string} placa
 * @returns {Promise<Array>}
 */
export async function cargarMultasPorPlaca(placa) {
  if (!SHEETS_API_URL) return []
  try {
    const res = await fetch(`${SHEETS_API_URL}?placa=${encodeURIComponent(placa)}`)
    if (!res.ok) throw new Error('Backend no respondió')
    const data = await res.json()
    return data.ok ? data.multas : []
  } catch {
    return []
  }
}

export async function cargarInfracciones() {
  const res = await fetch('/infracciones.json')
  if (!res.ok) throw new Error('No se pudo cargar infracciones.json')
  return res.json()
}

export async function cargarEntidades() {
  const res = await fetch('/entidades.json')
  if (!res.ok) throw new Error('No se pudo cargar entidades.json')
  return res.json()
}

/**
 * Busca una infracción por id.
 * @param {Array} infracciones
 * @param {string} id
 */
export function buscarInfraccionPorId(infracciones, id) {
  return infracciones.find((i) => i.id === id) ?? null
}

/**
 * Busca infracciones por palabra clave en el nombre.
 * @param {Array} infracciones
 * @param {string} texto
 */
export function buscarInfracciones(infracciones, texto) {
  const q = texto.trim().toLowerCase()
  if (!q) return infracciones
  return infracciones.filter(
    (i) =>
      i.nombre.toLowerCase().includes(q) ||
      i.categoria.toLowerCase().includes(q) ||
      i.codigo.toLowerCase().includes(q)
  )
}