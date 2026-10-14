import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terminos y Condiciones</h1>
      <div className="prose">
        <p className="mb-4">Bienvenido a Hotel App. Al utilizar nuestros servicios, usted acepta los siguientes terminos...</p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Reservas y Pagos</h2>
        <p className="mb-4">Toda reserva web requiere un pago o anticipo del 50%. Este pago no es reembolsable bajo ciertas condiciones.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Modificaciones</h2>
        <p className="mb-4">Las modificaciones de fechas estan permitidas hasta 48 horas antes del check-in, sujetas a disponibilidad.</p>
      </div>
    </div>
  );
};

export default Terms;
