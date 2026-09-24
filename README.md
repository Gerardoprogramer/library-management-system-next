# 📚 Library Management System (LMS) - Frontend

Web frontend for the **Library Management System**, built with **Next.js 16 (App Router)** and designed to integrate securely with a REST API developed with **Java 21 + Spring Boot**.

The application covers the main workflows of a library platform, including catalog management, loans, reservations, wishlists, reviews, fines, subscriptions, payments, and administrative operations.

## 🔗 Full Project

* **Frontend:** https://github.com/Gerardoprogramer/library-management-system-next
* **Backend:** https://github.com/Gerardoprogramer/Library-Management-System
* **Live Demo:** https://obsidian-delta-kohl.vercel.app/

---

## 🚀 Network Architecture and Security

The frontend follows a **Backend for Frontend (BFF)** architecture to centralize communication with Spring Boot and prevent the browser from directly consuming the external backend API.

### Centralized Backend Proxy

All backend requests go through a centralized utility located at:

```text
lib/api-proxy.ts
```

This layer is responsible for:

* building the appropriate backend URL;
* forwarding `HttpOnly` cookies;
* forwarding CSRF tokens through `X-XSRF-TOKEN`;
* preserving query parameters;
* propagating `Set-Cookie` headers returned by Spring Boot;
* handling `204 No Content` responses;
* enforcing communication timeouts;
* normalizing communication errors between Next.js and Spring Boot.

### Cold Start Handling

The backend proxy is prepared to work with infrastructure that may become inactive after a period without traffic.

When Next.js has not received a recent response from the backend, the BFF first performs:

```http
GET /actuator/health
```

This allows the backend service to wake up before the actual request is executed.

Safe HTTP methods:

```text
GET
HEAD
```

may be retried after a network-level failure.

State-changing operations:

```text
POST
PUT
PATCH
DELETE
```

are sent only once to avoid duplicated side effects if the backend processed the request but the response was lost because of a network interruption.

Concurrent warm-up requests within the same Next.js instance share a single health-check request.

### Silent Authentication Refresh

Silent session renewal is handled by the HTTP client located at:

```text
lib/axios.ts
```

When a protected request receives:

```http
401 Unauthorized
```

the Axios interceptor attempts to renew the session using the `refresh_token`.

If the refresh succeeds:

1. Spring Boot generates new authentication credentials.
2. The new cookies are propagated through the BFF.
3. The original request is replayed.

Concurrent refresh attempts share the same refresh request, preventing unnecessary parallel session renewals.

### CSRF Protection

The following operations:

```text
POST
PUT
PATCH
DELETE
```

require a CSRF token.

If the browser does not yet have the `XSRF-TOKEN` cookie, the client first performs:

```http
GET /api/auth/csrf
```

and then sends:

```http
X-XSRF-TOKEN
```

with the protected request.

### Route Protection

The root-level:

```text
proxy.ts
```

protects `/dashboard` and its nested routes at the Next.js layer.

If the user does not have either an access-token cookie or a refresh-token cookie, the application redirects to:

```text
/auth/login?reason=session_expired
```

Authenticated users who attempt to access public authentication pages are redirected back to the dashboard.

Administrative authorization is additionally enforced through the authenticated user role and backend permissions.

### Security Headers

The frontend configures security headers across the application, including:

* Content Security Policy (CSP)
* `X-Content-Type-Options`
* `Referrer-Policy`
* `Permissions-Policy`
* `X-Frame-Options`

The application also restricts:

* external script execution;
* frame embedding;
* camera access;
* microphone access;
* geolocation access.

---

## 🛠️ Technology Stack

| Area         | Technology            |
| ------------ | --------------------- |
| Framework    | Next.js 16            |
| UI           | React 19              |
| Language     | TypeScript            |
| Styling      | Tailwind CSS          |
| Components   | shadcn/ui             |
| Server State | TanStack React Query  |
| HTTP Client  | Axios                 |
| Forms        | React Hook Form       |
| Validation   | Zod                   |
| Unit Testing | Vitest                |
| E2E Testing  | Playwright            |
| Backend      | Java 21 / Spring Boot |
| CI           | GitHub Actions        |
| Hosting      | Vercel                |

---

## 📂 Project Structure

```text
├── app/
│   ├── api/              # BFF Route Handlers for Spring Boot
│   ├── auth/             # Login, registration, and password recovery
│   └── dashboard/        # Protected application area
│
├── components/           # Reusable UI components
├── e2e/                  # End-to-end tests with Playwright
├── hooks/                # React Query hooks, mutations, and reusable logic
├── lib/                  # API proxy, Axios client, schemas, and utilities
├── services/             # Domain-specific HTTP services
├── test/                 # Unit tests with Vitest
├── proxy.ts              # Route protection and redirects
├── playwright.config.ts  # E2E configuration
└── public/               # Static assets
```

---

## ✨ Features

### Authentication

* User registration
* Login
* Logout
* Automatic session refresh
* Password recovery
* Password reset
* `HttpOnly` cookies
* CSRF protection
* Protected routes

