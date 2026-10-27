import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../utils/apiClient';
import { loadPaymentConfig } from '../utils/payments';

// La Public Key la entrega el backend (MP_PUBLIC_KEY); el Access Token nunca sale de alli.
let initializedKey;
async function loadPublicKey() {
  const publicKey = (await loadPaymentConfig())?.publicKey || null;
  if (publicKey && publicKey !== initializedKey) {
    initMercadoPago(publicKey, { locale: 'es-PE' });
    initializedKey = publicKey;
  }
  return publicKey;
}

/**
 * Formulario de pago oficial de Mercado Pago (Payment Brick) embebido en la página.
 * El Brick tokeniza la tarjeta con la Public Key y el backend crea el pago con el Access Token.
 * amount solo se muestra en el formulario: el monto real lo calcula el backend según option.
 */
export default function MercadoPagoBrick({ reservationId, option, amount, payerEmail, onError }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // undefined = cargando, null = no configurada
  const [publicKey, setPublicKey] = useState(undefined);

  useEffect(() => {
    let active = true;
    loadPublicKey().then((key) => { if (active) setPublicKey(key); });
    return () => { active = false; };
  }, []);

  if (publicKey === undefined) {
    return <p className="text-sm text-ink-900/50">{t('common.loading')}</p>;
  }
  if (!publicKey) {
    return <p role="alert" className="text-sm text-red-700">{t('checkout.mp_not_configured')}</p>;
  }

  const handleSubmit = async ({ formData }) => {
    const res = await apiClient(`/client/reservations/${reservationId}/payments`, {
      method: 'POST',
      body: JSON.stringify({ option, formData }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      onError?.(data.message || t('checkout.payment_error'));
      throw new Error(data.message);
    }
    if (data.status === 'rejected') {
      // Rechazada: el cliente se queda en el formulario para probar otra tarjeta
      onError?.(t('checkout.payment_rejected'));
      throw new Error(data.statusDetail);
    }
    sessionStorage.removeItem('bookingDetails');
    sessionStorage.removeItem('checkoutReservation');
    navigate(`/payment/result?status=${data.status}&external_reference=${data.bookingCode}&payment_id=${data.paymentId}`);
  };

  return (
    <Payment
      // Cambiar el monto exige volver a montar el Brick
      key={`${option}-${amount}`}
      initialization={{ amount: Number(amount), payer: payerEmail ? { email: payerEmail } : undefined }}
      customization={{
        paymentMethods: { creditCard: 'all', debitCard: 'all', maxInstallments: 1 },
        visual: { style: { theme: 'default' } },
      }}
      onSubmit={handleSubmit}
      onError={(error) => console.error('Mercado Pago Brick', error)}
    />
  );
}
