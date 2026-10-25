# Hotel Gotitas · Frontend

Sitio web y panel de gestión de **Hotel Gotitas** (una sola sede): reservas en línea con pago por Mercado Pago,
área de cliente y panel para administración y recepción.

> Backend: [HotelGotitass/Hotel](https://github.com/HotelGotitass/Hotel)

## Stack

- React 18 · Vite 5 · React Router 7
- Tailwind CSS 3 (diseño editorial: espresso/marfil con acento rosa, Cormorant Garamond + Inter)
- i18next (español / inglés)
- lucide-react (íconos)

## Funcionalidades

**Sitio público**
- Landing con buscador de disponibilidad, habitaciones destacadas y reglas de reserva
- Búsqueda por fechas y huéspedes con comodidades de cada habitación; la búsqueda vive en la URL
- Checkout: anticipo (50 %) o pago total con **Mercado Pago**, página de resultado que confirma con el backend

**Área de cliente**
- Mis reservas (ticket con código de reserva), cuenta regresiva para pagar, pago de saldo, modificación de fechas,
  cancelación y descarga del comprobante

**Panel (admin / recepción)**
- Recepción: búsqueda por código y cobro (efectivo, tarjeta, transferencia, Yape/Plin)
- **Caja**: el recepcionista debe abrir caja al iniciar sesión y no puede cerrar sesión sin cerrarla (arqueo);
  si cierra la pestaña, al volver encuentra su caja abierta
- Facturación electrónica **simulada** (boleta/factura, anulación con nota de crédito, PDF)
- Reembolsos, reservas, huéspedes, habitaciones, categorías y comodidades (selector de íconos), servicios extra,
  reclamaciones, dashboard
- Personal: alta, cambio de contraseña, **deshabilitar cuentas** (cierra la sesión del usuario al instante)
- Mi cuenta: cambio de la propia contraseña

## Variables de entorno

No hay credenciales en el frontend: solo la URL pública del backend. Copia `.env.example` a `.env`
(los `.env` están en `.gitignore`).

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL de la API, p. ej. `http://localhost:8080/api/v1` |
| `VITE_DEPOSIT_PERCENTAGE` | Porcentaje de anticipo mostrado en el checkout (por defecto `50`; debe coincidir con el backend) |

## Ejecutar en local

Requisitos: **Node.js 18+** y el backend en ejecución.

```bash
npm install
cp .env.example .env      # ajusta VITE_API_BASE_URL si hace falta
npm run dev               # http://localhost:5173
```

```bash
npm run build             # build de producción en dist/
npm run preview           # sirve el build localmente
```

## Estructura

```
src/
  components/        Navbar, Hero, buscador (BookingBar), habitaciones, footer
  components/admin/  CashGate (apertura de caja), PaymentModal
  pages/             Landing y Habitaciones
  pages/auth/        Login, registro, verificación OTP, recuperación de contraseña
  pages/client/      Checkout, resultado de pago, mis reservas, perfil
  pages/admin/       Panel de administración y recepción
  context/           AuthContext (sesión, latido y bloqueo de salida con caja abierta)
  utils/             apiClient, pagos, descargas de PDF, íconos de comodidades
  i18n.js            Traducciones ES / EN
```

## Despliegue

Desplegado en **Vercel** desde la rama `main`. `vercel.json` redirige todas las rutas a `index.html` (SPA).
Configura `VITE_API_BASE_URL` en las variables de entorno del proyecto en Vercel.
