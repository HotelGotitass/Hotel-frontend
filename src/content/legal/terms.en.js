import { LEGAL_INFO as H, CLIENT_CANCELLATION_POLICY } from './info';

// English version of terms.js: same sections and rules; keep both files in sync.
export function buildTermsEn({ depositPercentage, paymentWindowMinutes }) {
  const hasPct = Number.isFinite(depositPercentage);
  const pct = hasPct ? depositPercentage : '…';
  const rest = hasPct ? 100 - depositPercentage : '…';
  const minutes = paymentWindowMinutes ?? '…';
  return {
    title: 'Terms & Conditions',
    intro: `The rules that govern your bookings at ${H.name}: how to book, how much and when to pay, how to change or cancel, and what to expect during your stay. We wrote them in plain language so you know exactly what you are agreeing to.`,
    highlights: [
      { value: `${pct}%`, label: 'Deposit', text: 'Secure your booking with the deposit; pay the balance later or on arrival.' },
      { value: `${minutes} min`, label: 'Room on hold', text: 'How long we hold the room while you complete the payment.' },
      { value: 'Once', label: 'Date change', text: 'You can change your dates once, up to 48 hours before check-in.' },
      { value: 'S/', label: 'Secure payment', text: 'Payments in Peruvian soles processed by Mercado Pago. We never store your card.' },
    ],
    sections: [
      {
        id: 'aceptacion',
        title: 'Acceptance and scope',
        blocks: [
          { type: 'p', text: `These Terms & Conditions govern the use of the **${H.name}** website and the booking of accommodation services through it. By creating an account, making a booking or ticking the acceptance box at checkout, you confirm that you have read and accepted them.` },
          { type: 'p', text: 'Bookings made by phone or directly at the front desk are governed by these same rules where applicable. If you do not agree with any condition, please do not use the online booking service.' },
          { type: 'p', text: 'How we handle your personal data is explained separately in our [Privacy Policy](/privacidad), which forms part of these terms.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Definitions',
        blocks: [
          {
            type: 'list',
            items: [
              `**Hotel:** ${H.name}${H.legalName ? ` (${H.legalName})` : ''}, the provider of the accommodation service.`,
              '**Client:** the adult who creates an account and makes the booking.',
              '**Guest:** each person staying at the hotel; may or may not be the client.',
              '**Booking:** a request for accommodation in a room category for specific dates, identified by a unique code.',
              '**Deposit:** a partial payment that confirms the booking.',
              '**Balance:** the difference between the total price of the stay and what has already been paid.',
              '**No-show:** when the guest does not arrive on the check-in date without having cancelled.',
            ],
          },
        ],
      },
      {
        id: 'cuenta',
        title: 'Your account',
        blocks: [
          { type: 'p', text: 'You need a personal account to book online. When you sign up we send a verification code to your email; the account becomes active once you confirm it.' },
          {
            type: 'list',
            items: [
              'You must be at least 18 years old and provide true, up-to-date information.',
              'You are responsible for keeping your password confidential and for all activity carried out from your account.',
              'Let us know immediately if you suspect unauthorised access.',
              'We may suspend accounts that provide false information, attempt fraud or abuse the system (for example, mass unpaid bookings to block availability).',
            ],
          },
        ],
      },
      {
        id: 'reservas',
        title: 'How a booking works',
        blocks: [
          {
            type: 'steps',
            items: [
              { title: 'You choose', text: 'You select the room category, the dates and the number of guests, which cannot exceed the maximum capacity of the category.' },
              { title: 'We hold it', text: `When you proceed to payment we create your booking as **pending** and hold the room for **${minutes} minutes**.` },
              { title: 'You pay', text: `You pay the **${pct}%** deposit or the full amount with Mercado Pago, without leaving our website.` },
              { title: 'We confirm', text: 'Once the payment is approved, the booking becomes **confirmed** and we email you your booking code.' },
            ],
          },
          { type: 'callout', tone: 'warn', title: 'If you do not pay in time', text: `If no payment is approved within ${minutes} minutes, the booking is cancelled automatically and the room is released to other guests. You can book again if it is still available.` },
          { type: 'p', text: 'You book a room **category**, not a specific room number. The actual room is assigned at the front desk at check-in, subject to availability.' },
        ],
      },
      {
        id: 'precios-pagos',
        title: 'Prices and payments',
        blocks: [
          { type: 'p', text: 'Prices are shown in **Peruvian soles (PEN)** and include applicable taxes. The total price is the nightly rate of the category multiplied by the number of nights, and it is fixed when the booking is created.' },
          {
            type: 'table',
            head: ['Option', 'You pay today', 'You pay later'],
            rows: [
              ['Deposit', `${pct}% of the total`, `The remaining ${rest}%, from "My bookings" or at the front desk`],
              ['Full payment', '100% of the total', 'Nothing (except consumptions and extra services)'],
            ],
          },
          {
            type: 'list',
            items: [
              '**Online payments:** processed by Mercado Pago with a credit or debit card, in a single instalment. Your card details go straight to Mercado Pago; we never see or store them.',
              '**Payments at the front desk:** you can pay the balance in cash, by card, bank transfer or Yape/Plin.',
              '**Instant approval:** online payments are approved or declined immediately. If your bank declines the payment, you can try another card while the booking is still on hold.',
              '**Receipt:** we issue a receipt for every stay, which you can download from "My bookings".',
            ],
          },
          { type: 'callout', tone: 'info', title: 'Payment approved after the booking expired', text: 'If, due to delays with the payment method, your payment is approved after the booking was cancelled for lack of payment and the room is no longer available, we refund **100%** of that payment.' },
        ],
      },
      {
        id: 'modificaciones',
        title: 'Date changes',
        blocks: [
          { type: 'p', text: 'You can change the dates of a pending or confirmed booking from "My bookings", under these conditions:' },
          {
            type: 'list',
            items: [
              'Only **once** per booking.',
              'Up to **48 hours before** 00:00 on the original check-in day.',
              'Subject to availability of the same category on the new dates.',
              'The total price is **recalculated** with the current rate and the new number of nights. If the new total is higher, you pay the difference; if it is lower, the credit is handled according to the refund policy.',
            ],
          },
          { type: 'p', text: 'For changes that do not meet these conditions (for example, a second change or a change of category), please contact the front desk; we will handle them subject to availability, with no obligation to accept them.' },
        ],
      },
      {
        id: 'cancelaciones',
        title: 'Cancellations and refunds',
        blocks: [
          { type: 'p', text: 'You can cancel your booking from "My bookings" at any time **before check-in**. Once you have checked in, cancellations must be handled at the front desk.' },
          { type: 'p', text: 'If you had already paid, cancelling automatically creates a **refund request**, which the front desk reviews using the following scale based on how far in advance you cancelled:' },
          { type: 'table', head: ['You cancel', 'We refund'], rows: CLIENT_CANCELLATION_POLICY.en.map((r) => [r.when, r.refund]) },
          { type: 'p', text: 'Regardless of notice, we refund **100%** of what you paid when:' },
          {
            type: 'list',
            items: [
              'The hotel cancels your booking for reasons attributable to us.',
              'You were charged twice.',
              'There was a technical failure in the payment or booking process.',
              'Your payment was approved after the booking expired and there was no longer availability.',
            ],
          },
          { type: 'callout', tone: 'info', title: 'Refund times', text: 'Approved refunds are returned through the original payment method. For card payments, timing depends on Mercado Pago and your bank, and usually shows on your statement within 2 to 30 business days. Payments made at the front desk are refunded at the front desk.' },
        ],
      },
      {
        id: 'no-show',
        title: 'No-show',
        blocks: [
          { type: 'p', text: 'If you do not arrive on the check-in date and did not cancel the booking, the system cancels it automatically in the early hours of the following day and the room is released.' },
          { type: 'p', text: 'A no-show is **not refunded**: amounts paid are kept as compensation for the room that was held. If you are going to arrive late, let us know by email or phone so we keep your booking.' },
        ],
      },
      {
        id: 'estadia',
        title: 'During your stay',
        blocks: [
          {
            type: 'table',
            head: ['', 'Time'],
            rows: [
              ['Check-in', `From ${H.checkInTime}`],
              ['Check-out', `Until ${H.checkOutTime}`],
            ],
          },
          {
            type: 'list',
            items: [
              '**Identification:** every guest must present a valid ID document (Peruvian DNI, foreigner ID card or passport) at registration.',
              '**Minors:** must stay with their parents or an authorised adult, and bring their ID document.',
              '**Capacity:** hosting more people than those registered in the booking or exceeding the room capacity is not allowed.',
              '**Early check-in or late check-out:** subject to availability and, where applicable, to an additional charge informed at the front desk.',
              '**Consumptions and extra services:** are added to your bill and paid, together with any outstanding balance, before check-out.',
              '**House rules:** please respect other guests\' rest and the house rules displayed at the front desk.',
              '**Damage:** the client is liable for damage to the room or furniture caused by them or their companions, beyond normal wear and tear.',
            ],
          },
        ],
      },
      {
        id: 'responsabilidad',
        title: 'Liability',
        blocks: [
          { type: 'p', text: 'We undertake to provide the contracted service under the conditions offered. We are not liable for the loss of money, jewellery or valuables that were not handed over to the front desk for safekeeping.' },
          { type: 'p', text: 'Nor are we liable for failures caused by unforeseeable circumstances or force majeure (natural disasters, orders from the authorities, general utility outages). In such cases we will offer to reschedule the booking or, if that is not possible, refund what you paid for the nights not provided.' },
          { type: 'p', text: 'Room photos and descriptions are for reference only. There may be minor differences in decoration or layout between rooms of the same category.' },
        ],
      },
      {
        id: 'reclamos',
        title: 'Complaints Book',
        blocks: [
          { type: 'p', text: 'In accordance with the Peruvian Consumer Protection and Defence Code (Law No. 29571), we provide a [virtual Complaints Book](/libro-reclamaciones) (Libro de Reclamaciones), in addition to the physical one at the front desk.' },
          {
            type: 'list',
            items: [
              '**Claim (reclamo):** dissatisfaction related to the service provided.',
              '**Complaint (queja):** discontent not related to the service itself (for example, the treatment received).',
            ],
          },
          { type: 'p', text: 'We answer your claim or complaint within a maximum of **15 business days**. Filing a claim does not prevent you from using other dispute resolution channels, nor is it a prerequisite for filing a complaint with INDECOPI.' },
        ],
      },
      {
        id: 'propiedad',
        title: 'Intellectual property',
        blocks: [
          { type: 'p', text: `The ${H.name} brand, logo, photographs, texts and website design belong to us or are used with permission. You may not copy, modify or use them for commercial purposes without our written consent.` },
        ],
      },
      {
        id: 'cambios',
        title: 'Changes to these terms',
        blocks: [
          { type: 'p', text: 'We may update these terms to reflect legal or operational changes. We will publish the new version on this page with its update date. Bookings already confirmed are governed by the terms in force at the time of booking.' },
        ],
      },
      {
        id: 'ley',
        title: 'Governing law',
        blocks: [
          { type: 'p', text: 'These terms are governed by the laws of the Republic of Peru. Any dispute will preferably be resolved through direct negotiation or the Complaints Book; failing an agreement, before the competent administrative authorities and courts of Peru.' },
          { type: 'p', text: 'This English version is provided for convenience. In case of discrepancy, the Spanish version prevails.' },
        ],
      },
    ],
  };
}
