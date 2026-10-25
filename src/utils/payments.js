import { apiClient } from './apiClient';

export const DEPOSIT_PERCENTAGE = Number(import.meta.env.VITE_DEPOSIT_PERCENTAGE || 50);

export const formatMoney = (value) => `S/ ${Number(value || 0).toFixed(2)}`;

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / 86400000));
};

/**
 * Crea la preferencia de Mercado Pago en el backend y redirige al Checkout Pro.
 * option: 'DEPOSIT' | 'FULL' | 'BALANCE'
 */
export async function startMercadoPagoPayment(reservationId, option) {
  const res = await apiClient(`/client/reservations/${reservationId}/payment-preference`, {
    method: 'POST',
    body: JSON.stringify({ option }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.initPoint) {
    throw new Error(data.message || 'No se pudo iniciar el pago con Mercado Pago');
  }
  window.location.assign(data.initPoint);
}
