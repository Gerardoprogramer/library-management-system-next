# 📚 Library Management System (LMS) - Frontend

Este es el cliente del sistema de gestión de bibliotecas, desarrollado con **Next.js 16 (App Router)** y diseñado para una integración segura y escalable con un backend en **Spring Boot**.

## 🚀 Arquitectura de Red y Seguridad

El proyecto implementa una arquitectura de **Proxy Inverso** en el cliente para centralizar la comunicación y elevar los estándares de seguridad:

- **Backend Proxy Centralizado:** Todas las peticiones al API pasan por una utilidad personalizada en `lib/api-proxy.ts`. Esta capa gestiona automáticamente la inyección de cookies `HttpOnly`, el manejo de headers de contenido y la normalización de errores del servidor.
- **Silent Auth Refresh (Middleware):** Implementación de lógica en el Edge (`proxy.ts`) que intercepta peticiones al dashboard. Si el `access_token` ha expirado, intenta un refresco silencioso mediante el `refresh_token` antes de renderizar la página, evitando redirecciones innecesarias.
- **Protección de Rutas:** El acceso a `/dashboard` y subrutas está blindado a nivel de servidor. Se redirige al usuario a `/auth/login?reason=session_expired` si no existe una sesión válida, permitiendo una UX fluida con notificaciones automáticas.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [Shadcn/ui](https://ui.shadcn.com/)
- **Backend Integration:** Java / Spring Boot API.

## 📂 Estructura del Proyecto

```text
├── app/                  # Rutas y Layouts (App Router)
│   ├── api/              # Route Handlers (Puente hacia Spring Boot)
│   ├── auth/             # Flujos de Login y Registro
│   └── dashboard/        # Vistas protegidas (Catálogo, Préstamos, etc.)
├── components/           # Componentes atómicos y de UI
├── lib/                  # Utilidades (backendProxy, validaciones)
├── proxy.ts              # Middleware de seguridad y Auth Refresh
└── public/               # Assets estáticos
```

## ⚙️ Configuración del Entorno

Crea un archivo .env.local en la raíz del proyecto:

```text
BACKEND_URL=http://localhost:8080
```

En producción, configura `BACKEND_URL` como variable de entorno del servicio de Next.js y fuerza un nuevo deploy. El proxy acepta el origen (`https://tu-backend.example.com`) o una URL que ya incluya `/api/v1`. También reconoce `NEXT_PUBLIC_BACKEND_URL` como alternativa, aunque se recomienda `BACKEND_URL`.

Para producción, el backend debe tener `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=None` y `CORS_ALLOWED_ORIGIN_PATTERNS` con el dominio público del frontend. Si frontend y backend se consumen únicamente mediante este proxy, las peticiones del navegador siguen siendo same-origin y no requieren llamar directamente al backend.

### Endpoints de usuario integrados

Además de autenticación, catálogo, préstamos, reservas, reseñas, wishlist, multas y suscripciones, el frontend incluye proxy y servicios para:

- estadísticas del catálogo (`GET /api/book/stats`);
- devolución de préstamos (`POST /api/loans/checkin`);
- iniciar pagos (`POST /api/payment/initiate`);
- consultar el estado de un pago (`GET /api/payment/:paymentId/status`);
- recuperación y restablecimiento de contraseña (`POST /api/auth/forgot-password` y `POST /api/auth/reset-password`).
- operaciones administrativas protegidas por rol (`/api/admin/**`) para usuarios, libros, géneros, préstamos, reservas, multas, pagos y suscripciones.

### Matriz de integración frontend → backend

El navegador solo consume rutas `/api/**` del frontend. Cada route handler BFF
traduce la ruta pública al recurso correspondiente del backend bajo `/api/v1`.

| Dominio / pantalla                 | Servicio frontend                                | BFF del frontend                                                              | Recurso backend                              |
| ---------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------- |
| Autenticación y sesión             | `authService`, hooks de auth                     | `/api/auth/*`                                                                 | `/auth/*`                                    |
| Catálogo y detalle de libros       | `bookService`                                    | `/api/book/*`                                                                 | `/books/*`                                   |
| Géneros                            | `genreService`                                   | `/api/genres/*`                                                               | `/genres/*`                                  |
| Préstamos del usuario              | `loansService`                                   | `/api/loans/*`                                                                | `/book-loans/*`                              |
| Reservas del usuario               | `reservationService`                             | `/api/reservation/*`                                                          | `/reservations/*`                            |
| Reseñas                            | `reviewService`                                  | `/api/reviews/*`                                                              | `/reviews/*`                                 |
| Lista de deseos                    | `wishlistService`                                | `/api/wishlist/*`                                                             | `/wishlist/*`                                |
| Multas y pago de multas            | `FineService`                                    | `/api/fines/*`                                                                | `/fines/*`                                   |
| Pagos e historial                  | `PaymentService`                                 | `/api/payment/*`                                                              | `/payments/*`                                |
| Planes y suscripción               | `SubscriptionPlanService`, `SubscriptionService` | `/api/subscription-plan*`, `/api/subscription/*`                              | `/subscription-plans/*`, `/subscriptions/*`  |
| Administración de usuarios         | `adminService`                                   | `/api/admin/users`                                                            | `/admin/users`                               |
| Administración de libros y géneros | `adminService`                                   | `/api/admin/books*`, `/api/admin/genres*`                                     | `/admin/books*`, `/admin/genres*`            |
| Operaciones administrativas        | `adminService`                                   | `/api/admin/book-loans*`, `/api/admin/reservations*`                          | `/admin/book-loans*`, `/admin/reservations*` |
| Multas, pagos y planes admin       | `adminService`                                   | `/api/admin/fines*`, `/api/admin/payments*`, `/api/admin/subscription-plans*` | Recursos administrativos equivalentes        |

Las tareas internas sin pantalla propia también conservan su route handler:
actualización de préstamos vencidos (`/api/admin/book-loans/overdue/update`),
desactivación de suscripciones vencidas (`/api/admin/subscriptions/deactivate-expired`)
y webhook de Stripe, que permanece como integración backend-to-backend y no se
expone como acción del navegador.

## 📦 Instalación y Desarrollo

1. Clonar el repositorio:

```text
git clone https://github.com/Gerardoprogramer/library-management-system-next
```

2. Instalar dependencias:

```text
pnpm install
```

3. Iniciar el entorno de desarrollo:

```text
pnpm run dev
```

4. Build para producción:

```text
pnpm run build
```

### Validación de calidad

Los comandos principales para validar cambios antes de publicar son:

```text
pnpm format:check
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:e2e
pnpm run build
```

Los tests unitarios usan Vitest. Los flujos críticos del navegador usan Playwright y
requieren Chromium instalado con `pnpm exec playwright install chromium`. El workflow
de GitHub Actions instala el navegador automáticamente y ejecuta todas las validaciones.

Desarrollado por Gerardo Alonso Martínez Monge - Full Stack Software Engineer.
