<div align="center">

<h1>Hotel Gotitas · Web</h1>

<p><b>Sitio público, área de cliente y panel de gestión</b><br>
reserva en línea · pago con Mercado Pago · recepción y caja</p>

<img src="https://img.shields.io/badge/React-18-2E211B?style=flat-square&logo=react&logoColor=white" alt="React 18"> <img src="https://img.shields.io/badge/Vite-5-2E211B?style=flat-square&logo=vite&logoColor=white" alt="Vite 5"> <img src="https://img.shields.io/badge/Tailwind-3-2E211B?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 3"> <img src="https://img.shields.io/badge/i18n-ES_·_EN-9C7A63?style=flat-square" alt="i18n ES · EN"> <img src="https://img.shields.io/badge/Mercado_Pago-Checkout_Pro-ECA8D6?style=flat-square" alt="Mercado Pago Checkout Pro"> <img src="https://img.shields.io/badge/deploy-Vercel-9C7A63?style=flat-square&logo=vercel&logoColor=white" alt="deploy Vercel">

<p>
<a href="#arquitectura">Arquitectura</a> ·
<a href="#flujos">Flujos</a> ·
<a href="#inicio-rápido">Inicio rápido</a> ·
<a href="#rutas">Rutas</a> ·
<a href="https://github.com/HotelGotitass/Hotel">Backend ↗</a>
</p>

</div>

---

## En un vistazo

<table>
<tr>
<td width="33%" valign="top"><b>Sitio público</b><br><sub>Buscador tipo ticket, disponibilidad con comodidades y checkout con anticipo (50 %) o pago total por Mercado Pago.</sub></td>
<td width="33%" valign="top"><b>Área de cliente</b><br><sub>Mis reservas con código, cuenta regresiva para pagar, saldo, cambio de fechas, cancelación y comprobante PDF.</sub></td>
<td width="33%" valign="top"><b>Panel de gestión</b><br><sub>Recepción y cobros, caja obligatoria, facturación simulada, reembolsos, catálogo y personal.</sub></td>
</tr>
</table>

**Diseño** · editorial, espresso y marfil con acento rosa `#ECA8D6`; *Cormorant Garamond* para titulares e *Inter*
para texto. El motivo de **ticket** (bordes perforados, código de reserva) une buscador, checkout y mis reservas.

## Arquitectura

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#F7F1E8","primaryTextColor":"#2E211B","primaryBorderColor":"#2E211B","lineColor":"#9C7A63","secondaryColor":"#ECA8D6","tertiaryColor":"#FBF8F3","edgeLabelBackground":"#F7F1E8","noteBkgColor":"#ECA8D6","noteTextColor":"#2E211B","noteBorderColor":"#2E211B","actorBkg":"#2E211B","actorTextColor":"#F7F1E8","actorBorder":"#2E211B","actorLineColor":"#9C7A63","signalColor":"#9C7A63","signalTextColor":"#9C7A63","labelBoxBkgColor":"#ECA8D6","labelTextColor":"#2E211B","loopTextColor":"#9C7A63","attributeBackgroundColorOdd":"#FBF8F3","attributeBackgroundColorEven":"#F7F1E8"}}}%%
flowchart LR
    B["Navegador"]:::ext --> R["React Router<br/>público · cliente · panel"]
    subgraph SPA["React SPA · Vercel"]
        R --> AC["AuthContext<br/>sesión · latido 30 s · caja abierta"]:::accent
        R --> I18N["i18n<br/>ES / EN"]
        AC --> API["apiClient<br/>Bearer JWT · manejo de 401"]:::dark
    end
    API -->|"REST /api/v1"| BE["Backend<br/>Spring Boot"]:::ext
    R -.->|"Checkout Pro"| MP["Mercado Pago"]:::ext
    classDef dark fill:#2E211B,stroke:#2E211B,color:#F7F1E8
    classDef accent fill:#ECA8D6,stroke:#2E211B,color:#2E211B
    classDef ext fill:#FBF8F3,stroke:#9C7A63,color:#2E211B,stroke-dasharray:4 3
