import { LEGAL_INFO as H } from './info';

// English version of privacy.js: same sections and facts; keep both files in sync.
export function buildPrivacyEn() {
  const owner = [H.legalName || H.name, H.ruc && `RUC ${H.ruc}`, H.address].filter(Boolean).join(', ');

  return {
    title: 'Privacy Policy',
    intro: `What personal data ${H.name} collects, what we use it for, who we share it with and how you can control it. We process your data in accordance with Peruvian Law No. 29733, the Personal Data Protection Law, and its Regulations.`,
    highlights: [
      { value: '0', label: 'Cards stored', text: 'Mercado Pago processes your payment details; they never reach our servers.' },
      { value: 'No', label: 'Advertising', text: 'We do not sell your data or send you advertising without your consent.' },
      { value: 'BCrypt', label: 'Encrypted passwords', text: 'Your password is stored encrypted; no one at the hotel can read it.' },
      { value: 'ARCO', label: 'Your rights', text: 'Access, rectify, cancel or object to your data by writing to us.' },
    ],
    sections: [
      {
        id: 'responsable',
        title: 'Data controller',
        blocks: [
          { type: 'p', text: `The controller of your personal data is **${owner}**. For any privacy question you can write to [${H.email}](mailto:${H.email}).` },
          { type: 'p', text: 'This policy applies to the data we collect through our website, the virtual Complaints Book and at the front desk when registering your stay.' },
        ],
      },
      {
        id: 'datos',
        title: 'Data we collect',
        blocks: [
          { type: 'p', text: 'We only collect the data needed to manage your booking and your stay:' },
          {
            type: 'table',
            head: ['Category', 'Data', 'When'],
            rows: [
              ['Account', 'Email address and password (encrypted)', 'When you sign up'],
              ['Identification', 'First and last names, ID type and number, phone and address', 'When you sign up or at check-in'],
              ['Booking', 'Dates, number of guests, category, booking code, changes and cancellations', 'When you book'],
              ['Payments', 'Amount, status, date and transaction ID in Mercado Pago', 'When you pay'],
              ['Stay', 'Assigned room, consumptions and extra services', 'During your stay'],
              ['Complaints', 'Name, ID, email, phone and details of the claim or complaint', 'When you use the Complaints Book'],
            ],
          },
          { type: 'callout', tone: 'info', title: 'What we do NOT store', text: 'We do not store your card number, expiry date or security code. Mercado Pago turns them into a single-use code directly from your browser.' },
          { type: 'p', text: 'For security, we temporarily use your **IP address** to limit login and verification attempts and prevent attacks. This information is kept in memory for only a few minutes and is not recorded in our database.' },
        ],
      },
      {
        id: 'finalidades',
        title: 'What we use your data for',
        blocks: [
          {
            type: 'list',
            items: [
              '**Managing your booking:** creating, confirming, changing or cancelling it and assigning you a room.',
              '**Processing payments and refunds**, and issuing the corresponding receipts.',
              '**Communicating with you:** verification codes, booking confirmations, password recovery and notices about your stay.',
              '**Registering your check-in** as a guest, as required by the regulations for lodging establishments.',
              '**Handling claims and complaints** from the Complaints Book.',
              '**Protecting the service:** preventing fraud, unauthorised access and abuse.',
              '**Complying with legal obligations**, tax obligations and requests from competent authorities.',
            ],
          },
          { type: 'p', text: 'We do not use your data to build commercial profiles or to send you advertising. If we ever wanted to, we would first ask for your express consent, which you could withdraw at any time.' },
        ],
      },
      {
        id: 'base-legal',
        title: 'Legal basis',
        blocks: [
          {
            type: 'list',
            items: [
              '**Contract:** most of the data is necessary to provide the accommodation service you book.',
              '**Legal obligation:** guest registration, payment receipts, keeping complaint records.',
              '**Consent:** given when you tick the acceptance box on sign-up, for the purposes described in this policy.',
            ],
          },
          { type: 'p', text: 'If you do not provide the mandatory data we will not be able to complete your booking or your registration as a guest.' },
        ],
      },
      {
        id: 'destinatarios',
        title: 'Who we share your data with',
        blocks: [
          { type: 'p', text: 'We do not sell or rent your data. We only share it with providers that help us run the service, who act on our instructions and are bound by confidentiality:' },
          {
            type: 'table',
            head: ['Provider', 'Purpose', 'Data'],
            rows: [
              ['Mercado Pago', 'Processing payments and refunds', 'Email, ID, amount and card details (received directly)'],
              ['Email service', 'Sending codes and confirmations', 'Email, name and booking details'],
              ['Cloud infrastructure', 'Hosting the website and database', 'All the data described, encrypted in transit'],
            ],
          },
          { type: 'p', text: 'We may also disclose data to public authorities when required by law or a court order.' },
        ],
      },
      {
        id: 'transferencia',
        title: 'International transfer',
        blocks: [
          { type: 'p', text: 'Some of our technology providers host information on servers located outside Peru, mainly in the United States. We choose providers that offer adequate levels of protection and, by accepting this policy, you consent to that transfer for the purposes described here.' },
        ],
      },
      {
        id: 'conservacion',
        title: 'How long we keep it',
        blocks: [
          {
            type: 'table',
            head: ['Data', 'Period'],
            rows: [
              ['Account', 'For as long as you keep it active'],
              ['Bookings, payments and receipts', 'The period required by tax and accounting regulations'],
              ['Claims and complaints', 'At least 2 years from submission'],
              ['Verification codes', 'Expire after 10 minutes'],
              ['IP for attempt limits', 'A few minutes, in memory only'],
            ],
          },
          { type: 'p', text: 'Once those periods end, we securely delete or anonymise the data.' },
        ],
      },
      {
        id: 'seguridad',
        title: 'How we protect your data',
        blocks: [
          {
            type: 'list',
            items: [
              'Encrypted connections (HTTPS) between your browser and our servers.',
              'Passwords and verification codes stored with one-way encryption (BCrypt).',
              'Sessions use signed tokens that expire and are invalidated when you change your password.',
              'Role-based access: each employee only sees what their job requires.',
              'Payments tokenised by Mercado Pago, which is PCI DSS certified.',
              'Attempt limits to stop brute-force attacks.',
            ],
          },
          { type: 'p', text: 'No system is infallible. If we detected a security incident affecting your data, we would notify you and report it to the competent authority as required by law.' },
        ],
      },
      {
        id: 'almacenamiento-local',
        title: 'Cookies and local storage',
        blocks: [
          { type: 'p', text: 'We do not use third-party advertising or analytics cookies. To make the site work we store in your browser:' },
          {
            type: 'table',
            head: ['Data', 'Where', 'Purpose'],
            rows: [
              ['Session token, role and email', 'Local storage', 'Keeping you signed in'],
              ['Details of the booking in progress', 'Session storage', 'Keeping your selection during checkout; deleted when you close the tab'],
              ['Mercado Pago security identifiers', 'Mercado Pago cookies', 'Preventing fraud during payment'],
            ],
          },
          { type: 'p', text: 'When you sign out we delete the session data from your browser. You can also clear it from your browser settings.' },
        ],
      },
      {
        id: 'derechos',
        title: 'Your rights',
        blocks: [
          { type: 'p', text: 'As the owner of your data you can exercise at any time your rights of:' },
          {
            type: 'list',
            items: [
              '**Access and information:** knowing what data we hold about you and how we use it.',
              '**Rectification:** correcting inaccurate or incomplete data. You can update much of it yourself from "My profile".',
              '**Cancellation:** asking us to delete your data when it is no longer needed, except what we must keep by law.',
              '**Objection:** objecting to a specific processing on legitimate grounds.',
              '**Withdrawal:** withdrawing the consent you gave, without retroactive effect.',
            ],
          },
          {
            type: 'steps',
            items: [
              { title: 'Write to us', text: `Send your request to ${H.email} stating the right you want to exercise.` },
              { title: 'Identify yourself', text: 'Attach a copy of your ID document so we can verify you are the data owner.' },
              { title: 'We reply', text: 'We handle your request within the time limits set by the Regulations of Law No. 29733.' },
            ],
          },
          { type: 'p', text: 'If you believe we did not handle your request properly, you can file a complaint with the **National Personal Data Protection Authority** of the Peruvian Ministry of Justice and Human Rights.' },
        ],
      },
      {
        id: 'menores',
        title: 'Minors',
        blocks: [
          { type: 'p', text: 'Our online booking service is intended for people aged 18 or over. Data of minors staying with their parents or guardians is registered by the responsible adult at the front desk, solely to comply with mandatory guest registration.' },
        ],
      },
      {
        id: 'cambios',
        title: 'Changes to this policy',
        blocks: [
          { type: 'p', text: 'We may update this policy to reflect legal changes or changes to our services. We will publish the new version on this page with its update date and, if the changes are significant, we will let you know by email.' },
          { type: 'p', text: 'This English version is provided for convenience. In case of discrepancy, the Spanish version prevails.' },
        ],
      },
    ],
  };
}
