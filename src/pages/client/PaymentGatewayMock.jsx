import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { apiClient, BASE_URL } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function PaymentGatewayMock() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error'

  useEffect(() => {
    const data = sessionStorage.getItem('pendingPayment');
    if (!data) {
      navigate('/');
      return;
    }
    setPaymentData(JSON.parse(data));
  }, [navigate]);

  if (!paymentData) return null;

  const depositAmount = (paymentData.totalPrice * (paymentData.depositPercentage || 50)) / 100;

  const handleSimulatePayment = async (status, amount) => {
    setProcessing(true);
    
    // Simular retraso de red de pasarela
    await new Promise(r => setTimeout(r, 2000));

    try {
      const payload = {
        payment_id: "SIM_" + Math.floor(Math.random() * 1000000),
        status: status,
        external_reference: paymentData.bookingCode,
        amount: amount
      };

      const res = await fetch(`${BASE_URL}/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': 'mock-signature-para-saltar-seguridad'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al notificar webhook');

      setResult(status === 'APPROVED' ? 'success' : 'error');
      
      setTimeout(() => {
        sessionStorage.removeItem('pendingPayment');
        navigate(status === 'APPROVED' ? '/client/reservations' : '/');
      }, 3000);

    } catch (err) {
      console.error(err);
      setResult('error');
    } finally {
      setProcessing(false);
    }
  };

  if (result === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#0a0a0a] border border-green-500/30 text-white rounded-2xl text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">{t('payment.success_title')}</h2>
          <p className="text-white/60 mb-4">{t('payment.success_desc')}</p>
          <p className="text-sm text-white/40">{t('payment.success_redirect')}</p>
        </div>
      </div>
    );
  }

  if (result === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#0a0a0a] border border-red-500/30 text-white rounded-2xl text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">{t('payment.error_title')}</h2>
          <p className="text-white/60 mb-4">{t('payment.error_desc')}</p>
          <p className="text-sm text-white/40">{t('payment.error_redirect')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-[#0a0a0a] border-t-4 border-blue-500 border border-white/10 text-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center mb-6 gap-3">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">{t('payment.title')}</h2>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6 text-center">
          <p className="text-sm text-white/50 mb-1">{t('payment.booking')}</p>
          <p className="text-xl font-mono font-bold text-[#eca8d6]">{paymentData.bookingCode}</p>
          <p className="text-sm text-white/60 mt-1">Total: <span className="font-bold text-white">S/ {Number(paymentData.totalPrice).toFixed(2)}</span></p>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            disabled={processing}
            onClick={() => handleSimulatePayment('APPROVED', depositAmount)}
            className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {processing ? t('payment.processing') : `${t('client.pay_deposit')} (S/ ${depositAmount.toFixed(2)})`}
          </button>
          
          <button 
            disabled={processing}
            onClick={() => handleSimulatePayment('APPROVED', paymentData.totalPrice)}
            className="w-full bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {processing ? t('payment.processing') : `${t('client.pay_full')} (S/ ${Number(paymentData.totalPrice).toFixed(2)})`}
          </button>
          
          <button 
            disabled={processing}
            onClick={() => handleSimulatePayment('REJECTED', depositAmount)}
            className="w-full border-2 border-red-500/50 text-red-400 p-4 rounded-xl hover:bg-red-500/10 disabled:opacity-50 font-semibold transition-colors"
          >
            {t('payment.simulate_reject')}
          </button>
        </div>

        <p className="text-xs text-center text-white/30">
          {t('payment.disclaimer')}
        </p>
      </div>
    </div>
  );
}