```

## Flujos

### Reserva y pago del cliente

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#F7F1E8","primaryTextColor":"#2E211B","primaryBorderColor":"#2E211B","lineColor":"#9C7A63","secondaryColor":"#ECA8D6","tertiaryColor":"#FBF8F3","edgeLabelBackground":"#F7F1E8","noteBkgColor":"#ECA8D6","noteTextColor":"#2E211B","noteBorderColor":"#2E211B","actorBkg":"#2E211B","actorTextColor":"#F7F1E8","actorBorder":"#2E211B","actorLineColor":"#9C7A63","signalColor":"#9C7A63","signalTextColor":"#9C7A63","labelBoxBkgColor":"#ECA8D6","labelTextColor":"#2E211B","loopTextColor":"#9C7A63","attributeBackgroundColorOdd":"#FBF8F3","attributeBackgroundColorEven":"#F7F1E8"}}}%%
flowchart TB
    L["/<br/>buscador"] --> H["/habitaciones<br/>disponibilidad"]
    H -->|"Reservar"| AUTH{"¿Sesión?"}
    AUTH -->|"no"| LOGIN["/login"]:::ext
    LOGIN --> CK
    AUTH -->|"sí"| CK["/checkout<br/>anticipo o total"]:::accent
    CK --> MP["Mercado Pago"]:::dark
    MP --> PR["/payment/result<br/>verifica con la API"]
    PR --> MR["/client/reservations<br/>ticket con código"]:::accent
    classDef dark fill:#2E211B,stroke:#2E211B,color:#F7F1E8
    classDef accent fill:#ECA8D6,stroke:#2E211B,color:#2E211B
    classDef ext fill:#FBF8F3,stroke:#9C7A63,color:#2E211B,stroke-dasharray:4 3
```

### Panel del recepcionista

La caja manda: sin caja abierta no hay panel, y con caja abierta no hay cierre de sesión.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#F7F1E8","primaryTextColor":"#2E211B","primaryBorderColor":"#2E211B","lineColor":"#9C7A63","secondaryColor":"#ECA8D6","tertiaryColor":"#FBF8F3","edgeLabelBackground":"#F7F1E8","noteBkgColor":"#ECA8D6","noteTextColor":"#2E211B","noteBorderColor":"#2E211B","actorBkg":"#2E211B","actorTextColor":"#F7F1E8","actorBorder":"#2E211B","actorLineColor":"#9C7A63","signalColor":"#9C7A63","signalTextColor":"#9C7A63","labelBoxBkgColor":"#ECA8D6","labelTextColor":"#2E211B","loopTextColor":"#9C7A63","attributeBackgroundColorOdd":"#FBF8F3","attributeBackgroundColorEven":"#F7F1E8"}}}%%
stateDiagram-v2
    direction LR
    [*] --> AbrirCaja: sin caja
    [*] --> Panel: su caja sigue abierta
    [*] --> Bloqueado: caja de otra persona
    AbrirCaja --> Panel: fondo inicial
    Panel --> CerrarCaja: quiere salir
    CerrarCaja --> [*]: arqueo y logout
    Bloqueado --> [*]: logout
```

<details>
<summary><b>Sesión y expulsión inmediata</b></summary>

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#F7F1E8","primaryTextColor":"#2E211B","primaryBorderColor":"#2E211B","lineColor":"#9C7A63","secondaryColor":"#ECA8D6","tertiaryColor":"#FBF8F3","edgeLabelBackground":"#F7F1E8","noteBkgColor":"#ECA8D6","noteTextColor":"#2E211B","noteBorderColor":"#2E211B","actorBkg":"#2E211B","actorTextColor":"#F7F1E8","actorBorder":"#2E211B","actorLineColor":"#9C7A63","signalColor":"#9C7A63","signalTextColor":"#9C7A63","labelBoxBkgColor":"#ECA8D6","labelTextColor":"#2E211B","loopTextColor":"#9C7A63","attributeBackgroundColorOdd":"#FBF8F3","attributeBackgroundColorEven":"#F7F1E8"}}}%%
sequenceDiagram
    participant UI as Pantalla
    participant AC as AuthContext
    participant BE as Backend
    loop cada 30 s y al volver a la pestaña
        AC->>BE: GET /auth/session
        BE-->>AC: 204 activa · 401 deshabilitada
    end
    AC->>UI: Si 401: limpia la sesión y va a /login con el motivo
```

</details>

## Inicio rápido

