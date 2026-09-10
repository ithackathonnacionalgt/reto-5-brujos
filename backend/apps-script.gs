/**
 * MultaClara — Backend demo (Google Sheets + Apps Script)
 * =======================================================
 * CÓMO USAR:
 * 1. Creá un Google Sheet nuevo y llamalo "MultaClaraDemo"
 * 2. En la primera hoja (Sheet1), poné estos encabezados en la fila 1:
 *    placa | entidad | fecha | infraccion | monto | estado
 * 3. Llená filas de ejemplo (ver sección DATOS DEMO abajo)
 * 4. En el Sheet: Extensiones → Apps Script
 * 5. Pegá TODO este archivo en el editor
 * 6. Deploy → Nueva implementación → Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Acceso: Cualquier persona
 * 7. Copiá la URL del Web App y usala en src/lib/data.js
 */

// ============================================================
// CONFIG
// ============================================================
const HOJA = 'Sheet1'; // nombre de la hoja con los datos

// ============================================================
// ENDPOINTS (Web App)
// ============================================================

/** GET /?placa=P123ABC → multas de esa placa */
function doGet(e) {
  const placa = (e && e.parameter && e.parameter.placa || '')
    .toString()
    .trim()
    .toUpperCase();

  const salida = {
    ok: true,
    placa: placa,
    multas: [],
    fuente: 'Google Sheets + Apps Script (datos demo)',
    fecha: new Date().toISOString(),
  };

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
    if (!sheet) throw new Error('No se encontró la hoja ' + HOJA);

    const datos = sheet.getDataRange().getValues();
    const encabezados = datos[0].map((h) => h.toString().trim().toLowerCase());

    // Índices de columnas (por nombre, no por posición)
    const idx = {
      placa: encabezados.indexOf('placa'),
      entidad: encabezados.indexOf('entidad'),
      fecha: encabezados.indexOf('fecha'),
      infraccion: encabezados.indexOf('infraccion'),
      monto: encabezados.indexOf('monto'),
      estado: encabezados.indexOf('estado'),
    };

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const placaFila = (fila[idx.placa] || '').toString().trim().toUpperCase();
      if (placaFila !== placa) continue;

      salida.multas.push({
        placa: placaFila,
        entidad: fila[idx.entidad] || '',
        fecha: fila[idx.fecha] || '',
        infraccion: fila[idx.infraccion] || '',
        monto: Number(fila[idx.monto]) || 0,
        estado: fila[idx.estado] || 'pendiente',
      });
    }

    if (salida.multas.length === 0) {
      salida.ok = true;
      salida.mensaje = 'No se encontraron multas para esta placa';
    }
  } catch (err) {
    salida.ok = false;
    salida.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(salida))
    .setMimeType(ContentService.MimeType.JSON);
}

/** POST con JSON { placa, entidad, fecha, infraccion, monto, estado } → agrega multa */
function doPost(e) {
  const salida = { ok: true };

  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);

    sheet.appendRow([
      (body.placa || '').toString().trim().toUpperCase(),
      body.entidad || '',
      body.fecha || '',
      body.infraccion || '',
      Number(body.monto) || 0,
      body.estado || 'pendiente',
    ]);

    salida.mensaje = 'Multa agregada correctamente';
  } catch (err) {
    salida.ok = false;
    salida.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(salida))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// DATOS DEMO — para llenar el Sheet (copiá estas filas)
// ============================================================
// placa     | entidad  | fecha       | infraccion              | monto | estado
// P123ABC   | EMETRA   | 2026-08-20  | semaforo_rojo           | 400   | pendiente
// P123ABC   | EMETRA   | 2026-07-01  | estacionamiento_prohibido | 400  | pendiente
// P123ABC   | PNC      | 2026-05-10  | licencia_vencida        | 300   | pagada
// M789XYZ   | PNC      | 2026-09-01  | semaforo_rojo           | 400   | pendiente
// M789XYZ   | MuniGuate| 2026-08-15  | basura_vehiculo         | 300   | pendiente
// C456DEF   | EMETRA   | 2026-03-01  | sin_tarjeta_circulacion | 200   | pagada