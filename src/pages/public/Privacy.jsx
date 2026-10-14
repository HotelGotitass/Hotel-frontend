import React from 'react';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politica de Privacidad</h1>
      <div className="prose">
        <p className="mb-4">En Hotel App respetamos su privacidad y cumplimos con la Ley de Proteccion de Datos Personales.</p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Uso de Datos</h2>
        <p className="mb-4">Sus datos personales seran utilizados unicamente para gestionar su reserva, facturacion y estadia.</p>
        <p className="mb-4">No registramos su direccion IP sin su consentimiento explicito, conforme a la normativa vigente.</p>
      </div>
    </div>
  );
};

export default Privacy;