| Requisito | Versión |
|:--|:--|
| Node.js | 18 o superior |
| Backend | en ejecución ([instrucciones](https://github.com/HotelGotitass/Hotel#inicio-rápido)) |

```bash
npm install
cp .env.example .env      # ajusta VITE_API_BASE_URL si hace falta
npm run dev               # http://localhost:5173
```

## Configuración

El frontend **no contiene credenciales**: solo la URL pública del backend.
Plantilla: [`.env.example`](.env.example). Los `.env` reales están en `.gitignore`.

<!-- AUTO-GENERATED: variables de entorno (fuente: .env.example) - no editar a mano -->
| Variable | Descripción | Ejemplo |
|:--|:--|:--|
| `VITE_API_BASE_URL` | URL de la API | `http://localhost:8080/api/v1` |
<!-- /AUTO-GENERATED -->

## Scripts

<!-- AUTO-GENERATED: scripts (fuente: package.json) - no editar a mano -->
| Comando | Qué hace |
|:--|:--|
| `npm run dev` | Servidor de desarrollo · http://localhost:5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Sirve el build localmente |
<!-- /AUTO-GENERATED -->

## Rutas

28 pantallas, protegidas por rol en el cliente y validadas de nuevo en el backend.

<!-- AUTO-GENERATED: rutas (fuente: src/App.jsx) - no editar a mano -->
<details>
<summary><b>Sitio público <sub>· 10 rutas</sub></b></summary>

| Ruta | Pantalla | Acceso |
|:--|:--|:--|
| `/` | Inicio · buscador y habitaciones destacadas | Público |
| `/habitaciones` | Disponibilidad por fechas y huéspedes | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de cliente | Público |
| `/verify-otp` | Verificación OTP | Público |
| `/forgot-password` | Recuperar contraseña | Público |
| `/reset-password` | Nueva contraseña | Público |
| `/terminos` | Términos | Público |
| `/privacidad` | Privacidad | Público |
| `/libro-reclamaciones` | Libro de reclamaciones | Público |

</details>

<details>
<summary><b>Área de cliente <sub>· 4 rutas</sub></b></summary>

| Ruta | Pantalla | Acceso |
|:--|:--|:--|
| `/checkout` | Confirmación y pago | CLIENT |
| `/client/reservations` | Mis reservas | CLIENT |
| `/client/profile` | Mis datos | CLIENT |
| `/payment/result` | Retorno de Mercado Pago | CLIENT |

</details>

<details>
<summary><b>Panel de gestión <sub>· 14 rutas</sub></b></summary>

| Ruta | Pantalla | Acceso |
|:--|:--|:--|
| `/admin/dashboard` | Indicadores | ADMIN · RECEP. |
| `/admin/recepcion` | Búsqueda por código y cobros | ADMIN · RECEP. |
| `/admin/reembolsos` | Reembolsos | ADMIN · RECEP. |
| `/admin/habitaciones` | Habitaciones | ADMIN |
| `/admin/categorias` | Categorías | ADMIN |
| `/admin/huespedes` | Huéspedes | ADMIN · RECEP. |
| `/admin/reservas` | Reservas y check-in/out | ADMIN · RECEP. |
| `/admin/servicios` | Servicios extra | ADMIN · RECEP. |
| `/admin/facturas` | Facturación simulada | ADMIN · RECEP. |
| `/admin/personal` | Personal y cuentas | ADMIN |
| `/admin/comodidades` | Comodidades | ADMIN |
| `/admin/reclamaciones` | Reclamaciones | ADMIN · RECEP. |
| `/admin/caja` | Caja e historial | ADMIN · RECEP. |
| `/admin/cuenta` | Mi cuenta | ADMIN · RECEP. |

</details>
<!-- /AUTO-GENERATED -->

## Estructura

```text
src/
├── components/         Navbar, Hero, BookingBar, habitaciones, footer
│   └── admin/          CashGate (apertura de caja), PaymentModal
├── pages/              Landing y Habitaciones
│   ├── auth/           Login, registro, OTP, recuperación
│   ├── client/         Checkout, resultado de pago, mis reservas, perfil
│   └── admin/          Panel de administración y recepción
├── context/            AuthContext · sesión, latido, bloqueo de salida
├── utils/              apiClient, pagos, PDFs, íconos de comodidades
└── i18n.js             Traducciones ES / EN
```

## Despliegue

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#F7F1E8","primaryTextColor":"#2E211B","primaryBorderColor":"#2E211B","lineColor":"#9C7A63","secondaryColor":"#ECA8D6","tertiaryColor":"#FBF8F3","edgeLabelBackground":"#F7F1E8","noteBkgColor":"#ECA8D6","noteTextColor":"#2E211B","noteBorderColor":"#2E211B","actorBkg":"#2E211B","actorTextColor":"#F7F1E8","actorBorder":"#2E211B","actorLineColor":"#9C7A63","signalColor":"#9C7A63","signalTextColor":"#9C7A63","labelBoxBkgColor":"#ECA8D6","labelTextColor":"#2E211B","loopTextColor":"#9C7A63","attributeBackgroundColorOdd":"#FBF8F3","attributeBackgroundColorEven":"#F7F1E8"}}}%%
flowchart LR
    P(["push a main"]):::ext --> V["Vercel<br/>npm run build"]:::dark
    V --> D["dist/"]
    D --> RW["vercel.json<br/>toda ruta → index.html"]:::accent
    classDef dark fill:#2E211B,stroke:#2E211B,color:#F7F1E8
    classDef accent fill:#ECA8D6,stroke:#2E211B,color:#2E211B
    classDef ext fill:#FBF8F3,stroke:#9C7A63,color:#2E211B,stroke-dasharray:4 3
```

Configura `VITE_API_BASE_URL` en las variables del proyecto en Vercel.