### Catalog

* Book listing
* Search
* Filters
* Genres
* Book details
* Availability
* Ratings
* Wishlist

### Loans

* Active loans
* Loan history
* Book returns
* Renewals
* Loan statuses
* Overdue-loan handling

### Reservations

* Create reservations
* View reservations
* Cancel reservations
* Reservation status management
* Integration with the backend reservation queue

### Reviews

* Create reviews
* Update reviews
* View ratings
* Average book ratings

### Wishlist

* Add books
* Remove books
* View personal wishlist

### Fines

* View fines
* Fine status
* Start fine payments
* Stripe integration

### Subscriptions

* View available plans
* Create subscriptions
* View active membership
* Cancel subscriptions
* Display borrowing limits based on the selected plan

### Payments

* Create payment sessions
* Check payment status
* Payment history
* Stripe Checkout integration

---

## 🛡️ Administrative Panel

Users with the `ADMIN` role have access to additional management functionality.

### Users

* View users

### Books

* Create books
* Edit books
* Delete books
* Manage availability

### Genres

* Create genres
* Edit genres
* Delete genres

### Loans

* View loans
* Create loans for users
* Register returns
* Update overdue loans

### Reservations

* View reservations
* Manage reservation states
* Fulfill reservations

### Fines

* Create fines
* View fines
* Manage fine states

### Payments

* Administrative payment operations provided by the backend

### Subscription Plans

* Create plans
* Edit plans
* Delete plans

### Subscriptions

* View memberships
* Manage subscriptions
* Deactivate expired subscriptions

---

## 🔄 Frontend → Backend Integration Matrix

The browser only communicates with frontend `/api/**` routes.

Each Next.js Route Handler translates the public frontend route into the corresponding backend resource under:

```text
/api/v1
```

| Domain / Screen    | Frontend Service          | Frontend BFF                     | Backend                      |
| ------------------ | ------------------------- | -------------------------------- | ---------------------------- |
| Authentication     | `authService`             | `/api/auth/*`                    | `/auth/*`                    |
| Catalog            | `bookService`             | `/api/book/*`                    | `/books/*`                   |
| Genres             | `genreService`            | `/api/genres/*`                  | `/genres/*`                  |
| Loans              | `loansService`            | `/api/loans/*`                   | `/book-loans/*`              |
| Reservations       | `reservationService`      | `/api/reservation/*`             | `/reservations/*`            |
| Reviews            | `reviewService`           | `/api/reviews/*`                 | `/reviews/*`                 |
| Wishlist           | `wishlistService`         | `/api/wishlist/*`                | `/wishlist/*`                |
| Fines              | `FineService`             | `/api/fines/*`                   | `/fines/*`                   |
| Payments           | `PaymentService`          | `/api/payment/*`                 | `/payments/*`                |
| Plans              | `SubscriptionPlanService` | `/api/subscription-plan*`        | `/subscription-plans/*`      |
| Subscriptions      | `SubscriptionService`     | `/api/subscription/*`            | `/subscriptions/*`           |
| Admin Users        | `adminService`            | `/api/admin/users`               | `/admin/users`               |
| Admin Books        | `adminService`            | `/api/admin/books*`              | `/admin/books*`              |
| Admin Genres       | `adminService`            | `/api/admin/genres*`             | `/admin/genres*`             |
| Admin Loans        | `adminService`            | `/api/admin/book-loans*`         | `/admin/book-loans*`         |
| Admin Reservations | `adminService`            | `/api/admin/reservations*`       | `/admin/reservations*`       |
| Admin Fines        | `adminService`            | `/api/admin/fines*`              | `/admin/fines*`              |
| Admin Payments     | `adminService`            | `/api/admin/payments*`           | `/admin/payments*`           |
| Admin Plans        | `adminService`            | `/api/admin/subscription-plans*` | `/admin/subscription-plans*` |

Internal Route Handlers are also available for background administrative operations such as:

```text
/api/admin/book-loans/overdue/update
/api/admin/subscriptions/deactivate-expired
```

The Stripe webhook remains a **backend-to-backend integration** and is not exposed as a direct browser action.

---

## ⚙️ Environment Configuration

Create:

```text
.env.local
```

in the project root.

Example:

```env
BACKEND_URL=http://localhost:8080
```

For production:

```env
BACKEND_URL=https://your-backend.example.com
```

The BFF supports either:

```text
https://your-backend.example.com
```

or:

```text
https://your-backend.example.com/api/v1
```

The application also supports:

```env
NEXT_PUBLIC_BACKEND_URL
```

as a fallback, although `BACKEND_URL` is recommended because communication with Spring Boot occurs from the Next.js server and the backend URL does not need to be exposed to the browser.

