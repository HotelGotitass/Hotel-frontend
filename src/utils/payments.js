import { useEffect, useState } from 'react';
import { BASE_URL } from './apiClient';

export const formatMoney = (value) => `S/ ${Number(value || 0).toFixed(2)}`;

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / 86400000));
};

// Configuracion de pagos del backend ({ publicKey, depositPercentage }); se pide una sola vez.
// El frontend no guarda credenciales ni reglas de negocio: todo sale del backend.
let configPromise;
export function loadPaymentConfig() {
  configPromise ??= fetch(`${BASE_URL}/public/payments/config`)
    .then((res) => {
      if (!res.ok) throw new Error('config');
      return res.json();
    })
    .catch(() => {
      configPromise = undefined;
      return null;
    });
  return configPromise;
}

/** Devuelve la configuracion de pagos, o undefined mientras carga y null si fallo. */
export function usePaymentConfig() {
  const [config, setConfig] = useState(undefined);
  useEffect(() => {
    let active = true;
    loadPaymentConfig().then((c) => { if (active) setConfig(c); });
    return () => { active = false; };
  }, []);
  return config;
}
