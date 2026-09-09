# Market_Store

> Full-stack marketplace platform built with React, TypeScript and Express, featuring product management, shopping cart, order processing and VietQR payment integration through SePay.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-marketstore--two.vercel.app-black?style=flat-square)](https://marketstore-two.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=flat-square)](frontend)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-orange?style=flat-square)](backend)

---

## 📖 Overview

**Market_Store** is a full-stack marketplace platform designed for selling and managing digital products.

The project provides a complete e-commerce workflow covering:

* User registration and authentication
* Product discovery
* Product details
* Shopping cart
* Checkout
* Discount codes
* VietQR payment
* Automatic payment confirmation through SePay webhook
* Digital product downloads
* Product reviews and comments
* Customer support chat
* Blog content
* Admin management
* Sales reports
* Product and order management

The repository is structured as two independent applications:

```text
Market_Store/
│
├── frontend/    # React + Vite application
│
└── backend/     # Express + TypeScript API
```

The project is licensed under the **MIT License**.

---

# ✨ Features

## 👤 User Features

### Authentication

* User registration
* User login
* JWT-based authentication
* User profile management
* Role-based access control

### Product Discovery

* Browse products
* Product details
* Product categories
* Product search
* Product filtering
* Product sorting

### Shopping Cart

* Add products to cart
* Update quantities
* Remove products
* View cart summary
* Calculate order totals

### Checkout

* Create orders
* Apply discount codes
* Calculate final price
* Create payment transaction
* Track payment status

### VietQR Payment

The project integrates VietQR payment processing through **SePay**.

The payment flow supports:

```text
Create Order
     │
     ▼
Create Payment Transaction
     │
     ▼
Generate VietQR
     │
     ▼
Customer Makes Bank Transfer
     │
     ▼
SePay Webhook
     │
     ▼
Backend Verifies Transaction
     │
     ▼
Update Payment Status
     │
     ▼
Complete Order
```

This allows payment status to be updated automatically after the bank transaction is received.

---

## 📥 Digital Product Downloads

For digital products, the system can provide access after successful payment.

The download flow is based on:

```text
Order
  │
  ▼
Payment Confirmed
  │
  ▼
Check Product
  │
  ▼
Create / Validate Download
  │
  ▼
Customer Downloads File
```

Relevant backend entities include:

* `downloads`
* `orders`
* `products`

---

## 💬 Reviews & Comments

Users can interact with products and blog content through:

* Product reviews
* Blog comments
* Comment moderation
* Admin approval

Blog comments can be reviewed by administrators before being published.

---

## 💬 Customer Support Chat

The platform includes a customer support chat architecture.

Main concepts include:

* Chat sessions
* Chat messages
* Admin notifications

The general flow is:

```text
Customer
   │
   ▼
Chat Session
   │
   ▼
Chat Messages
   │
   ▼
Admin Notification
   │
   ▼
Admin Response
```

---

# 👨‍💼 Admin Features

The administration side provides management functionality for the marketplace.

## Product Management

Admins can:

* Create products
* Edit products
* Delete products
* Upload product images
* Manage product categories
* Manage digital product files
* Update pricing
* Manage product availability

---

## Order Management

Admins can:

* View orders
* View order details
* Track order status
* Track payment status
* Review payment transactions
* Manage customer orders

---

## Discount Management

The system supports discount-related data including:

* Discounts
* Discount users
* Discount usage

This allows promotional campaigns to be applied during checkout.

---

## Blog Management

The admin system includes:

* Blog posts
* Blog categories
* Blog comments
* Comment moderation

---

## Reports

The project supports report generation and data export.

The frontend includes libraries for:

* PDF generation
* Excel export
* Data visualization

The project documentation also describes an admin reporting workflow based around reports and PDF/Excel output.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         │                     │
                         │ Web Browser         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │                     │
                         │ React + Vite        │
                         │ TypeScript          │
                         │ React Router        │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP API
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │                     │
                         │ Express + TypeScript│
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │   Supabase   │      │  Cloudinary  │      │    SePay     │
       │              │      │              │      │              │
       │ Database     │      │ Media/File   │      │ Payment      │
       │ Auth/Data    │      │ Storage      │      │ Webhook      │
       └──────────────┘      └──────────────┘      └──────────────┘
```

The repository is split into independent frontend and backend applications.

---

# 🛠️ Tech Stack

## Frontend

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| React 18        | UI development                |
| TypeScript      | Type-safe development         |
| Vite            | Development and build tooling |
| React Router    | Client-side routing           |
| React Query     | Server-state management       |
| Tailwind CSS    | Styling                       |
| Radix UI        | Accessible UI primitives      |
| React Hook Form | Form management               |
| Zod             | Schema validation             |
| Framer Motion   | Animations                    |
| Three.js        | 3D/interactive visuals        |
| Recharts        | Data visualization            |
| TinyMCE         | Rich text editing             |
| Lucide React    | Icons                         |
| React Icons     | Icons                         |
| Sonner          | Toast notifications           |
| QRCode React    | QR code rendering             |
| jsPDF           | PDF generation                |
| XLSX            | Excel export                  |

The frontend uses Vite with React 18 and TypeScript and includes the listed UI, form, visualization and export libraries in its package configuration.

---

## Backend

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express            | REST API framework            |
| TypeScript         | Type-safe backend development |
| Supabase           | Database and backend services |
| Cloudinary         | Image/media management        |
| SePay              | Payment webhook integration   |
| Multer             | File upload handling          |
| Helmet             | HTTP security headers         |
| Express Rate Limit | API rate limiting             |
| CORS               | Cross-origin request handling |
| dotenv             | Environment configuration     |

The backend package explicitly includes Supabase, Cloudinary, SePay-related configuration, Helmet, rate limiting and Multer.

---

# 📁 Project Structure

```text
Market_Store/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── generate-sitemap.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   ├── cloudinary.ts
│   │   │   ├── productRoute.ts
│   │   │   ├── sepayRoute.ts
│   │   │   └── uploadRoute.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
├── LICENSE
└── README.md
```

The current repository contains separate `frontend` and `backend` applications; the frontend source is organized into components, contexts, hooks, libraries, pages, services, types and utilities, while the backend contains route modules for products, Cloudinary, uploads and SePay.

---

# ⚙️ Requirements

Before running the project, make sure you have:

* Node.js 18+
* npm
* Supabase project
* Cloudinary account
* SePay account/configuration for payment webhook
* Required environment variables

Both frontend and backend specify Node.js 18 or newer.

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/Vinh021203/Market_Store.git

cd Market_Store
```

---

# 🎨 Frontend Setup

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your frontend environment file according to the environment variables used by the application.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_API_URL=http://localhost:3000
```

> Use the exact variable names required by your current frontend configuration.

---

## Run Frontend

```bash
npm run dev
```

The Vite development server will provide the local URL in the terminal.

---

# ⚙️ Backend Setup

Open a second terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Example configuration:

```env
PORT=3000

SUPABASE_URL=your_supabase_url

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SEPAY_API_KEY=your_sepay_api_key

SEPAY_WEBHOOK_SECRET=your_sepay_webhook_secret
```

> The exact environment variable names should match the variables referenced by the current backend source.

---

# ▶️ Backend Development

Start the backend in development mode:

```bash
npm run dev
```

The current backend uses:

```bash
ts-node src/index.ts
```

for development.

---

# 🏗️ Backend Production Build

Compile TypeScript:

```bash
npm run build
```

This runs:

```bash
tsc
```

The generated JavaScript is placed in:

```text
dist/
```

Start the production server:

```bash
npm start
```

The production command runs:

```bash
node dist/index.js
```

These commands are defined in the backend `package.json`.

---

# 🧪 Type Checking

Run backend type checking:

```bash
npm run typecheck
```

For the frontend:

```bash
npm run typecheck
```

The frontend also provides:

```bash
npm run lint
```

and:

```bash
npm run test
```

The frontend package currently defines development, build, preview, test, formatting, typecheck and lint scripts.

---

# 📜 Available Commands

## Frontend

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start Vite development server                  |
| `npm run build`      | Build production frontend and generate sitemap |
| `npm run preview`    | Preview production build                       |
| `npm run test`       | Run Vitest                                     |
| `npm run format.fix` | Format source files                            |
| `npm run typecheck`  | Run TypeScript checking                        |
| `npm run lint`       | Run ESLint                                     |

## Backend

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Run backend with ts-node |
| `npm run build`     | Compile TypeScript       |
| `npm start`         | Start compiled backend   |
| `npm run clean`     | Remove build output      |
| `npm run typecheck` | Type-check backend       |

These scripts are taken from the current frontend and backend package configurations.

---

# 💳 Payment System

One of the main features of Market_Store is the integration of **VietQR payment through SePay**.

The backend contains a dedicated:

```text
backend/src/routes/sepayRoute.ts
```

route module for SePay integration.

## Payment Flow

```text
┌───────────────────┐
│     Customer      │
└─────────┬─────────┘
          │
          │ Checkout
          ▼
┌───────────────────┐
│      Order        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Payment Transaction│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│      VietQR       │
└─────────┬─────────┘
          │
          │ Bank Transfer
          ▼
┌───────────────────┐
│      SePay        │
└─────────┬─────────┘
          │
          │ Webhook
          ▼
┌───────────────────┐
│      Backend      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Verify Transaction │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Update Order       │
│ Payment Status     │
└───────────────────┘
```

This allows the application to automatically process an order after receiving the corresponding payment webhook.

---

# ☁️ Cloudinary

Cloudinary is used for media management.

The backend contains:

```text
backend/src/routes/cloudinary.ts
```

and:

```text
backend/src/routes/uploadRoute.ts
```

for Cloudinary/upload-related functionality.

Typical media flow:

```text
Admin
  │
  ▼
Upload Image
  │
  ▼
Backend
  │
  ▼
Cloudinary
  │
  ▼
Image URL
  │
  ▼
Database
```

This keeps uploaded media separate from the application server.

---

# 🗄️ Supabase

Supabase acts as the main backend data platform.

The backend includes:

```text
@supabase/supabase-js
```

and the frontend includes both:

```text
@supabase/supabase-js
@supabase/ssr
```

in its dependencies.

The project data model includes entities such as:

```text
profiles
products
carts
orders
order_items
payment_transactions
discounts
discount_users
discount_usage
downloads
blog_posts
blog_categories
blog_comments
chat_sessions
chat_messages
admin_notifications
reports
```

The existing project documentation describes an ERD containing approximately 20 related tables.

---

# 🔐 Authentication

The application uses authenticated user flows with JWT-based authorization.

The documented login flow is:

```text
Email + Password
       │
       ▼
Authentication
       │
       ▼
JWT
       │
       ▼
Authenticated Session
```

User and admin functionality are separated through role-based access.

---

# 👥 Roles

The system is designed around two primary actors:

```text
User
Admin
```

## User

Users can:

* Register
* Login
* Browse products
* Add products to cart
* Checkout
* Pay
* Download purchased products
* Write comments
* Chat with support
* Send contact requests

## Admin

Admins can:

* Manage products
* Manage orders
* Manage discounts
* Manage blog posts
* Moderate comments
* View reports
* Manage system settings
* Monitor payment transactions

These user/admin workflows are reflected in the project's existing frontend documentation.

---

# 🛒 Shopping Cart

The shopping cart is associated with the authenticated user.

Typical flow:

```text
Browse Product
      │
      ▼
Product Detail
      │
      ▼
Add To Cart
      │
      ▼
Cart
      │
      ├── Update Quantity
      ├── Remove Product
      └── Apply Discount
      │
      ▼
Checkout
```

The project documentation identifies `carts` as part of the core database model.

---

# 🎟️ Discount System

The marketplace includes a discount architecture based around:

```text
discounts
discount_users
discount_usage
```

The checkout process can therefore support:

* Discount validation
* User-specific discounts
* Usage tracking
* Final price calculation

---

# 📦 Order Management

An order is associated with:

```text
orders
order_items
payment_transactions
```

General order flow:

```text
Cart
 │
 ▼
Checkout
 │
 ▼
Create Order
 │
 ▼
Create Order Items
 │
 ▼
Create Payment Transaction
 │
 ▼
Payment
 │
 ▼
Payment Confirmation
 │
 ▼
Order Completed
```

---

# 📊 Reporting

The platform includes reporting functionality for the admin side.

The frontend includes:

* Recharts
* jsPDF
* jsPDF AutoTable
* XLSX

which provide the building blocks for dashboards, PDF reports and Excel exports.

Example reporting workflow:

```text
Database
   │
   ▼
Aggregate Data
   │
   ├───────────────┐
   │               │
   ▼               ▼
Dashboard        Report
   │               │
   │               ├── PDF
   │               └── Excel
   │
   ▼
Admin
```

---

# 🔒 Security

The backend includes several security-oriented dependencies:

* Helmet
* Express Rate Limit
* CORS
* Environment variables
* TypeScript
* Supabase authentication

These are declared in the backend package configuration.

## Environment Variables

Never commit:

```text
.env
.env.local
```

to GitHub.

Sensitive credentials include:

```text
SUPABASE_SERVICE_ROLE_KEY
CLOUDINARY_API_SECRET
SEPAY_API_KEY
SEPAY_WEBHOOK_SECRET
```

Never expose server-only credentials in frontend code.

---

# 🌐 CORS

The frontend and backend can be deployed separately.

For example:

```text
Frontend
https://your-store.vercel.app

        │
        │ HTTPS API
        ▼

Backend
https://your-api.vercel.app
```

Configure the backend CORS policy to allow only trusted frontend origins in production.

---

# 🚀 Deployment

## Frontend

The frontend includes a Vercel configuration and can be deployed as a Vite application.

Build:

```bash
cd frontend

npm install

npm run build
```

The build process also runs:

```bash
node generate-sitemap.js
```

after the Vite build.

---

## Backend

Build the backend:

```bash
cd backend

npm install

npm run build
```

Start:

```bash
npm start
```

The backend is configured to use:

```text
dist/index.js
```

as its production entry point.

---

# 🔗 Live Demo

The repository currently links to:

https://marketstore-two.vercel.app

---

# 📚 Project Documentation

The frontend repository currently contains documentation covering:

* Use Case diagrams
* User workflows
* Admin workflows
* Order and payment flow
* Product management
* Comment system
* Sequence diagrams
* Database ERD
* Payment activity flow

These materials can be useful when studying or presenting the project architecture.

---

# 🧩 Database Model

A simplified representation of the application data model:

```text
                    ┌──────────────┐
                    │   profiles   │
                    └──────┬───────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
          carts          orders        reviews
                           │
                    ┌──────┴───────┐
                    │              │
                    ▼              ▼
              order_items   payment_transactions
                    │
                    ▼
                 products
                    │
                    ▼
                downloads
```

Additional modules include:

```text
discounts
discount_users
discount_usage

blog_posts
blog_categories
blog_comments

chat_sessions
chat_messages
admin_notifications

reports
```

---

# 🧪 Testing

Frontend tests can be run with:

```bash
npm run test
```

The project uses **Vitest** for frontend test execution.

Type checking:

```bash
npm run typecheck
```

Linting:

```bash
npm run lint
```

---

# 📝 Code Quality

Recommended workflow before submitting changes:

```bash
npm run typecheck

npm run lint

npm run test

npm run build
```

For backend:

```bash
npm run typecheck

npm run build
```

---

# 📈 Future Improvements

Potential improvements for future versions include:

* [ ] Add comprehensive automated backend tests
* [ ] Add API documentation with OpenAPI / Swagger
* [ ] Improve payment reconciliation
* [ ] Add transaction idempotency
* [ ] Add more advanced product search
* [ ] Add inventory management
* [ ] Add product variants
* [ ] Add wishlist
* [ ] Add customer order tracking
* [ ] Add email notifications
* [ ] Add real-time chat with WebSocket
* [ ] Add advanced analytics
* [ ] Add automated CI/CD
* [ ] Add Docker support
* [ ] Add centralized logging
* [ ] Improve monitoring and observability

---

# 🤝 Contributing

Contributions are welcome.

## Development Workflow

```bash
git clone https://github.com/Vinh021203/Market_Store.git

cd Market_Store
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, then run the relevant checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add .

git commit -m "feat: describe your change"
```

Push:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📝 Commit Convention

Recommended commit prefixes:

```text
feat:      New feature
fix:       Bug fix
refactor:  Code refactoring
style:     UI/style changes
docs:      Documentation
chore:     Maintenance
perf:      Performance improvement
test:      Tests
```

Examples:

```bash
git commit -m "feat: add product filtering"

git commit -m "fix: handle sepay webhook validation"

git commit -m "feat: add discount management"

git commit -m "perf: optimize product queries"

git commit -m "docs: update deployment guide"
```

---

# 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for the complete license text.

---

# 👨‍💻 Author

**Vinh021203**

Web Developer & Digital Product Developer

### GitHub

[github.com/Vinh021203](https://github.com/Vinh021203)

### Portfolio

[vinhwork.io.vn](https://vinhwork.io.vn)

---

# 🔗 Repository

[GitHub — Vinh021203/Market_Store](https://github.com/Vinh021203/Market_Store)

### Live Demo

[marketstore-two.vercel.app](https://marketstore-two.vercel.app)

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**Market_Store**

Full-stack marketplace platform with React, Express, Supabase, Cloudinary and VietQR payment integration.
