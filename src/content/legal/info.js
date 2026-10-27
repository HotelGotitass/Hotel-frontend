// Datos del hotel que aparecen en Terminos y Privacidad. Revisar antes de publicar:
// los campos en null no se muestran; los horarios y la politica de cancelacion son decisiones del hotel.
export const LEGAL_INFO = {
  name: 'Hotel Gotitas',
  legalName: null, // Razon social, p. ej. 'Hotel Gotitas S.A.C.'
  ruc: null,
  address: null,
  email: 'info@hotelgotitas.com',
  phone: '+51 987 654 321',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  lastUpdated: '2026-10-26',
  version: '2.0',
};

// Porcentaje del monto pagado que se devuelve cuando el cliente cancela, segun la anticipacion
// (mismas filas en cada idioma)
export const CLIENT_CANCELLATION_POLICY = {
  es: [
    { when: 'Hasta 7 días antes del check-in', refund: '100 %' },
    { when: 'Entre 7 días y 48 horas antes', refund: '50 %' },
    { when: 'Menos de 48 horas antes', refund: 'Sin reembolso' },
  ],
  en: [
    { when: 'Up to 7 days before check-in', refund: '100%' },
    { when: 'Between 7 days and 48 hours before', refund: '50%' },
    { when: 'Less than 48 hours before', refund: 'No refund' },
  ],
};
