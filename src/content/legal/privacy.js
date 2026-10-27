import { LEGAL_INFO as H } from './info';

// Describe lo que el sistema guarda y hace de verdad: datos de cuenta/huesped/reserva, pagos tokenizados
// por Mercado Pago, IP solo en memoria para limitar intentos, sesion en localStorage, sin cookies de analitica.
export function buildPrivacy() {
  const owner = [H.legalName || H.name, H.ruc && `RUC ${H.ruc}`, H.address].filter(Boolean).join(', ');

  return {
    title: 'Política de Privacidad',
    intro: `Qué datos personales recopila ${H.name}, para qué los usamos, con quién los compartimos y cómo puedes controlarlos. Tratamos tus datos conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento.`,
    highlights: [
      { value: '0', label: 'Tarjetas guardadas', text: 'Tus datos de pago los procesa Mercado Pago; nunca pasan por nuestros servidores.' },
      { value: 'Sin', label: 'Publicidad', text: 'No vendemos tus datos ni te enviamos publicidad sin tu consentimiento.' },
      { value: 'BCrypt', label: 'Contraseñas cifradas', text: 'Guardamos tu contraseña cifrada; nadie del hotel puede leerla.' },
      { value: 'ARCO', label: 'Tus derechos', text: 'Accede, rectifica, cancela u opón a tus datos escribiéndonos.' },
    ],
    sections: [
      {
        id: 'responsable',
        title: 'Responsable del tratamiento',
        blocks: [
          { type: 'p', text: `El responsable de tus datos personales es **${owner}**. Para cualquier consulta sobre privacidad puedes escribirnos a [${H.email}](mailto:${H.email}).` },
          { type: 'p', text: 'Esta política aplica a los datos que recopilamos a través de nuestro sitio web, del Libro de Reclamaciones virtual y en recepción al registrar tu estadía.' },
        ],
      },
      {
        id: 'datos',
        title: 'Datos que recopilamos',
        blocks: [
          { type: 'p', text: 'Recopilamos solo los datos necesarios para gestionar tu reserva y tu estadía:' },
          {
            type: 'table',
            head: ['Categoría', 'Datos', 'Cuándo'],
            rows: [
              ['Cuenta', 'Correo electrónico y contraseña (cifrada)', 'Al registrarte'],
              ['Identificación', 'Nombres, apellidos, tipo y número de documento, teléfono y dirección', 'Al registrarte o en el check-in'],
              ['Reserva', 'Fechas, número de huéspedes, categoría, código de reserva, cambios y cancelaciones', 'Al reservar'],
              ['Pagos', 'Monto, estado, fecha e identificador de la operación en Mercado Pago', 'Al pagar'],
              ['Estadía', 'Habitación asignada, consumos y servicios extra', 'Durante tu estadía'],
              ['Reclamos', 'Nombre, documento, correo, teléfono y detalle del reclamo o queja', 'Al usar el Libro de Reclamaciones'],
            ],
          },
          { type: 'callout', tone: 'info', title: 'Lo que NO guardamos', text: 'No almacenamos el número, la fecha de vencimiento ni el código de seguridad de tu tarjeta. Mercado Pago los convierte en un código de un solo uso directamente desde tu navegador.' },
          { type: 'p', text: 'Por seguridad, usamos temporalmente tu **dirección IP** para limitar los intentos de inicio de sesión y de verificación y así prevenir ataques. Esa información se mantiene solo en memoria por unos minutos y no se registra en nuestra base de datos.' },
        ],
      },
      {
        id: 'finalidades',
        title: 'Para qué usamos tus datos',
        blocks: [
          {
            type: 'list',
            items: [
              '**Gestionar tu reserva:** crearla, confirmarla, modificarla o cancelarla y asignarte una habitación.',
              '**Procesar pagos y reembolsos**, y emitir los comprobantes correspondientes.',
              '**Comunicarnos contigo:** códigos de verificación, confirmaciones de reserva, recuperación de contraseña y avisos sobre tu estadía.',
              '**Registrar tu ingreso** como huésped, tal como exige la normativa de establecimientos de hospedaje.',
              '**Atender reclamos y quejas** del Libro de Reclamaciones.',
              '**Proteger el servicio:** prevenir fraudes, accesos no autorizados y usos abusivos.',
              '**Cumplir obligaciones legales**, tributarias y requerimientos de autoridades competentes.',
            ],
          },
          { type: 'p', text: 'No usamos tus datos para elaborar perfiles comerciales ni para enviarte publicidad. Si en el futuro quisiéramos hacerlo, te pediremos antes tu consentimiento expreso y podrás retirarlo cuando quieras.' },
        ],
      },
      {
        id: 'base-legal',
        title: 'Base legal',
        blocks: [
          {
            type: 'list',
            items: [
              '**Relación contractual:** la mayoría de los datos son necesarios para prestarte el servicio de hospedaje que contratas.',
              '**Obligación legal:** registro de huéspedes, comprobantes de pago, conservación de reclamos.',
              '**Consentimiento:** el que otorgas al marcar la casilla de aceptación al registrarte, para las finalidades descritas en esta política.',
            ],
          },
          { type: 'p', text: 'Si no proporcionas los datos obligatorios no podremos completar tu reserva o tu registro como huésped.' },
        ],
      },
      {
        id: 'destinatarios',
        title: 'Con quién compartimos tus datos',
        blocks: [
          { type: 'p', text: 'No vendemos ni alquilamos tus datos. Solo los compartimos con proveedores que nos ayudan a operar el servicio, que actúan bajo nuestras instrucciones y con obligaciones de confidencialidad:' },
          {
            type: 'table',
            head: ['Proveedor', 'Para qué', 'Datos'],
            rows: [
              ['Mercado Pago', 'Procesar pagos y reembolsos', 'Correo, documento, monto y datos de la tarjeta (los recibe directamente)'],
              ['Servicio de correo electrónico', 'Enviar códigos y confirmaciones', 'Correo, nombre y datos de la reserva'],
              ['Infraestructura en la nube', 'Alojar el sitio web y la base de datos', 'Todos los datos descritos, cifrados en tránsito'],
            ],
          },
          { type: 'p', text: 'También podemos entregar datos a autoridades públicas cuando una ley o un mandato judicial lo exija.' },
        ],
      },
      {
        id: 'transferencia',
        title: 'Transferencia internacional',
        blocks: [
          { type: 'p', text: 'Algunos de nuestros proveedores tecnológicos alojan información en servidores ubicados fuera del Perú, principalmente en los Estados Unidos. Elegimos proveedores que ofrecen niveles de protección adecuados y, al aceptar esta política, consientes dicha transferencia con las finalidades aquí descritas.' },
        ],
      },
      {
        id: 'conservacion',
        title: 'Cuánto tiempo los conservamos',
        blocks: [
          {
            type: 'table',
            head: ['Datos', 'Plazo'],
            rows: [
              ['Cuenta', 'Mientras la mantengas activa'],
              ['Reservas, pagos y comprobantes', 'El plazo que exige la normativa tributaria y contable'],
              ['Reclamos y quejas', 'Al menos 2 años desde su presentación'],
              ['Códigos de verificación', 'Expiran a los 10 minutos'],
              ['IP para límite de intentos', 'Unos minutos, solo en memoria'],
            ],
          },
          { type: 'p', text: 'Vencidos esos plazos, eliminamos o anonimizamos los datos de forma segura.' },
        ],
      },
      {
        id: 'seguridad',
        title: 'Cómo protegemos tus datos',
        blocks: [
          {
            type: 'list',
            items: [
              'Conexiones cifradas (HTTPS) entre tu navegador y nuestros servidores.',
              'Contraseñas y códigos de verificación almacenados con cifrado de un solo sentido (BCrypt).',
              'Sesiones con tokens firmados que caducan y se invalidan al cambiar la contraseña.',
              'Acceso a los datos restringido por roles: cada empleado ve solo lo necesario para su función.',
              'Pagos tokenizados por Mercado Pago, certificado PCI DSS.',
              'Límites de intentos para frenar ataques de fuerza bruta.',
            ],
          },
          { type: 'p', text: 'Ningún sistema es infalible. Si detectáramos un incidente de seguridad que afecte tus datos, te lo comunicaremos y lo informaremos a la autoridad competente conforme a la ley.' },
        ],
      },
      {
        id: 'almacenamiento-local',
        title: 'Cookies y almacenamiento local',
        blocks: [
          { type: 'p', text: 'No usamos cookies de publicidad ni de analítica de terceros. Para que el sitio funcione guardamos en tu navegador:' },
          {
            type: 'table',
            head: ['Dato', 'Dónde', 'Para qué'],
            rows: [
              ['Token de sesión, rol y correo', 'Almacenamiento local', 'Mantener tu sesión iniciada'],
              ['Detalles de la reserva en curso', 'Almacenamiento de sesión', 'No perder tu selección durante el checkout; se borra al cerrar la pestaña'],
              ['Identificadores de seguridad de Mercado Pago', 'Cookies de Mercado Pago', 'Prevenir fraudes durante el pago'],
            ],
          },
          { type: 'p', text: 'Al cerrar sesión eliminamos los datos de sesión de tu navegador. También puedes borrarlos desde la configuración de tu navegador.' },
        ],
      },
      {
        id: 'derechos',
        title: 'Tus derechos',
        blocks: [
          { type: 'p', text: 'Como titular de tus datos puedes ejercer en cualquier momento tus derechos de:' },
          {
            type: 'list',
            items: [
              '**Acceso e información:** saber qué datos tuyos tenemos y cómo los usamos.',
              '**Rectificación:** corregir datos inexactos o incompletos. Muchos puedes actualizarlos tú mismo desde "Mi perfil".',
              '**Cancelación:** pedir que eliminemos tus datos cuando ya no sean necesarios, salvo los que debamos conservar por ley.',
              '**Oposición:** oponerte a un tratamiento concreto por motivos legítimos.',
              '**Revocación:** retirar el consentimiento otorgado, sin efecto retroactivo.',
            ],
          },
          {
            type: 'steps',
            items: [
              { title: 'Escríbenos', text: `Envía tu solicitud a ${H.email} indicando el derecho que quieres ejercer.` },
              { title: 'Identifícate', text: 'Adjunta una copia de tu documento de identidad para verificar que eres el titular.' },
              { title: 'Te respondemos', text: 'Atendemos tu solicitud dentro de los plazos que establece el Reglamento de la Ley N.° 29733.' },
            ],
          },
          { type: 'p', text: 'Si consideras que no atendimos tu solicitud correctamente, puedes presentar un reclamo ante la **Autoridad Nacional de Protección de Datos Personales** del Ministerio de Justicia y Derechos Humanos.' },
        ],
      },
      {
        id: 'menores',
        title: 'Menores de edad',
        blocks: [
          { type: 'p', text: 'Nuestro servicio de reservas en línea está dirigido a mayores de 18 años. Los datos de menores que se alojan con sus padres o tutores los registra el adulto responsable en recepción, únicamente para cumplir el registro obligatorio de huéspedes.' },
        ],
      },
      {
        id: 'cambios',
        title: 'Cambios a esta política',
        blocks: [
          { type: 'p', text: 'Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la nueva versión en esta página con su fecha de actualización y, si los cambios son relevantes, te avisaremos por correo.' },
        ],
      },
    ],
  };
}
