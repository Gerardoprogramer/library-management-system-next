# 📚 Library Management System (LMS) - Frontend

Este es el cliente del sistema de gestión de bibliotecas, desarrollado con **Next.js 16 (App Router)** y diseñado para una integración segura y escalable con un backend en **Spring Boot**.

## 🚀 Arquitectura de Red y Seguridad

El proyecto implementa una arquitectura de **Proxy Inverso** en el cliente para centralizar la comunicación y elevar los estándares de seguridad:

* **Backend Proxy Centralizado:** Todas las peticiones al API pasan por una utilidad personalizada en `lib/api-proxy.ts`. Esta capa gestiona automáticamente la inyección de cookies `HttpOnly`, el manejo de headers de contenido y la normalización de errores del servidor.
* **Silent Auth Refresh (Middleware):** Implementación de lógica en el Edge (`proxy.ts`) que intercepta peticiones al dashboard. Si el `access_token` ha expirado, intenta un refresco silencioso mediante el `refresh_token` antes de renderizar la página, evitando redirecciones innecesarias.
* **Protección de Rutas:** El acceso a `/dashboard` y subrutas está blindado a nivel de servidor. Se redirige al usuario a `/auth/login?reason=session_expired` si no existe una sesión válida, permitiendo una UX fluida con notificaciones automáticas.

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes:** [Shadcn/ui](https://ui.shadcn.com/)
* **Backend Integration:** Java / Spring Boot API.

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
##⚙️ Configuración del Entorno
Crea un archivo .env.local en la raíz del proyecto:
```text
BACKEND_URL=https://library-management-system-i1y4.onrender.com
```
##📦 Instalación y Desarrollo
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
Desarrollado por Gerardo Alonso Martínez Monge - Full Stack Software Engineer.