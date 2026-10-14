import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      // Hero
      "hero": {
        "welcome": "Bienvenidos al",
        "hotel": "Hotel Gotitas.",
        "desc": "Desconecta del mundo. Relájate en habitaciones exclusivas con vistas panorámicas y disfruta de una atención de lujo 24/7.",
        "explore": "Explorar Habitaciones",
        "rating": "Calificación",
        "service": "Servicio",
        "satisfaction": "Satisfacción"
      },

      // Features
      "features": {
        "f_label": "Capacidades",
        "f_title1": "Servicios",
        "f_title2": "de primera clase.",
        "f_subtitle": "Descubre por qué nuestros huéspedes siempre regresan. Cada rincón está diseñado para tu confort absoluto.",
        "f_01_t": "Conexión Total",
        "f_01_d": "Wi-Fi de ultra alta velocidad en todas las instalaciones sin costo adicional.",
        "f_02_t": "Gastronomía Exquisita",
        "f_02_d": "Desayuno buffet y restaurantes gourmet con opciones locales e internacionales.",
        "f_03_t": "Clima Perfecto",
        "f_03_d": "Sistemas de climatización inteligentes ajustables desde tu smartphone.",
        "f_04_t": "Entretenimiento",
        "f_04_d": "Pantallas OLED 4K con acceso a tus plataformas de streaming favoritas."
      },

      // Navbar
      "nav": {
        "home": "Inicio",
        "rooms": "Habitaciones",
        "experience": "Experiencia",
        "services": "Servicios",
        "book": "Reservar",
        "my_reservations": "Mis Reservas",
        "admin_panel": "Panel Admin",
        "login": "Iniciar Sesión",
        "logout": "Salir"
      },

      // Footer
      "footer": {
        "terms": "Términos y Condiciones",
        "contact": "Contacto",
        "desc": "Una experiencia inolvidable en el corazón de la ciudad.",
        "rights": "Todos los derechos reservados.",
        "privacy": "Política de Privacidad",
        "complaints": "Libro de Reclamaciones"
      },

      // Public Rooms
      "publicRooms": {
        "searcher": "Buscador",
        "checkin": "Check-in",
        "checkout": "Check-out",
        "guests": "Huéspedes",
        "search": "Buscar Disponibilidad",
        "loading": "Cargando...",
        "available": "Habitaciones Disponibles",
        "select_dates": "Ingresa tus fechas y la cantidad de personas para buscar disponibilidad.",
        "no_rooms": "No hay habitaciones disponibles para estas fechas y cantidad de personas.",
        "book": "Reservar",
        "night": "noche",
        "per_night": "/noche",
        "max_persons": "Máx {{count}} pers."
      },

      // Auth
      "auth": {
        "login": "Iniciar Sesión",
        "email": "Correo Electrónico",
        "password": "Contraseña",
        "verify_now": "Verificar cuenta ahora",
        "no_account": "¿Eres cliente y no tienes cuenta? Regístrate",
        "register": "Crear Cuenta",
        "first_name": "Nombres",
        "last_name": "Apellidos",
        "doc_type": "Tipo Doc.",
        "doc_number": "Número de Documento",
        "name": "Nombre Completo",
        "phone": "Teléfono",
        "document": "Documento",
        "btn_register": "Registrarse",
        "btn_login": "Ingresar",
        "have_account": "¿Ya tienes cuenta? Inicia sesión aquí.",
        "verify": "Verificar Cuenta",
        "enter_code": "Ingresa el código que enviamos a",
        "code": "Código",
        "btn_verify": "Verificar",
        "resend": "Reenviar código",
        "registering": "Registrando...",
        "error_generic": "Error al registrarse"
      },

      // Client
      "client": {
        "checkout_title": "Confirmar Reserva",
        "summary": "Resumen de Reserva",
        "room": "Habitación",
        "price_per_night": "Precio por noche",
        "nights": "Noches",
        "total": "Total a Pagar",
        "accept_terms": "Acepto los",
        "confirm": "Ir a Pagar",
        "processing": "Procesando...",
        "my_reservations": "Mis Reservas",
        "history": "Historial de tus estancias",
        "amount": "Monto",
        "status": "Estado",
        "modify": "Modificar Fechas",
        "cancel": "Cancelar Reserva",
        "invoice": "Factura",
        "btn_cancel": "Cancelar",
        "btn_save": "Guardar Cambios",
        "new_checkin": "Nuevo Check-in",
        "new_checkout": "Nuevo Check-out",
        "deposit": "Anticipo",
        "pay_deposit": "Aprobar Adelanto",
        "pay_full": "Aprobar Total",
        "pay_now": "Pagar Ahora",
        "booking_code": "Código de Reserva",
        "category": "Categoría",
        "dates": "Fechas",
        "no_reservations": "No tienes reservas actualmente.",
        "cancelled_by": "Cancelada por",
        "modify_info": "Solo se permite una (1) modificación por reserva, hasta 48h antes del Check-In original. Sujeto a disponibilidad de la categoría. El precio total se recalculará.",
        "redirect_payment": "Al confirmar, será redirigido a la pasarela de pago simulada.",
        "account_summary": "Resumen de Cuenta",
        "loading": "Cargando reservas..."
      },

      // Payment Gateway
      "payment": {
        "title": "MockPay Gateway",
        "booking": "Reserva",
        "approve_deposit": "Aprobar Adelanto",
        "approve_full": "Aprobar Total",
        "simulate_reject": "Simular Rechazo",
        "processing": "Procesando...",
        "success_title": "¡Pago Aprobado!",
        "success_desc": "Tu reserva ha sido confirmada con éxito.",
        "success_redirect": "Redirigiendo a tus reservas...",
        "error_title": "Pago Rechazado",
        "error_desc": "Hubo un problema procesando tu tarjeta o elegiste simular un rechazo.",
        "error_redirect": "Serás redirigido al inicio...",
        "disclaimer": "Este entorno es una simulación. No se realizan cargos reales a ninguna tarjeta. Al pulsar \"Aprobar\", se enviará un Webhook POST firmado al backend."
      },

      // Status labels
      "status": {
        "pending": "Pendiente",
        "confirmed": "Confirmada",
        "checked_in": "En Curso",
        "checked_out": "Finalizada",
        "cancelled": "Cancelada",
        "available": "Disponible",
        "occupied": "Ocupada",
        "cleaning": "Limpieza",
        "maintenance": "Mantenimiento",
        "paid": "Pagado",
        "void": "Anulado",
        "requested": "Solicitado",
        "processed": "Procesado",
        "active": "Activo",
        "inactive": "Inactivo"
      },

      // Admin Panel
      "admin": {
        "panel": "Panel de Control",
        "reception": "Recepción",
        "dashboard": "Dashboard",
        "rooms": "Habitaciones",
        "categories": "Categorías",
        "guests": "Huéspedes",
        "reservations": "Reservas",
        "extra_services": "Servicios Extra",
        "invoices": "Facturación",
        "staff": "Personal",
        "amenities": "Comodidades",
        "refunds": "Reembolsos",
        "complaints": "Libro de Reclamaciones",
        "logout": "Cerrar Sesión"
      },

      // Dashboard
      "dashboard": {
        "title": "Panel de Control General",
        "occupancy": "Ocupación Actual",
        "of_rooms": "de {{total}} habitaciones",
        "revenue_today": "Ingresos Hoy (Facturado)",
        "revenue_desc": "Facturas cobradas el día de hoy",
        "active_reservations": "Reservas Activas",
        "active_desc": "En proceso o pendientes",
        "pending_checkins": "Check-Ins Pendientes",
        "checkins_desc": "Huéspedes que llegan hoy",
        "system_ok": "¡Sistema Gotitas Hotel Operativo!",
        "system_desc": "Todos los módulos base se encuentran funcionando correctamente. La arquitectura soporta escalabilidad y concurrencia.",
        "loading": "Cargando métricas..."
      },

      // Rooms (admin)
      "rooms": {
        "title": "Habitaciones",
        "subtitle": "Gestiona el inventario de habitaciones y su estado en tiempo real.",
        "add": "Nueva Habitación",
        "number": "Número",
        "floor": "Piso",
        "category": "Categoría",
        "current_status": "Estado Actual",
        "actions": "Acciones",
        "no_rooms": "No hay habitaciones registradas.",
        "add_title": "Añadir Habitación",
        "edit_title": "Editar Habitación",
        "select_category": "Selecciona una categoría...",
        "cancel": "Cancelar",
        "save": "Guardar",
        "confirm_delete": "¿Eliminar esta habitación?"
      },

      // Categories (admin)
      "categories": {
        "title": "Categorías de Habitación",
        "subtitle": "Configura los tipos de habitación, precios base y capacidades.",
        "add": "Nueva Categoría",
        "name": "Nombre",
        "description": "Descripción",
        "base_price": "Precio Base (S/)",
        "max_capacity": "Capacidad Máx.",
        "image": "Imagen de Habitación",
        "no_image": "Sin imagen",
        "no_categories": "No hay categorías registradas.",
        "capacity_label": "Capacidad Máx:",
        "persons": "pers.",
        "add_title": "Crear Categoría",
        "edit_title": "Editar Categoría",
        "cancel": "Cancelar",
        "save": "Guardar",
        "confirm_delete": "¿Eliminar esta categoría?"
      },

      // Guests (admin)
      "guests": {
        "title": "Huéspedes",
        "subtitle": "Registro y búsqueda de huéspedes.",
        "add": "Nuevo Huésped",
        "search": "Buscar por nombre o documento...",
        "first_name": "Nombres",
        "last_name": "Apellidos",
        "doc_type": "Tipo Doc.",
        "doc_number": "N° Documento",
        "email": "Email",
        "phone": "Teléfono",
        "address": "Dirección",
        "no_guests": "No hay huéspedes registrados.",
        "add_title": "Nuevo Huésped",
        "edit_title": "Editar Huésped",
        "cancel": "Cancelar",
        "save": "Guardar"
      },

      // Reservations (admin)
      "reservations": {
        "title": "Reservas",
        "subtitle": "Gestión completa de reservas del hotel.",
        "add": "Nueva Reserva",
        "id": "ID",
        "guest": "Huésped",
        "category": "Categoría",
        "room": "Habitación",
        "checkin": "Check-In",
        "checkout": "Check-Out",
        "status": "Estado",
        "total": "Total",
        "actions": "Acciones",
        "no_reservations": "No hay reservas registradas.",
        "confirm_checkout": "¿Confirmar Check-out?",
        "confirm_cancel": "¿Cancelar esta reserva?",
        "add_title": "Nueva Reserva",
        "checkin_title": "Check-In: Asignar Habitación",
        "available_rooms": "Habitaciones Disponibles (Categoría {{name}})",
        "no_available_rooms": "No hay cuartos físicos libres y limpios. Verifica el inventario.",
        "select_room": "-- Seleccionar Cuarto --",
        "do_checkin": "Hacer Check-In",
        "consumptions_title": "Consumos Extra",
        "service": "Servicio",
        "quantity": "Cant.",
        "unit_price": "Precio U.",
        "subtotal": "Subtotal",
        "remove": "Quitar",
        "total_consumptions": "TOTAL CONSUMOS:",
        "no_consumptions": "No hay consumos registrados.",
        "add_consumption": "Agregar",
        "select_service": "-- Seleccionar --",
        "notes": "Notas (Opcional)",
        "select_guest": "-- Seleccionar Huésped --",
        "select_category": "-- Seleccionar Categoría --",
        "confirm_reservation": "Confirmar Reserva",
        "cancel": "Cancelar"
      },

      // Extra Services (admin)
      "services": {
        "title": "Catálogo de Servicios Extra",
        "add": "Nuevo Servicio",
        "name": "Nombre",
        "price": "Precio",
        "status": "Estado",
        "actions": "Acciones",
        "add_title": "Nuevo Servicio",
        "edit_title": "Editar Servicio",
        "description": "Descripción",
        "unit_price": "Precio Unitario (S/)",
        "available": "Servicio Disponible para la venta",
        "cancel": "Cancelar",
        "save": "Guardar"
      },

      // Invoices (admin)
      "invoices": {
        "title": "Facturación y Pagos",
        "generate": "Generar Factura",
        "id": "ID",
        "reservation": "Reserva",
        "guest": "Huésped (Doc)",
        "total": "Total",
        "status": "Estado",
        "actions": "Acciones",
        "no_invoices": "No hay facturas emitidas",
        "generate_title": "Generar Factura",
        "select_reservation": "Seleccionar Reserva",
        "select_reservation_placeholder": "-- Buscar Reserva --",
        "generate_info": "El sistema sumará automáticamente el costo de las noches de habitación y todos los consumos extras registrados.",
        "generate_btn": "Generar Documento",
        "cancel": "Cancelar",
        "confirm_pay": "¿Confirmar pago de esta factura?",
        "download_error": "Error al descargar PDF"
      },

      // Staff (admin)
      "staff": {
        "title": "Personal del Hotel",
        "add": "Nuevo Empleado",
        "id": "ID",
        "email": "Correo Electrónico",
        "role": "Rol de Sistema",
        "actions": "Acciones",
        "add_title": "Nuevo Empleado",
        "edit_title": "Editar Empleado",
        "email_label": "Correo (Usuario de Acceso)",
        "password_label": "Contraseña",
        "password_hint": "(Dejar en blanco para no cambiar)",
        "role_label": "Rol de Acceso",
        "role_receptionist": "Recepcionista (Solo Operaciones)",
        "role_admin": "Administrador (Control Total)",
        "cancel": "Cancelar",
        "save": "Guardar",
        "confirm_delete": "¿Eliminar este empleado?"
      },

      // Amenities (admin)
      "amenities": {
        "title": "Comodidades",
        "subtitle": "Gestiona las comodidades disponibles para las categorías.",
        "add": "Nueva Comodidad",
        "name": "Nombre",
        "description": "Descripción",
        "icon": "Ícono (Emoji o Texto)",
        "icon_placeholder": "Ej: 🏊",
        "no_amenities": "No hay comodidades registradas.",
        "add_title": "Nueva Comodidad",
        "cancel": "Cancelar",
        "save": "Guardar"
      },

      // Refunds (admin)
      "refunds": {
        "title": "Gestión de Reembolsos",
        "id": "ID",
        "booking_code": "Reserva (Cód)",
        "amount": "Monto (S/)",
        "reason": "Motivo",
        "status": "Estado",
        "processed_by": "Procesado Por",
        "actions": "Acciones",
        "no_refunds": "No hay reembolsos registrados.",
        "confirm_process": "¿Confirmar que el dinero ha sido devuelto a la tarjeta del cliente?",
        "mark_processed": "Marcar Procesado",
        "process_error": "Error al procesar reembolso"
      },

      // Reception (admin)
      "reception": {
        "title": "Recepción: Buscar Reserva",
        "search_placeholder": "Ingrese Código de Reserva (Ej. REF...)",
        "search_btn": "Buscar",
        "client": "Cliente",
        "category": "Categoría",
        "room": "Habitación:",
        "dates": "Fechas",
        "total_label": "Total a Pagar (inc. IGV)",
        "origin": "Origen:",
        "checkin_btn": "Realizar Check-in",
        "download_invoice": "Descargar Factura",
        "checkin_info": "Para realizar Check-in y asignar habitación, diríjase al panel de Reservas.",
        "invoice_error": "La factura aún no ha sido generada o no hay pagos.",
        "invoice_fetch_error": "Error al obtener la factura."
      },

      // Common
      "common": {
        "loading": "Cargando...",
        "save": "Guardar",
        "cancel": "Cancelar",
        "edit": "Editar",
        "delete": "Eliminar",
        "add": "Agregar",
        "search": "Buscar",
        "actions": "Acciones",
        "confirm": "Confirmar",
        "error": "Error",
        "success": "Éxito",
        "no_data": "Sin datos",
        "yes": "Sí",
        "no": "No"
      }
    }
  },

  en: {
    translation: {
      // Hero
      "hero": {
        "welcome": "Welcome to",
        "hotel": "Gotitas Hotel.",
        "desc": "Disconnect from the world. Relax in exclusive rooms with panoramic views and enjoy 24/7 luxury service.",
        "explore": "Explore Rooms",
        "rating": "Rating",
        "service": "Service",
        "satisfaction": "Satisfaction"
      },

      // Features
      "features": {
        "f_label": "Capabilities",
        "f_title1": "First class",
        "f_title2": "services.",
        "f_subtitle": "Discover why our guests always come back. Every corner is designed for your absolute comfort.",
        "f_01_t": "Total Connectivity",
        "f_01_d": "Ultra-high-speed Wi-Fi throughout all facilities at no extra cost.",
        "f_02_t": "Exquisite Gastronomy",
        "f_02_d": "Buffet breakfast and gourmet restaurants with local and international options.",
        "f_03_t": "Perfect Climate",
        "f_03_d": "Intelligent climate control systems adjustable from your smartphone.",
        "f_04_t": "Entertainment",
        "f_04_d": "4K OLED screens with access to your favorite streaming platforms."
      },

      // Navbar
      "nav": {
        "home": "Home",
        "rooms": "Rooms",
        "experience": "Experience",
        "services": "Services",
        "book": "Book Now",
        "my_reservations": "My Bookings",
        "admin_panel": "Admin Panel",
        "login": "Sign In",
        "logout": "Sign Out"
      },

      // Footer
      "footer": {
        "terms": "Terms & Conditions",
        "contact": "Contact",
        "desc": "An unforgettable experience in the heart of the city.",
        "rights": "All rights reserved.",
        "privacy": "Privacy Policy",
        "complaints": "Complaints Book"
      },

      // Public Rooms
      "publicRooms": {
        "searcher": "Search",
        "checkin": "Check-in",
        "checkout": "Check-out",
        "guests": "Guests",
        "search": "Search Availability",
        "loading": "Loading...",
        "available": "Available Rooms",
        "select_dates": "Enter your dates and number of guests to search for availability.",
        "no_rooms": "No rooms available for these dates and number of guests.",
        "book": "Book",
        "night": "night",
        "per_night": "/night",
        "max_persons": "Max {{count}} guests"
      },

      // Auth
      "auth": {
        "login": "Sign In",
        "email": "Email",
        "password": "Password",
        "verify_now": "Verify account now",
        "no_account": "Are you a client and don't have an account? Sign up",
        "register": "Create Account",
        "first_name": "First Name",
        "last_name": "Last Name",
        "doc_type": "Doc Type",
        "doc_number": "Document Number",
        "name": "Full Name",
        "phone": "Phone",
        "document": "Document ID",
        "btn_register": "Sign Up",
        "btn_login": "Sign In",
        "have_account": "Already have an account? Log in here.",
        "verify": "Verify Account",
        "enter_code": "Enter the code we sent to",
        "code": "Code",
        "btn_verify": "Verify",
        "resend": "Resend code",
        "registering": "Registering...",
        "error_generic": "Registration error"
      },

      // Client
      "client": {
        "checkout_title": "Confirm Booking",
        "summary": "Booking Summary",
        "room": "Room",
        "price_per_night": "Price per night",
        "nights": "Nights",
        "total": "Total to Pay",
        "accept_terms": "I accept the",
        "confirm": "Go to Pay",
        "processing": "Processing...",
        "my_reservations": "My Bookings",
        "history": "History of your stays",
        "amount": "Amount",
        "status": "Status",
        "modify": "Modify Dates",
        "cancel": "Cancel Booking",
        "invoice": "Invoice",
        "btn_cancel": "Cancel",
        "btn_save": "Save Changes",
        "new_checkin": "New Check-in",
        "new_checkout": "New Check-out",
        "deposit": "Deposit",
        "pay_deposit": "Approve Deposit",
        "pay_full": "Approve Total",
        "pay_now": "Pay Now",
        "booking_code": "Booking Code",
        "category": "Category",
        "dates": "Dates",
        "no_reservations": "You have no reservations at the moment.",
        "cancelled_by": "Cancelled by",
        "modify_info": "Only one (1) modification is allowed per reservation, up to 48h before the original Check-In. Subject to category availability. The total price will be recalculated.",
        "redirect_payment": "Upon confirmation, you will be redirected to the simulated payment gateway.",
        "account_summary": "Account Summary",
        "loading": "Loading reservations..."
      },

      // Payment Gateway
      "payment": {
        "title": "MockPay Gateway",
        "booking": "Booking",
        "approve_deposit": "Approve Deposit",
        "approve_full": "Approve Total",
        "simulate_reject": "Simulate Rejection",
        "processing": "Processing...",
        "success_title": "Payment Approved!",
        "success_desc": "Your reservation has been successfully confirmed.",
        "success_redirect": "Redirecting to your reservations...",
        "error_title": "Payment Rejected",
        "error_desc": "There was a problem processing your card or you chose to simulate a rejection.",
        "error_redirect": "You will be redirected to the home page...",
        "disclaimer": "This environment is a simulation. No real charges are made to any card. By clicking \"Approve\", a signed Webhook POST will be sent to the backend."
      },

      // Status labels
      "status": {
        "pending": "Pending",
        "confirmed": "Confirmed",
        "checked_in": "Checked In",
        "checked_out": "Checked Out",
        "cancelled": "Cancelled",
        "available": "Available",
        "occupied": "Occupied",
        "cleaning": "Cleaning",
        "maintenance": "Maintenance",
        "paid": "Paid",
        "void": "Void",
        "requested": "Requested",
        "processed": "Processed",
        "active": "Active",
        "inactive": "Inactive"
      },

      // Admin Panel
      "admin": {
        "panel": "Control Panel",
        "reception": "Reception",
        "dashboard": "Dashboard",
        "rooms": "Rooms",
        "categories": "Categories",
        "guests": "Guests",
        "reservations": "Reservations",
        "extra_services": "Extra Services",
        "invoices": "Billing",
        "staff": "Staff",
        "amenities": "Amenities",
        "refunds": "Refunds",
        "complaints": "Complaints Book",
        "logout": "Log Out"
      },

      // Dashboard
      "dashboard": {
        "title": "General Control Panel",
        "occupancy": "Current Occupancy",
        "of_rooms": "of {{total}} rooms",
        "revenue_today": "Today's Revenue (Billed)",
        "revenue_desc": "Invoices collected today",
        "active_reservations": "Active Reservations",
        "active_desc": "In progress or pending",
        "pending_checkins": "Pending Check-Ins",
        "checkins_desc": "Guests arriving today",
        "system_ok": "Gotitas Hotel System Operational!",
        "system_desc": "All base modules are working correctly. The architecture supports scalability and concurrency.",
        "loading": "Loading metrics..."
      },

      // Rooms (admin)
      "rooms": {
        "title": "Rooms",
        "subtitle": "Manage the room inventory and their real-time status.",
        "add": "New Room",
        "number": "Number",
        "floor": "Floor",
        "category": "Category",
        "current_status": "Current Status",
        "actions": "Actions",
        "no_rooms": "No rooms registered.",
        "add_title": "Add Room",
        "edit_title": "Edit Room",
        "select_category": "Select a category...",
        "cancel": "Cancel",
        "save": "Save",
        "confirm_delete": "Delete this room?"
      },

      // Categories (admin)
      "categories": {
        "title": "Room Categories",
        "subtitle": "Configure room types, base prices and capacities.",
        "add": "New Category",
        "name": "Name",
        "description": "Description",
        "base_price": "Base Price (S/)",
        "max_capacity": "Max Capacity",
        "image": "Room Image",
        "no_image": "No image",
        "no_categories": "No categories registered.",
        "capacity_label": "Max Capacity:",
        "persons": "guests",
        "add_title": "Create Category",
        "edit_title": "Edit Category",
        "cancel": "Cancel",
        "save": "Save",
        "confirm_delete": "Delete this category?"
      },

      // Guests (admin)
      "guests": {
        "title": "Guests",
        "subtitle": "Guest registration and search.",
        "add": "New Guest",
        "search": "Search by name or document...",
        "first_name": "First Name",
        "last_name": "Last Name",
        "doc_type": "Doc Type",
        "doc_number": "Document No.",
        "email": "Email",
        "phone": "Phone",
        "address": "Address",
        "no_guests": "No guests registered.",
        "add_title": "New Guest",
        "edit_title": "Edit Guest",
        "cancel": "Cancel",
        "save": "Save"
      },

      // Reservations (admin)
      "reservations": {
        "title": "Reservations",
        "subtitle": "Complete hotel reservation management.",
        "add": "New Reservation",
        "id": "ID",
        "guest": "Guest",
        "category": "Category",
        "room": "Room",
        "checkin": "Check-In",
        "checkout": "Check-Out",
        "status": "Status",
        "total": "Total",
        "actions": "Actions",
        "no_reservations": "No reservations registered.",
        "confirm_checkout": "Confirm Check-out?",
        "confirm_cancel": "Cancel this reservation?",
        "add_title": "New Reservation",
        "checkin_title": "Check-In: Assign Room",
        "available_rooms": "Available Rooms (Category {{name}})",
        "no_available_rooms": "No clean and free physical rooms available. Check inventory.",
        "select_room": "-- Select Room --",
        "do_checkin": "Do Check-In",
        "consumptions_title": "Extra Consumptions",
        "service": "Service",
        "quantity": "Qty.",
        "unit_price": "Unit Price",
        "subtotal": "Subtotal",
        "remove": "Remove",
        "total_consumptions": "TOTAL CONSUMPTIONS:",
        "no_consumptions": "No consumptions registered.",
        "add_consumption": "Add",
        "select_service": "-- Select --",
        "notes": "Notes (Optional)",
        "select_guest": "-- Select Guest --",
        "select_category": "-- Select Category --",
        "confirm_reservation": "Confirm Reservation",
        "cancel": "Cancel"
      },

      // Extra Services (admin)
      "services": {
        "title": "Extra Services Catalog",
        "add": "New Service",
        "name": "Name",
        "price": "Price",
        "status": "Status",
        "actions": "Actions",
        "add_title": "New Service",
        "edit_title": "Edit Service",
        "description": "Description",
        "unit_price": "Unit Price (S/)",
        "available": "Service Available for sale",
        "cancel": "Cancel",
        "save": "Save"
      },

      // Invoices (admin)
      "invoices": {
        "title": "Billing & Payments",
        "generate": "Generate Invoice",
        "id": "ID",
        "reservation": "Reservation",
        "guest": "Guest (Doc)",
        "total": "Total",
        "status": "Status",
        "actions": "Actions",
        "no_invoices": "No invoices issued",
        "generate_title": "Generate Invoice",
        "select_reservation": "Select Reservation",
        "select_reservation_placeholder": "-- Find Reservation --",
        "generate_info": "The system will automatically add the cost of room nights and all extra consumptions registered.",
        "generate_btn": "Generate Document",
        "cancel": "Cancel",
        "confirm_pay": "Confirm payment of this invoice?",
        "download_error": "Error downloading PDF"
      },

      // Staff (admin)
      "staff": {
        "title": "Hotel Staff",
        "add": "New Employee",
        "id": "ID",
        "email": "Email",
        "role": "System Role",
        "actions": "Actions",
        "add_title": "New Employee",
        "edit_title": "Edit Employee",
        "email_label": "Email (Access Username)",
        "password_label": "Password",
        "password_hint": "(Leave blank to keep unchanged)",
        "role_label": "Access Role",
        "role_receptionist": "Receptionist (Operations Only)",
        "role_admin": "Administrator (Full Control)",
        "cancel": "Cancel",
        "save": "Save",
        "confirm_delete": "Delete this employee?"
      },

      // Amenities (admin)
      "amenities": {
        "title": "Amenities",
        "subtitle": "Manage available amenities for room categories.",
        "add": "New Amenity",
        "name": "Name",
        "description": "Description",
        "icon": "Icon (Emoji or Text)",
        "icon_placeholder": "E.g: 🏊",
        "no_amenities": "No amenities registered.",
        "add_title": "New Amenity",
        "cancel": "Cancel",
        "save": "Save"
      },

      // Refunds (admin)
      "refunds": {
        "title": "Refund Management",
        "id": "ID",
        "booking_code": "Booking (Code)",
        "amount": "Amount (S/)",
        "reason": "Reason",
        "status": "Status",
        "processed_by": "Processed By",
        "actions": "Actions",
        "no_refunds": "No refunds registered.",
        "confirm_process": "Confirm that the money has been returned to the client's card?",
        "mark_processed": "Mark as Processed",
        "process_error": "Error processing refund"
      },

      // Reception (admin)
      "reception": {
        "title": "Reception: Find Reservation",
        "search_placeholder": "Enter Booking Code (e.g. REF...)",
        "search_btn": "Search",
        "client": "Client",
        "category": "Category",
        "room": "Room:",
        "dates": "Dates",
        "total_label": "Total to Pay (incl. Tax)",
        "origin": "Origin:",
        "checkin_btn": "Do Check-In",
        "download_invoice": "Download Invoice",
        "checkin_info": "To check in and assign a room, go to the Reservations panel.",
        "invoice_error": "Invoice has not been generated yet or there are no payments.",
        "invoice_fetch_error": "Error fetching invoice."
      },

      // Common
      "common": {
        "loading": "Loading...",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete",
        "add": "Add",
        "search": "Search",
        "actions": "Actions",
        "confirm": "Confirm",
        "error": "Error",
        "success": "Success",
        "no_data": "No data",
        "yes": "Yes",
        "no": "No"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
