# Sila BOS — Wholesale Business Operating System

A modern, high-performance Business Operating System (BOS) purpose-built for high-volume wholesale commerce, multi-tier godowns/warehouses, FBR POS digital invoicing, real-time Khata ledger bookkeeping, and tactile batch order creation.

---

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 1. Import Repository
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub / GitLab / Bitbucket repository.

### 2. Configure Environment Variables
In the Vercel Project Settings under **Environment Variables**, add:

| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production URL | `https://your-domain.vercel.app` |
| `JWT_SECRET` | Secret key for JWT authentication | `your-secure-random-32-char-string` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` (Neon / Supabase / Postgres) |
| `DIRECT_URL` | Direct connection string (Optional) | `postgresql://...` |

*(Note: If `DATABASE_URL` is omitted, the app operates gracefully with its built-in resilient in-memory database).*

### 3. Build & Output Settings
Vercel automatically detects Next.js:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` *(runs `prisma generate && next build`)*
- **Install Command**: `npm install`
- **Output Directory**: `.next`

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js 20+
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/sila-bos.git
cd sila-bos

# Install dependencies (automatically runs prisma generate)
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Key Capabilities & Architecture

- **Tactile Soft UI & Neumorphism**: Custom monochromatic depth lighting, raised tactile cards, and physics-driven interactive components.
- **Physics-Based Batch Swiper (`/new-order`)**: 5-item batch bundles, interactive card deck gestures (swipe right to add, left to skip), keyboard shortcuts (`A`/`D`/`W`/`Z`), live quantity controls, and real-time audio synthesis.
- **Triple-Entry Khata Ledger Engine**: Automatic invoice calculations, previous balance roll-forward, instant WhatsApp summary generation, and Excel/CSV exports.
- **Bilingual & Multi-Tenant**: Full dual-language localization (Urdu & English transliteration) with RTL layout handling.
- **Database Resilience**: Prisma ORM configured with PostgreSQL adapter (`@prisma/adapter-pg`) with automatic mock fallback for zero-configuration deployments.
- **Enterprise RBAC**: Role-based access control supporting `SUDO`, `ADMIN`, `SELLER`, `SOURCING_AGENT`, and `INVESTOR` tiers.

---

## 📜 Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Generate Prisma client and compile Next.js production build |
| `npm run lint` | Run ESLint static analysis |
| `npm start` | Run Next.js production server |