### Recommended Backend Production Configuration

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=None
CORS_ALLOWED_ORIGIN_PATTERNS=https://your-frontend.example.com
```

When the frontend communicates with the backend through the BFF, browser requests remain same-origin relative to the frontend.

---

## 📦 Installation

### Requirements

* Node.js 22+
* pnpm 10+
* Google Chrome for running Playwright locally
* Running Spring Boot backend

### Clone the Repository

```bash
git clone https://github.com/Gerardoprogramer/library-management-system-next.git
cd library-management-system-next
```

### Install Dependencies

```bash
pnpm install
```

### Configure the Environment

```env
BACKEND_URL=http://localhost:8080
```

### Development

```bash
pnpm dev
```

The application normally runs at:

```text
http://localhost:3000
```

### Production Build

```bash
pnpm build
```

### Run the Production Build Locally

```bash
pnpm start
```

---

## 🧪 Testing

The project uses two main levels of automated testing.

### Unit Tests

Unit tests are implemented with **Vitest**.

Run:

```bash
pnpm test
```

The current test suite covers areas such as:

* services;
* authentication schemas;
* Route Handlers;
* administrative route protection.

### End-to-End Tests

Critical browser workflows are tested with **Playwright**.

Run:

```bash
pnpm test:e2e
```

or:

```bash
pnpm exec playwright test
```

The E2E suite currently covers:

* public landing page;
* authentication navigation;
* registration validation;
* route protection;
* logout;
* administrative authorization;
* authenticated catalog;
* book search;
* loan return flow.

The tests use controlled API responses to keep the suite deterministic and independent from external services.

### Playwright Browser

During local development, Playwright uses **Google Chrome installed on the system**.

The local configuration uses:

```text
channel: chrome
```

In CI, GitHub Actions automatically installs **Chromium** before running the E2E suite.

---

## ✅ Quality Validation

Before publishing changes, the following commands can be used to validate the project:

```bash
pnpm format:check
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm test:e2e
pnpm build
```

The GitHub Actions pipeline automatically runs:

```text
Formatting
    ↓
ESLint
    ↓
TypeScript
    ↓
Vitest
    ↓
Playwright
    ↓
Production Build
```

This helps detect formatting issues, type errors, logic regressions, browser-flow regressions, and production build failures before changes are integrated.

---

## 🔐 Engineering Decisions

### BFF Instead of Direct Backend Access

The browser does not need to directly know or consume the Spring Boot API URL.

Next.js acts as an intermediary and centralizes:

* cookies;
* CSRF handling;
* errors;
* timeouts;
* header propagation;
* backend configuration.

### Tokens Stored in HttpOnly Cookies

Access and refresh tokens remain in `HttpOnly` cookies instead of being stored in:

```text
localStorage
```

or:

```text
sessionStorage
```

This reduces direct token exposure to client-side JavaScript.

### Centralized Session Refresh

Session renewal is handled by the HTTP client instead of being implemented independently by each component.

This avoids duplicating authentication logic across multiple screens.

### Refresh Deduplication

If several requests receive `401` responses simultaneously, they wait for a single shared refresh request.

### Safe Cold Start Handling

When the backend may be inactive, the BFF can first perform:

```http
GET /actuator/health
```

before executing the actual application request.

State-changing requests are not automatically retried.

This prevents potentially non-idempotent operations from being executed more than once while preserving compatibility with infrastructure that may experience cold starts.

### React Query for Server State

Remote server data is managed through queries and mutations instead of maintaining unnecessary manual copies of backend state.

Successful mutations invalidate related queries so that the interface remains synchronized with the server.

---

## 🔙 Backend

This frontend is part of a full-stack system.

The backend is built with:

* Java 21
* Spring Boot 3.3.7
* Spring Security
* PostgreSQL
* Spring Data JPA
* Flyway
* JWT
* Stripe
* Testcontainers
* Docker
* GitHub Actions

Repository:

https://github.com/Gerardoprogramer/Library-Management-System

The backend also implements:

* refresh-token rotation;
* SHA-256 hashing for stored refresh tokens;
* pessimistic locking;
* PostgreSQL integrity constraints;
* Flyway migrations;
* Stripe webhooks;
* payment idempotency;
* scheduled jobs;
* unit tests;
* PostgreSQL integration testing with Testcontainers.

---

## 🚀 Deployment

The frontend can be deployed on **Vercel**.

Primary production variable:

```env
BACKEND_URL=https://your-backend.example.com
```

The backend can be deployed independently as long as it is reachable from the Next.js server environment.

The BFF architecture keeps the frontend and backend independently deployable without requiring the browser to directly communicate with Spring Boot.

---

## 👨‍💻 Author

**Gerardo Alonso Martínez Monge**

Full Stack Software Engineer

* Portfolio: https://www.gerardomartinez.dev/
* GitHub: https://github.com/Gerardoprogramer

---

## 📄 Project Status

The project is functional and covers the main workflows expected from a library management platform.

It includes:

* independent frontend and backend applications;
* authentication and authorization;
* user and administrative workflows;
* payments;
* security controls;
* concurrency handling;
* database migrations;
* automated testing;
* continuous integration;
* deployment configuration.

The main development phase is considered complete, and the repository is maintained as a portfolio project.
