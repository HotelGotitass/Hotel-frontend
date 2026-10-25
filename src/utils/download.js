/**
 * Descarga un PDF recibido del backend.
 *
 * - Verifica que la respuesta sea realmente un PDF (cabecera %PDF): si llega un JSON de error o el
 *   index.html del SPA, se lanza un error claro en vez de guardar un archivo corrupto.
 * - No revoca la URL inmediatamente: Chrome abre el PDF en su visor leyendo el blob DESPUES del click;
 *   revocarla en el acto produce "No se pudo cargar el documento PDF".
 */
export async function downloadPdfResponse(res, filename) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status} al descargar el PDF`);
  }
  const buffer = await res.arrayBuffer();
  const header = new TextDecoder().decode(new Uint8Array(buffer.slice(0, 5)));
  if (!header.startsWith('%PDF')) {
    throw new Error('El servidor no devolvió un PDF válido. Revisa VITE_API_BASE_URL y que el backend esté actualizado.');
  }

  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
