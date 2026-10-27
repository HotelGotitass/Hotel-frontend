import { LEGAL_INFO as H, CLIENT_CANCELLATION_POLICY } from './info';

// Reglas tomadas de lo que el sistema aplica de verdad (backend): anticipo, ventana de pago,
// modificacion unica con 48 h, cancelacion automatica de no-shows y casos de reembolso.
// depositPercentage y paymentWindowMinutes llegan del backend (/public/payments/config); null mientras carga.
export function buildTerms({ depositPercentage, paymentWindowMinutes }) {
  const hasPct = Number.isFinite(depositPercentage);
  const pct = hasPct ? depositPercentage : '…';
  const rest = hasPct ? 100 - depositPercentage : '…';
  const minutes = paymentWindowMinutes ?? '…';
  return {
    title: 'Términos y Condiciones',
    intro: `Las reglas que rigen tus reservas en ${H.name}: cómo reservar, cuánto y cuándo pagar, cómo cambiar o cancelar y qué esperar durante tu estadía. Las escribimos en lenguaje claro para que sepas exactamente a qué te comprometes.`,
    highlights: [
      { value: `${pct}%`, label: 'Anticipo', text: 'Confirma tu reserva pagando el anticipo; el saldo lo cancelas antes o al llegar.' },
      { value: `${minutes} min`, label: 'Habitación apartada', text: 'Tiempo que bloqueamos la habitación mientras completas el pago.' },
      { value: '1 vez', label: 'Cambio de fechas', text: 'Puedes modificar tus fechas una vez, hasta 48 horas antes del check-in.' },
      { value: 'S/', label: 'Pago seguro', text: 'Pagos en soles procesados por Mercado Pago. No guardamos tu tarjeta.' },
    ],
    sections: [
      {
        id: 'aceptacion',
        title: 'Aceptación y alcance',
        blocks: [
          { type: 'p', text: `Estos Términos y Condiciones regulan el uso del sitio web de **${H.name}** y la contratación de servicios de hospedaje a través de él. Al crear una cuenta, realizar una reserva o marcar la casilla de aceptación en el checkout, declaras haberlos leído y aceptado.` },
          { type: 'p', text: 'Las reservas hechas por teléfono o directamente en recepción se rigen por estas mismas reglas en lo que les resulte aplicable. Si no estás de acuerdo con alguna condición, te pedimos no utilizar el servicio de reservas en línea.' },
          { type: 'p', text: 'El tratamiento de tus datos personales se explica por separado en nuestra [Política de Privacidad](/privacidad), que forma parte de estos términos.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Definiciones',
        blocks: [
          {
            type: 'list',
            items: [
              `**Hotel:** ${H.name}${H.legalName ? ` (${H.legalName})` : ''}, prestador del servicio de hospedaje.`,
              '**Cliente:** la persona mayor de edad que crea una cuenta y realiza la reserva.',
              '**Huésped:** cada persona que se aloja; puede o no ser el cliente.',
              '**Reserva:** solicitud de hospedaje en una categoría de habitación para fechas concretas, identificada con un código único.',
              '**Anticipo:** pago parcial que confirma la reserva.',
              '**Saldo:** diferencia entre el precio total de la estadía y lo ya pagado.',
              '**No-show:** cuando el huésped no se presenta en la fecha de check-in sin haber cancelado.',
            ],
          },
        ],
      },
      {
        id: 'cuenta',
        title: 'Tu cuenta',
        blocks: [
          { type: 'p', text: 'Para reservar en línea necesitas una cuenta personal. Al registrarte te enviamos un código de verificación a tu correo; la cuenta queda activa cuando lo confirmas.' },
          {
            type: 'list',
            items: [
              'Debes ser mayor de 18 años y proporcionar datos verdaderos y actualizados.',
              'Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.',
              'Avísanos de inmediato si sospechas un acceso no autorizado.',
              'Podemos suspender cuentas que entreguen información falsa, intenten fraudes o hagan un uso abusivo del sistema (por ejemplo, reservas masivas sin pago para bloquear disponibilidad).',
            ],
          },
        ],
      },
      {
        id: 'reservas',
        title: 'Cómo funciona una reserva',
        blocks: [
          {
            type: 'steps',
            items: [
              { title: 'Eliges', text: 'Seleccionas la categoría de habitación, las fechas y el número de huéspedes, que no puede superar la capacidad máxima de la categoría.' },
              { title: 'Apartamos', text: `Al pasar al pago creamos tu reserva en estado **pendiente** y bloqueamos la habitación durante **${minutes} minutos**.` },
              { title: 'Pagas', text: `Pagas el anticipo del **${pct}%** o el total con Mercado Pago, sin salir de nuestra web.` },
              { title: 'Confirmamos', text: 'Cuando el pago se aprueba, la reserva pasa a **confirmada** y te enviamos un correo con tu código de reserva.' },
            ],
          },
          { type: 'callout', tone: 'warn', title: 'Si no completas el pago a tiempo', text: `Pasados los ${minutes} minutos sin un pago aprobado, la reserva se cancela automáticamente y la habitación se libera para otros clientes. Puedes volver a reservar si sigue disponible.` },
          { type: 'p', text: 'Reservas una **categoría** de habitación, no un número de habitación específico. La habitación concreta se asigna en recepción al momento del check-in, según disponibilidad.' },
        ],
      },
      {
        id: 'precios-pagos',
        title: 'Precios y pagos',
        blocks: [
          { type: 'p', text: 'Los precios se expresan en **soles (PEN)** e incluyen los impuestos aplicables. El precio total es la tarifa por noche de la categoría multiplicada por el número de noches, y queda fijado al crear la reserva.' },
          {
            type: 'table',
            head: ['Opción', 'Pagas hoy', 'Pagas después'],
            rows: [
              ['Anticipo', `${pct}% del total`, `El ${rest}% restante, desde "Mis reservas" o en recepción`],
              ['Pago total', '100% del total', 'Nada (salvo consumos y servicios extra)'],
            ],
          },
          {
            type: 'list',
            items: [
              '**Pagos en línea:** se procesan con Mercado Pago mediante tarjeta de crédito o débito, en una sola cuota. Los datos de tu tarjeta los recibe Mercado Pago directamente; nosotros nunca los vemos ni los guardamos.',
              '**Pagos en recepción:** puedes cancelar el saldo en efectivo, tarjeta, transferencia o Yape/Plin.',
              '**Aprobación inmediata:** los pagos en línea se aprueban o rechazan al instante. Si tu banco rechaza el pago, puedes intentarlo con otra tarjeta mientras la reserva siga apartada.',
              '**Comprobante:** por cada estadía emitimos un comprobante que puedes descargar desde "Mis reservas".',
            ],
          },
          { type: 'callout', tone: 'info', title: 'Pago aprobado después de que venció la reserva', text: 'Si por demoras del medio de pago tu pago se aprueba cuando la reserva ya fue cancelada por tiempo y la habitación ya no está disponible, te devolvemos el **100%** de ese pago.' },
        ],
      },
      {
        id: 'modificaciones',
        title: 'Cambios de fecha',
        blocks: [
          { type: 'p', text: 'Puedes modificar las fechas de una reserva pendiente o confirmada desde "Mis reservas", con estas condiciones:' },
          {
            type: 'list',
            items: [
              'Solo **una vez** por reserva.',
              'Hasta **48 horas antes** de las 00:00 del día del check-in original.',
              'Sujeto a disponibilidad de la misma categoría en las nuevas fechas.',
              'El precio total se **recalcula** con la tarifa vigente y el nuevo número de noches. Si el nuevo total es mayor, pagas la diferencia; si es menor, el saldo a favor se aplica según la política de reembolsos.',
            ],
          },
          { type: 'p', text: 'Para cambios que no cumplan estas condiciones (por ejemplo, una segunda modificación o el cambio de categoría), comunícate con recepción; los atenderemos según disponibilidad, sin obligación de aceptarlos.' },
        ],
      },
      {
        id: 'cancelaciones',
        title: 'Cancelaciones y reembolsos',
        blocks: [
          { type: 'p', text: 'Puedes cancelar tu reserva desde "Mis reservas" en cualquier momento **antes del check-in**. Una vez registrado tu ingreso, la cancelación debe gestionarse en recepción.' },
          { type: 'p', text: 'Si ya habías pagado, al cancelar se genera automáticamente una **solicitud de reembolso**, que recepción revisa aplicando la siguiente escala según la anticipación con la que cancelaste:' },
          { type: 'table', head: ['Cancelas', 'Te devolvemos'], rows: CLIENT_CANCELLATION_POLICY.es.map((r) => [r.when, r.refund]) },
          { type: 'p', text: 'Independientemente de la anticipación, te devolvemos el **100%** de lo pagado cuando:' },
          {
            type: 'list',
            items: [
              'El hotel cancela tu reserva por causas atribuibles a nosotros.',
              'Se realizó un cobro duplicado.',
              'Hubo una falla técnica en el proceso de pago o reserva.',
              'Tu pago se aprobó después de que la reserva venció y ya no había disponibilidad.',
            ],
          },
          { type: 'callout', tone: 'info', title: 'Plazos de devolución', text: 'Los reembolsos aprobados se devuelven por el mismo medio de pago. En pagos con tarjeta, el abono depende de Mercado Pago y de tu banco, y suele verse en tu estado de cuenta entre 2 y 30 días hábiles. Los pagos hechos en recepción se devuelven en recepción.' },
        ],
      },
      {
        id: 'no-show',
        title: 'No presentación (no-show)',
        blocks: [
          { type: 'p', text: 'Si no te presentas en la fecha de check-in y no cancelaste la reserva, el sistema la cancela automáticamente durante la madrugada del día siguiente y la habitación se libera.' },
          { type: 'p', text: 'Un no-show **no genera reembolso**: los montos pagados se retienen como compensación por la habitación bloqueada. Si vas a llegar tarde, avísanos por correo o teléfono para conservar tu reserva.' },
        ],
      },
      {
        id: 'estadia',
        title: 'Durante tu estadía',
        blocks: [
          {
            type: 'table',
            head: ['', 'Horario'],
            rows: [
              ['Check-in', `Desde las ${H.checkInTime}`],
              ['Check-out', `Hasta las ${H.checkOutTime}`],
            ],
          },
          {
            type: 'list',
            items: [
              '**Identificación:** todos los huéspedes deben presentar un documento de identidad vigente (DNI, carné de extranjería o pasaporte) al registrarse.',
              '**Menores de edad:** deben alojarse acompañados de sus padres o de un adulto autorizado, con su documento de identidad.',
              '**Capacidad:** no está permitido alojar a más personas que las registradas en la reserva ni superar la capacidad de la habitación.',
              '**Ingreso y salida anticipados o tardíos:** sujetos a disponibilidad y, en su caso, a un cargo adicional informado en recepción.',
              '**Consumos y servicios extra:** se cargan a tu cuenta y se pagan, junto con el saldo pendiente, antes del check-out.',
              '**Normas de convivencia:** te pedimos respetar el descanso de otros huéspedes y las normas internas exhibidas en recepción.',
              '**Daños:** el cliente responde por los daños causados a la habitación o al mobiliario por él o sus acompañantes, más allá del desgaste normal.',
            ],
          },
        ],
      },
      {
        id: 'responsabilidad',
        title: 'Responsabilidad',
        blocks: [
          { type: 'p', text: 'Nos comprometemos a prestar el servicio contratado en las condiciones ofrecidas. No respondemos por la pérdida de dinero, joyas u objetos de valor que no hayan sido entregados en custodia a recepción.' },
          { type: 'p', text: 'Tampoco somos responsables por incumplimientos causados por caso fortuito o fuerza mayor (desastres naturales, disposiciones de la autoridad, cortes generales de servicios). En esos casos te ofreceremos reprogramar la reserva o, si no fuera posible, el reembolso de lo pagado por las noches no prestadas.' },
          { type: 'p', text: 'Las fotos y descripciones de las habitaciones son referenciales. Pueden existir diferencias menores de decoración o distribución entre habitaciones de la misma categoría.' },
        ],
      },
      {
        id: 'reclamos',
        title: 'Libro de Reclamaciones',
        blocks: [
          { type: 'p', text: 'Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571), ponemos a tu disposición un [Libro de Reclamaciones virtual](/libro-reclamaciones), además del físico en recepción.' },
          {
            type: 'list',
            items: [
              '**Reclamo:** disconformidad relacionada con el servicio prestado.',
              '**Queja:** malestar no relacionado con el servicio en sí (por ejemplo, la atención recibida).',
            ],
          },
          { type: 'p', text: 'Respondemos tu reclamo o queja en un plazo máximo de **15 días hábiles**. Presentar un reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.' },
        ],
      },
      {
        id: 'propiedad',
        title: 'Propiedad intelectual',
        blocks: [
          { type: 'p', text: `La marca ${H.name}, el logotipo, las fotografías, los textos y el diseño de este sitio nos pertenecen o los usamos con autorización. No puedes copiarlos, modificarlos ni utilizarlos con fines comerciales sin nuestro permiso escrito.` },
        ],
      },
      {
        id: 'cambios',
        title: 'Cambios a estos términos',
        blocks: [
          { type: 'p', text: 'Podemos actualizar estos términos para reflejar cambios legales u operativos. Publicaremos la nueva versión en esta página con su fecha de actualización. Las reservas ya confirmadas se rigen por los términos vigentes al momento de reservar.' },
        ],
      },
      {
        id: 'ley',
        title: 'Ley aplicable',
        blocks: [
          { type: 'p', text: 'Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se resolverá preferentemente por trato directo o mediante el Libro de Reclamaciones; de no llegar a un acuerdo, ante las autoridades administrativas y los jueces competentes del Perú.' },
        ],
      },
    ],
  };
}
