# DASTA.GE — ULTIMATE SAAS PLATFORM PROMPT v1.0
## სრული პრომპტი — Frontend + Backend + ყველა Premium ფუნქცია

---

## 🎯 WHAT YOU ARE BUILDING

You are building **DASTA** (`dasta.ge`) — a production-ready, premium multi-tenant SaaS POS & business management platform built exclusively for Georgian businesses. The entire UI is in **Georgian language**. Currency is **Georgian Lari (₾)**. All dates use Georgian locale.

**Greenfield project.** Start from zero.

---

## ═══════════════════════════════
## PART 0 — TECH STACK & SETUP
## ═══════════════════════════════

### Installation

```bash
npx create-next-app@latest dasta --typescript --tailwind --app
cd dasta

# Core
npm install @supabase/supabase-js @supabase/ssr

# Payments
npm install stripe @stripe/stripe-js

# UI
npm install lucide-react framer-motion react-hot-toast
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs @radix-ui/react-select
npm install @radix-ui/react-switch @radix-ui/react-tooltip
npm install @radix-ui/react-popover @radix-ui/react-scroll-area
npm install cmdk

# Data / Forms
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install date-fns axios

# Charts
npm install recharts

# Excel
npm install xlsx

# PDF
npm install jspdf jspdf-autotable react-to-print

# Barcode
npm install @zxing/library react-barcode qrcode.react

# PWA
npm install next-pwa

# Utilities
npm install nanoid clsx tailwind-merge
```

### .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=sk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_WEBHOOK_SECRET=whsec_
RS_DEFAULT_SU=
RS_DEFAULT_SP=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ═══════════════════════════════
## PART 1 — DESIGN SYSTEM (CSS)
## ═══════════════════════════════

Create `app/globals.css` — implement EVERY line exactly:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ════════ DESIGN TOKENS ════════ */
:root {
  /* Brand — Green */
  --brand-50:#f0fdf4; --brand-100:#dcfce7; --brand-200:#bbf7d0;
  --brand-400:#4ade80; --brand-500:#22c55e; --brand-600:#16a34a;
  --brand-700:#15803d; --brand-800:#166534; --brand-900:#14532d;

  /* Grays */
  --gray-25:#fcfcfd; --gray-50:#f9fafb; --gray-100:#f3f4f6;
  --gray-200:#e5e7eb; --gray-300:#d1d5db; --gray-400:#9ca3af;
  --gray-500:#6b7280; --gray-600:#4b5563; --gray-700:#374151;
  --gray-800:#1f2937; --gray-900:#111827;

  /* Semantic */
  --success:#16a34a; --warning:#d97706; --danger:#dc2626; --info:#2563eb;

  /* Surfaces */
  --surface-0:#ffffff; --surface-1:#f9fafb; --surface-2:#f3f4f6;

  /* Sidebar — Dark Navy (matches existing design) */
  --sidebar-bg:#0f1724;
  --sidebar-border:#1e2d3d;
  --sidebar-item-hover:#1a2940;
  --sidebar-item-active-from:#166534;
  --sidebar-item-active-to:#15803d;
  --sidebar-text:#cbd5e1;
  --sidebar-text-muted:#64748b;

  /* Shadows */
  --shadow-xs:0 1px 2px 0 rgb(0 0 0/.05);
  --shadow-sm:0 1px 3px 0 rgb(0 0 0/.1),0 1px 2px -1px rgb(0 0 0/.1);
  --shadow-md:0 4px 6px -1px rgb(0 0 0/.1),0 2px 4px -2px rgb(0 0 0/.1);
  --shadow-lg:0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1);
  --shadow-xl:0 20px 25px -5px rgb(0 0 0/.15),0 8px 10px -6px rgb(0 0 0/.1);
  --shadow-brand:0 4px 14px 0 rgb(22 163 74/.35);

  /* Radius */
  --radius-sm:6px; --radius-md:10px; --radius-lg:14px;
  --radius-xl:20px; --radius-2xl:28px; --radius-full:9999px;

  /* Transitions */
  --t-fast:120ms cubic-bezier(.4,0,.2,1);
  --t-base:200ms cubic-bezier(.4,0,.2,1);
  --t-slow:300ms cubic-bezier(.4,0,.2,1);
  --t-spring:400ms cubic-bezier(.34,1.56,.64,1);
}

/* Dark mode */
[data-theme="dark"] {
  --surface-0:#111827; --surface-1:#0d1117; --surface-2:#1f2937;
  --gray-25:#1f2937; --gray-50:#1a2234; --gray-100:#243044;
  --gray-200:#2d3748; --gray-300:#3d4f6b;
  --gray-500:#9ca3af; --gray-600:#c1c9d2; --gray-700:#d1d9e0;
  --gray-800:#e5e9ef; --gray-900:#f3f5f7;
}

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
html { font-size:15px; scroll-behavior:smooth; }
body {
  font-family:'Noto Sans Georgian',system-ui,sans-serif;
  color:var(--gray-900); background:var(--surface-1);
  -webkit-font-smoothing:antialiased;
}
.mono { font-family:'JetBrains Mono',monospace; }

/* ════════ LAYOUT ════════ */
.dashboard-layout { display:grid; grid-template-columns:260px 1fr; min-height:100vh; }
.main-content { overflow-y:auto; height:100vh; padding:1.75rem 2rem; }
@media(max-width:1024px){
  .dashboard-layout{grid-template-columns:1fr;}
  .main-content{padding:1rem;}
}

/* ════════ SIDEBAR ════════ */
.sidebar {
  background:var(--sidebar-bg);
  border-right:1px solid var(--sidebar-border);
  height:100vh; position:sticky; top:0;
  display:flex; flex-direction:column;
  overflow-y:auto; scrollbar-width:none; z-index:40;
}
.sidebar::-webkit-scrollbar{display:none;}
.sidebar-logo {
  padding:1.25rem 1rem .75rem;
  display:flex; align-items:center; gap:.75rem;
  border-bottom:1px solid var(--sidebar-border);
}
.sidebar-logo-mark {
  width:38px; height:38px;
  background:linear-gradient(135deg,var(--brand-600),var(--brand-400));
  border-radius:10px; display:flex; align-items:center;
  justify-content:center; font-weight:900; font-size:1rem;
  color:white; box-shadow:var(--shadow-brand); flex-shrink:0;
  letter-spacing:-1px;
}
.sidebar-logo-text{color:white;font-weight:800;font-size:1.15rem;}
.sidebar-logo-plan{font-size:.6875rem;color:var(--brand-400);font-weight:500;}

.branch-switcher {
  margin:.75rem; padding:.625rem .875rem;
  background:var(--sidebar-item-hover); border:1px solid var(--sidebar-border);
  border-radius:var(--radius-lg); cursor:pointer;
  display:flex; align-items:center; justify-content:space-between;
  transition:all var(--t-fast); color:white;
}
.branch-switcher:hover{background:#253553;border-color:#2d4060;}
.branch-name{font-size:.875rem;font-weight:500;}
.branch-type{font-size:.6875rem;color:var(--gray-400);margin-top:1px;}

.sidebar-section{padding:.25rem .75rem .5rem;margin-top:.25rem;}
.sidebar-section-label{
  font-size:.625rem;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;color:var(--sidebar-text-muted);
  padding:0 .5rem;margin-bottom:.25rem;
}
.sidebar-item {
  display:flex;align-items:center;gap:.625rem;
  padding:.55rem .875rem;border-radius:var(--radius-md);
  cursor:pointer;transition:all var(--t-fast);
  color:var(--sidebar-text);font-size:.875rem;font-weight:400;
  text-decoration:none;border:none;background:transparent;width:100%;text-align:left;
}
.sidebar-item:hover{background:var(--sidebar-item-hover);color:white;}
.sidebar-item.active {
  background:linear-gradient(135deg,var(--sidebar-item-active-from),var(--sidebar-item-active-to));
  color:white;font-weight:600;box-shadow:0 2px 8px rgb(22 163 74/.3);
}
.sidebar-item .icon{width:18px;height:18px;flex-shrink:0;}
.sidebar-item .badge{
  margin-left:auto;background:var(--danger);color:white;
  border-radius:var(--radius-full);font-size:.625rem;
  font-weight:700;padding:1px 6px;min-width:18px;text-align:center;
}

/* ════════ TOPBAR ════════ */
.topbar {
  height:60px;background:var(--surface-0);
  border-bottom:1px solid var(--gray-200);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 1.5rem;gap:1rem;position:sticky;top:0;z-index:30;
}
.topbar-search {
  display:flex;align-items:center;gap:.5rem;
  background:var(--gray-50);border:1px solid var(--gray-200);
  border-radius:var(--radius-lg);padding:.5rem .875rem;
  flex:1;max-width:400px;cursor:pointer;transition:all var(--t-fast);
}
.topbar-search:hover{border-color:var(--brand-400);background:white;}
.topbar-search span{font-size:.8125rem;color:var(--gray-400);}
.topbar-search kbd{
  margin-left:auto;background:var(--gray-200);border-radius:4px;
  padding:1px 5px;font-size:.625rem;color:var(--gray-500);
  font-family:'JetBrains Mono',monospace;
}
.topbar-actions{display:flex;align-items:center;gap:.5rem;}
.topbar-btn{
  width:36px;height:36px;border-radius:var(--radius-md);
  display:flex;align-items:center;justify-content:center;
  background:transparent;border:none;cursor:pointer;
  color:var(--gray-500);transition:all var(--t-fast);position:relative;
}
.topbar-btn:hover{background:var(--gray-100);color:var(--gray-700);}
.topbar-btn .notif-dot{
  position:absolute;top:6px;right:6px;
  width:8px;height:8px;background:var(--danger);border-radius:50%;
  border:2px solid white;
}

/* ════════ PAGE HEADER ════════ */
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
.page-title{font-size:1.375rem;font-weight:700;color:var(--gray-900);}
.page-subtitle{font-size:.8125rem;color:var(--gray-500);margin-top:2px;}

/* ════════ STAT CARDS ════════ */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){.stats-grid{grid-template-columns:1fr;}}
.stat-card {
  background:var(--surface-0);border:1px solid var(--gray-200);
  border-radius:var(--radius-xl);padding:1.25rem 1.5rem;
  box-shadow:var(--shadow-sm);position:relative;overflow:hidden;
  transition:all var(--t-base);
}
.stat-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}
.stat-card-label{font-size:.75rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--gray-500);margin-bottom:.375rem;}
.stat-card-value{font-size:1.75rem;font-weight:800;color:var(--gray-900);line-height:1;}
.stat-card-sub{font-size:.8125rem;color:var(--gray-500);margin-top:.375rem;}
.stat-card-sub.up{color:var(--success);}
.stat-card-sub.down{color:var(--danger);}
.stat-card-icon{
  position:absolute;right:1.25rem;top:1.25rem;
  width:40px;height:40px;border-radius:var(--radius-lg);
  display:flex;align-items:center;justify-content:center;
  font-size:1.25rem;
}

/* Skeleton */
.skeleton {
  background:linear-gradient(90deg,var(--gray-100) 25%,var(--gray-50) 50%,var(--gray-100) 75%);
  background-size:200% 100%;
  animation:shimmer 1.5s infinite;
  border-radius:var(--radius-md);
}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ════════ CARDS ════════ */
.card{background:var(--surface-0);border:1px solid var(--gray-200);border-radius:var(--radius-xl);padding:1.5rem;box-shadow:var(--shadow-sm);}
.card-sm{background:var(--surface-0);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-xs);}

/* ════════ BUTTONS ════════ */
.btn{display:inline-flex;align-items:center;gap:.375rem;border:none;border-radius:var(--radius-md);font-weight:500;cursor:pointer;transition:all var(--t-fast);font-family:inherit;text-decoration:none;white-space:nowrap;}
.btn-sm{padding:.375rem .75rem;font-size:.8125rem;}
.btn-md{padding:.5625rem 1rem;font-size:.875rem;}
.btn-lg{padding:.75rem 1.5rem;font-size:1rem;}
.btn-primary{background:var(--brand-600);color:white;box-shadow:var(--shadow-brand);}
.btn-primary:hover{background:var(--brand-700);}
.btn-secondary{background:var(--surface-0);color:var(--gray-700);border:1px solid var(--gray-300);}
.btn-secondary:hover{background:var(--gray-50);border-color:var(--gray-400);}
.btn-danger{background:var(--danger);color:white;}
.btn-danger:hover{background:#b91c1c;}
.btn-ghost{background:transparent;color:var(--gray-600);}
.btn-ghost:hover{background:var(--gray-100);}

/* ════════ TABLE ════════ */
.table-container{background:var(--surface-0);border:1px solid var(--gray-200);border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-sm);}
.table{width:100%;border-collapse:collapse;}
.table th{padding:.75rem 1rem;text-align:left;font-size:.75rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--gray-500);background:var(--gray-50);border-bottom:1px solid var(--gray-200);}
.table td{padding:.875rem 1rem;border-bottom:1px solid var(--gray-100);font-size:.875rem;color:var(--gray-700);}
.table tr:last-child td{border-bottom:none;}
.table tr:hover td{background:var(--gray-25);}

/* ════════ BADGES ════════ */
.badge{display:inline-flex;align-items:center;gap:.25rem;padding:.25rem .625rem;border-radius:var(--radius-full);font-size:.6875rem;font-weight:600;letter-spacing:.3px;}
.badge-green{background:#dcfce7;color:#166534;}
.badge-red{background:#fee2e2;color:#991b1b;}
.badge-amber{background:#fef3c7;color:#92400e;}
.badge-blue{background:#dbeafe;color:#1e40af;}
.badge-gray{background:#f3f4f6;color:#374151;}
.badge-purple{background:#ede9fe;color:#5b21b6;}

/* ════════ FORMS ════════ */
.form-label{display:block;font-size:.8125rem;font-weight:600;color:var(--gray-700);margin-bottom:.375rem;}
.form-input{
  width:100%;padding:.5625rem .875rem;
  border:1.5px solid var(--gray-300);border-radius:var(--radius-md);
  background:var(--surface-0);color:var(--gray-900);
  font-size:.875rem;font-family:inherit;transition:all var(--t-fast);
}
.form-input:focus{outline:none;border-color:var(--brand-500);box-shadow:0 0 0 3px rgb(34 197 94/.12);}
.form-input::placeholder{color:var(--gray-400);}
.form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center;background-size:16px;padding-right:2.5rem;}
.form-group{display:flex;flex-direction:column;gap:.375rem;}

/* ════════ MODAL ════════ */
.modal-overlay{position:fixed;inset:0;background:rgb(0 0 0/.5);z-index:50;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(2px);}
.modal{background:var(--surface-0);border-radius:var(--radius-2xl);box-shadow:var(--shadow-xl);width:100%;max-height:90vh;overflow-y:auto;}
.modal-sm{max-width:400px;}
.modal-md{max-width:600px;}
.modal-lg{max-width:800px;}
.modal-xl{max-width:1000px;}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:1.5rem;border-bottom:1px solid var(--gray-200);}
.modal-body{padding:1.5rem;}
.modal-footer{padding:1rem 1.5rem;border-top:1px solid var(--gray-200);display:flex;justify-content:flex-end;gap:.75rem;}

/* ════════ POS ════════ */
.pos-layout{display:grid;grid-template-columns:1fr 380px;height:calc(100vh - 60px);overflow:hidden;}
.pos-products{overflow-y:auto;padding:1rem;background:var(--surface-1);}
.pos-cart{display:flex;flex-direction:column;background:var(--surface-0);border-left:1px solid var(--gray-200);}
.product-tile{background:var(--surface-0);border:1.5px solid var(--gray-200);border-radius:var(--radius-xl);padding:1rem;cursor:pointer;transition:all var(--t-fast);display:flex;flex-direction:column;gap:.5rem;position:relative;overflow:hidden;}
.product-tile:hover{border-color:var(--brand-400);box-shadow:var(--shadow-md);transform:translateY(-2px);}
.product-tile:active{transform:scale(.97);}
.product-tile.out-of-stock{opacity:.5;cursor:not-allowed;}
.product-tile.low-stock::after{content:'⚠';position:absolute;top:.5rem;right:.5rem;font-size:.75rem;}
.product-tile-name{font-size:.875rem;font-weight:600;color:var(--gray-800);line-height:1.3;}
.product-tile-price{font-size:1.1rem;font-weight:800;color:var(--brand-600);}
.product-tile-stock{font-size:.6875rem;color:var(--gray-400);}
.cart-item{display:flex;align-items:center;gap:.75rem;padding:.75rem;border-bottom:1px solid var(--gray-100);}
.cart-qty-btn{width:28px;height:28px;border-radius:var(--radius-md);border:1.5px solid var(--gray-300);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--gray-600);transition:all var(--t-fast);}
.cart-qty-btn:hover{background:var(--gray-100);border-color:var(--gray-400);}
.cart-total-section{padding:1rem;border-top:2px solid var(--gray-200);margin-top:auto;}
.checkout-btn{width:100%;padding:.875rem;background:linear-gradient(135deg,var(--brand-600),var(--brand-500));color:white;border:none;border-radius:var(--radius-xl);font-size:1rem;font-weight:700;cursor:pointer;box-shadow:var(--shadow-brand);transition:all var(--t-base);font-family:inherit;}
.checkout-btn:hover{background:linear-gradient(135deg,var(--brand-700),var(--brand-600));box-shadow:0 6px 20px rgb(22 163 74/.4);}
.checkout-btn:disabled{opacity:.5;cursor:not-allowed;box-shadow:none;}

/* ════════ BARCODE SCANNER ════════ */
.scanner-overlay{position:fixed;inset:0;z-index:60;background:rgb(0 0 0/.9);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;}
.scanner-frame{width:300px;height:200px;position:relative;border-radius:12px;overflow:hidden;box-shadow:0 0 0 2px #22c55e,0 0 0 4px rgb(34 197 94/.2);}
.scanner-frame video{width:100%;height:100%;object-fit:cover;}
.scanner-line{position:absolute;left:0;right:0;height:2px;background:#22c55e;box-shadow:0 0 10px #22c55e;animation:scanLine 2s ease-in-out infinite;}
@keyframes scanLine{0%,100%{top:8%}50%{top:80%}}

/* ════════ COMMAND PALETTE ════════ */
.cmd-overlay{position:fixed;inset:0;z-index:70;background:rgb(0 0 0/.5);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding-top:15vh;}
.cmd-palette{background:var(--surface-0);border-radius:var(--radius-2xl);box-shadow:var(--shadow-xl);width:100%;max-width:600px;overflow:hidden;border:1px solid var(--gray-200);}
.cmd-input{width:100%;padding:1rem 1.25rem;border:none;font-size:1rem;color:var(--gray-900);background:transparent;outline:none;font-family:inherit;border-bottom:1px solid var(--gray-200);}
.cmd-results{max-height:380px;overflow-y:auto;}
.cmd-result-item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.25rem;cursor:pointer;transition:background var(--t-fast);}
.cmd-result-item:hover,.cmd-result-item.selected{background:var(--gray-50);}
.cmd-group-label{padding:.5rem 1.25rem;font-size:.6875rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gray-400);background:var(--gray-25);}

/* ════════ RECEIPT PRINT ════════ */
@media print{
  .no-print,.sidebar,.topbar,.pos-products{display:none!important;}
  body{background:white;}
  .receipt{width:80mm;margin:0 auto;font-family:monospace;font-size:11px;}
  .receipt-header{text-align:center;margin-bottom:8px;border-bottom:1px dashed #000;padding-bottom:8px;}
  .receipt-item{display:flex;justify-content:space-between;padding:2px 0;}
  .receipt-total{border-top:1px dashed #000;margin-top:8px;padding-top:8px;font-weight:bold;}
  .receipt-footer{text-align:center;margin-top:8px;border-top:1px dashed #000;padding-top:8px;font-size:10px;}
}

/* ════════ ANIMATIONS ════════ */
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.animate-fade{animation:fadeIn var(--t-slow) both;}
.animate-slide{animation:slideIn var(--t-base) both;}
.animate-scale{animation:scaleIn var(--t-spring) both;}

/* ════════ DARK MODE ════════ */
[data-theme="dark"] .card,
[data-theme="dark"] .modal,
[data-theme="dark"] .topbar,
[data-theme="dark"] .table-container{background:var(--gray-800);border-color:var(--gray-700);}
[data-theme="dark"] .table th{background:var(--gray-700);}
[data-theme="dark"] .form-input{background:var(--gray-800);border-color:var(--gray-600);color:var(--gray-100);}
[data-theme="dark"] .btn-secondary{background:var(--gray-700);color:var(--gray-100);border-color:var(--gray-600);}
```

---

## ═══════════════════════════════
## PART 2 — DATABASE SCHEMA (Supabase)
## ═══════════════════════════════

Copy to Supabase SQL Editor and run:

```sql
-- ════════════════════════════
-- DASTA.GE — Supabase Schema
-- ════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── ENUMS ──────────────────────────────────────────────────────
CREATE TYPE plan_type AS ENUM ('free','starter','pro','enterprise');
CREATE TYPE company_role AS ENUM ('owner','admin','accountant');
CREATE TYPE branch_role AS ENUM ('manager','cashier','viewer');
CREATE TYPE waybill_type AS ENUM ('1','2','3','4','5','6','7');
CREATE TYPE waybill_status AS ENUM ('draft','sent','confirmed','deleted');
CREATE TYPE invoice_status AS ENUM ('draft','sent','confirmed','deleted');
CREATE TYPE po_status AS ENUM ('draft','ordered','partial','received','cancelled');
CREATE TYPE tx_type AS ENUM ('income','expense');
CREATE TYPE cash_move_type AS ENUM ('in','out');
CREATE TYPE transfer_status AS ENUM ('pending','approved','rejected','completed');
CREATE TYPE return_reason AS ENUM ('defective','wrong_item','customer_request','other');

-- ── COMPANIES (Tenants) ──────────────────────────────────────
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tin TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  plan plan_type DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BRANCHES ─────────────────────────────────────────────────
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_main BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BRANCH SETTINGS (rs.ge credentials etc.) ─────────────────
CREATE TABLE branch_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID UNIQUE REFERENCES branches(id) ON DELETE CASCADE,
  rs_service_user TEXT,
  rs_service_password TEXT,
  vat_rate NUMERIC(5,2) DEFAULT 18,
  currency TEXT DEFAULT 'GEL',
  receipt_header TEXT,
  receipt_footer TEXT,
  low_stock_threshold INT DEFAULT 5,
  onboarding_done BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── USERS (Supabase Auth extension) ──────────────────────────
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── COMPANY USERS (cross-company roles) ──────────────────────
CREATE TABLE company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role company_role DEFAULT 'admin',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- ── BRANCH USERS ──────────────────────────────────────────────
CREATE TABLE branch_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role branch_role DEFAULT 'cashier',
  UNIQUE(branch_id, user_id)
);

-- ── CATEGORIES ────────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#16a34a',
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUCTS ──────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  description TEXT,
  image_url TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  price_wholesale NUMERIC(12,2),
  price_vip NUMERIC(12,2),
  cost_price NUMERIC(12,2) DEFAULT 0,
  min_sale_price NUMERIC(12,2),
  vat_rate NUMERIC(5,2) DEFAULT 18,
  stock NUMERIC(12,3) DEFAULT 0,
  min_stock NUMERIC(12,3) DEFAULT 5,
  unit TEXT DEFAULT 'ც',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX products_branch_idx ON products(branch_id);
CREATE INDEX products_barcode_idx ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX products_name_trgm ON products USING gin(name gin_trgm_ops);

-- ── CUSTOMERS ─────────────────────────────────────────────────
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  tin TEXT,
  address TEXT,
  customer_type TEXT DEFAULT 'retail',
  loyalty_points INT DEFAULT 0,
  balance NUMERIC(12,2) DEFAULT 0,
  total_purchases NUMERIC(12,2) DEFAULT 0,
  purchase_count INT DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUPPLIERS ─────────────────────────────────────────────────
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tin TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  balance NUMERIC(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CASH REGISTERS ────────────────────────────────────────────
CREATE TABLE cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'მთავარი სალარო',
  device_ip TEXT,
  device_port INT,
  is_active BOOLEAN DEFAULT TRUE
);

-- ── CASH SESSIONS ─────────────────────────────────────────────
CREATE TABLE cash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  register_id UUID REFERENCES cash_registers(id),
  opened_by UUID REFERENCES auth.users(id),
  closed_by UUID REFERENCES auth.users(id),
  opening_cash NUMERIC(12,2) DEFAULT 0,
  closing_cash NUMERIC(12,2),
  expected_cash NUMERIC(12,2),
  difference NUMERIC(12,2),
  total_sales NUMERIC(12,2) DEFAULT 0,
  total_cash NUMERIC(12,2) DEFAULT 0,
  total_card NUMERIC(12,2) DEFAULT 0,
  total_transfer NUMERIC(12,2) DEFAULT 0,
  receipt_count INT DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'open',
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- ── CASH MOVEMENTS ────────────────────────────────────────────
CREATE TABLE cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES cash_sessions(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  type cash_move_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SALES ─────────────────────────────────────────────────────
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  session_id UUID REFERENCES cash_sessions(id),
  customer_id UUID REFERENCES customers(id),
  receipt_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) DEFAULT 0,
  discount_type TEXT DEFAULT 'fixed',
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  loyalty_points_used INT DEFAULT 0,
  loyalty_points_earned INT DEFAULT 0,
  promo_code_id UUID,
  notes TEXT,
  is_return BOOLEAN DEFAULT FALSE,
  return_of UUID REFERENCES sales(id),
  return_reason return_reason,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX sales_branch_idx ON sales(branch_id);
CREATE INDEX sales_created_at_idx ON sales(created_at);
-- Receipt number generator
CREATE SEQUENCE receipt_number_seq START 1000;
CREATE OR REPLACE FUNCTION generate_receipt_number() RETURNS TEXT AS $$
BEGIN RETURN 'RC-' || LPAD(nextval('receipt_number_seq')::TEXT, 6, '0'); END;
$$ LANGUAGE plpgsql;
ALTER TABLE sales ALTER COLUMN receipt_number SET DEFAULT generate_receipt_number();

-- ── SALE ITEMS ────────────────────────────────────────────────
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity NUMERIC(12,3) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  cost_price NUMERIC(12,2),
  discount NUMERIC(12,2) DEFAULT 0,
  vat_rate NUMERIC(5,2) DEFAULT 18,
  total NUMERIC(12,2) NOT NULL
);

-- ── PURCHASE ORDERS ───────────────────────────────────────────
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status po_status DEFAULT 'draft',
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  invoice_number TEXT,
  expected_date DATE,
  received_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE SEQUENCE po_number_seq START 1000;
ALTER TABLE purchase_orders ALTER COLUMN order_number SET DEFAULT 'PO-' || LPAD(nextval('po_number_seq')::TEXT, 6, '0');

-- ── PO ITEMS ──────────────────────────────────────────────────
CREATE TABLE po_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL,
  received_qty NUMERIC(12,3) DEFAULT 0,
  unit_cost NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL
);

-- ── STOCK ADJUSTMENTS ─────────────────────────────────────────
CREATE TABLE inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity_before NUMERIC(12,3),
  quantity_change NUMERIC(12,3) NOT NULL,
  quantity_after NUMERIC(12,3),
  reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── STOCK TRANSFERS ───────────────────────────────────────────
CREATE TABLE stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_branch_id UUID REFERENCES branches(id),
  to_branch_id UUID REFERENCES branches(id),
  status transfer_status DEFAULT 'pending',
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE stock_transfer_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID REFERENCES stock_transfers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL
);

-- ── ACCOUNTING / TRANSACTIONS ─────────────────────────────────
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  type tx_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  reference TEXT,
  sale_id UUID REFERENCES sales(id),
  po_id UUID REFERENCES purchase_orders(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RS.GE WAYBILLS ────────────────────────────────────────────
CREATE TABLE waybills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  rs_number TEXT,
  type waybill_type DEFAULT '1',
  status waybill_status DEFAULT 'draft',
  buyer_tin TEXT,
  buyer_name TEXT,
  start_address TEXT,
  end_address TEXT,
  transportation_cost NUMERIC(12,2) DEFAULT 0,
  driver_tin TEXT,
  car_number TEXT,
  total NUMERIC(12,2) DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waybill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waybill_id UUID REFERENCES waybills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  unit_id INT DEFAULT 1,
  barcode TEXT
);

-- ── RS.GE INVOICES ────────────────────────────────────────────
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  rs_number TEXT,
  status invoice_status DEFAULT 'draft',
  buyer_tin TEXT,
  buyer_name TEXT,
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  comment TEXT,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  vat_rate NUMERIC(5,2) DEFAULT 18,
  total NUMERIC(12,2) NOT NULL
);

-- ── LOYALTY / GIFT CARDS ──────────────────────────────────────
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  code TEXT UNIQUE NOT NULL,
  initial_amount NUMERIC(12,2) NOT NULL,
  remaining_amount NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROMO CODES ───────────────────────────────────────────────
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  code TEXT NOT NULL,
  type TEXT DEFAULT 'percentage',
  value NUMERIC(12,2) NOT NULL,
  min_purchase NUMERIC(12,2) DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  expires_at DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── HAPPY HOURS ───────────────────────────────────────────────
CREATE TABLE happy_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name TEXT NOT NULL,
  discount_percent NUMERIC(5,2) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INT[] DEFAULT '{1,2,3,4,5}',
  is_active BOOLEAN DEFAULT TRUE
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── AUDIT LOG ─────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DAILY STATS CACHE ─────────────────────────────────────────
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales NUMERIC(12,2) DEFAULT 0,
  total_expenses NUMERIC(12,2) DEFAULT 0,
  receipt_count INT DEFAULT 0,
  customer_count INT DEFAULT 0,
  avg_sale NUMERIC(12,2) DEFAULT 0,
  UNIQUE(branch_id, date)
);

-- ══════════════════════════════════════════════
-- ROW LEVEL SECURITY (Multi-tenant isolation)
-- ══════════════════════════════════════════════
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waybills ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: returns branch IDs user has access to
CREATE OR REPLACE FUNCTION get_my_branch_ids()
RETURNS UUID[] LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN ARRAY(
    SELECT b.id FROM branches b
    JOIN branch_users bu ON bu.branch_id = b.id
    WHERE bu.user_id = auth.uid()
    UNION
    SELECT b.id FROM branches b
    JOIN company_users cu ON cu.company_id = b.company_id
    WHERE cu.user_id = auth.uid()
  );
END;
$$;

CREATE POLICY "branch_isolation" ON products USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON customers USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON sales USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON sale_items USING (
  sale_id IN (SELECT id FROM sales WHERE branch_id = ANY(get_my_branch_ids()))
);
CREATE POLICY "branch_isolation" ON purchase_orders USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON transactions USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON waybills USING (branch_id = ANY(get_my_branch_ids()));
CREATE POLICY "branch_isolation" ON invoices USING (branch_id = ANY(get_my_branch_ids()));

-- ══════════════════════════════════════════════
-- TRIGGERS — Automation
-- ══════════════════════════════════════════════

-- Auto-deduct stock on sale
CREATE OR REPLACE FUNCTION deduct_stock_on_sale() RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_deduct_stock AFTER INSERT ON sale_items
FOR EACH ROW EXECUTE FUNCTION deduct_stock_on_sale();

-- Auto-restore stock on return
CREATE OR REPLACE FUNCTION restore_stock_on_return() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_return = TRUE THEN
    UPDATE products p SET stock = stock + si.quantity
    FROM sale_items si WHERE si.sale_id = NEW.return_of AND si.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_restore_stock AFTER INSERT ON sales
FOR EACH ROW EXECUTE FUNCTION restore_stock_on_return();

-- Add stock on PO received
CREATE OR REPLACE FUNCTION add_stock_on_po_received() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'received' AND OLD.status != 'received' THEN
    UPDATE products p SET stock = stock + pi.quantity
    FROM po_items pi WHERE pi.po_id = NEW.id AND pi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_po_received AFTER UPDATE ON purchase_orders
FOR EACH ROW EXECUTE FUNCTION add_stock_on_po_received();

-- Update customer stats on sale
CREATE OR REPLACE FUNCTION update_customer_stats() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL AND NEW.is_return = FALSE THEN
    UPDATE customers SET
      total_purchases = total_purchases + NEW.total,
      purchase_count = purchase_count + 1,
      loyalty_points = loyalty_points + NEW.loyalty_points_earned
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_customer_stats AFTER INSERT ON sales
FOR EACH ROW EXECUTE FUNCTION update_customer_stats();
```

---

## ═══════════════════════════════
## PART 3 — PROJECT STRUCTURE
## ═══════════════════════════════

```
dasta/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (marketing)/
│   │   └── page.tsx              ← Landing page
│   ├── (dashboard)/
│   │   └── [branchId]/
│   │       ├── layout.tsx        ← Sidebar + Topbar
│   │       ├── page.tsx          ← Dashboard
│   │       ├── pos/page.tsx
│   │       ├── inventory/page.tsx
│   │       ├── categories/page.tsx
│   │       ├── sales/page.tsx
│   │       ├── purchases/page.tsx
│   │       ├── customers/page.tsx
│   │       ├── suppliers/page.tsx
│   │       ├── waybills/page.tsx
│   │       ├── invoices/page.tsx
│   │       ├── accounting/page.tsx
│   │       ├── cash-register/page.tsx
│   │       ├── transfers/page.tsx
│   │       ├── adjustments/page.tsx
│   │       ├── alerts/page.tsx
│   │       ├── reports/page.tsx
│   │       ├── audit-log/page.tsx
│   │       ├── rsge/page.tsx
│   │       └── settings/page.tsx
│   ├── company/
│   │   ├── page.tsx              ← Owner dashboard
│   │   ├── branches/page.tsx
│   │   ├── users/page.tsx
│   │   └── billing/page.tsx
│   ├── onboarding/page.tsx
│   └── api/
│       ├── rs-ge/
│       │   ├── waybill/save/route.ts
│       │   ├── waybill/send/route.ts
│       │   ├── waybill/list/route.ts
│       │   ├── invoice/save/route.ts
│       │   └── tin/[tin]/route.ts
│       ├── excel/export/route.ts
│       └── backup/route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── rs-ge/
│   │   ├── soap-client.ts
│   │   ├── waybill.ts
│   │   └── invoice.ts
│   ├── excel.ts
│   ├── pdf.ts
│   ├── utils.ts
│   └── constants.ts
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── BranchSwitcher.tsx
│   ├── ui/
│   │   ├── Skeleton.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── TinInput.tsx
│   │   └── StatusBadge.tsx
│   └── pos/
│       ├── CartPanel.tsx
│       ├── ProductGrid.tsx
│       └── PaymentModal.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── BranchContext.tsx
├── hooks/
│   └── useRsGe.ts
└── middleware.ts
```

---

## ═══════════════════════════════
## PART 4 — SUPABASE CLIENTS
## ═══════════════════════════════

**lib/supabase/client.ts**
```typescript
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**lib/supabase/server.ts**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createClient = () => {
  const c = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get:(n)=>c.get(n)?.value, set:(n,v,o)=>c.set({name:n,value:v,...o}), remove:(n,o)=>c.set({name:n,value:'',...o}) } }
  )
}
```

**middleware.ts** — protect all /[branchId]/ routes, redirect to /login if no session. On auth, set x-branch-id and x-company-id request headers.

---

## ═══════════════════════════════
## PART 5 — AUTH PAGES
## ═══════════════════════════════

### Register (3-step wizard):
**Step 1 — ანგარიში:** სახელი, Email, პაროლი, პაროლის დადასტურება  
**Step 2 — კომპანია:** კომპანიის სახელი, TIN (optional), ტელ. ნომერი, slug (auto-generated from name)  
**Step 3 — ფილიალი:** ფილიალის სახელი, მისამართი  
→ Creates company + branch + branch_settings + redirects to /onboarding  

### Login: Email + პაროლი. "პაროლი დამავიწყდა" ბმული. Supabase signIn.  
### Forgot Password: Email input → Supabase resetPasswordForEmail.  

All auth pages: centered card, DASTA logo, Georgian text, green brand color.

---

## ═══════════════════════════════
## PART 6 — SIDEBAR & NAVIGATION
## ═══════════════════════════════

Sidebar structure with **dark navy background (#0f1724)**, green active state, Georgian labels:

```
DASTA logo mark (D) + "DASTA" + plan badge

[Branch Switcher dropdown]

── მთავარი ──
📊 დაფა              → /[branchId]
🖥️ საკასო (POS)      → /[branchId]/pos

── ინვენტარი ──
📦 პროდუქტები        → /[branchId]/inventory
🏷️ კატეგორიები       → /[branchId]/categories
📋 შეძენები          → /[branchId]/purchases
🔄 გადაცემები        → /[branchId]/transfers
⚙️ კორექციები        → /[branchId]/adjustments
🚨 მარაგის გაფრთხ.   → /[branchId]/alerts   [badge: count]

── გაყიდვები ──
🧾 გაყიდვები         → /[branchId]/sales
👥 კლიენტები         → /[branchId]/customers
💰 საკასო სმენი      → /[branchId]/cash-register

── ბუღალტერია ──
📈 ბუღალტერია        → /[branchId]/accounting
📊 ანგარიშები        → /[branchId]/reports

── RS.GE ──
🚚 ზედნადებები       → /[branchId]/waybills
🧾 ფაქტურები         → /[branchId]/invoices
🔗 RS.GE კავშირი     → /[branchId]/rsge

── სისტემა ──
👤 მიმწოდებლები      → /[branchId]/suppliers
🏢 კომპანია          → /company
📋 აუდიტი            → /[branchId]/audit-log
⚙️ პარამეტრები       → /[branchId]/settings
```

---

## ═══════════════════════════════
## PART 7 — ALL DASHBOARD PAGES
## ═══════════════════════════════

### A) MAIN DASHBOARD
Stats: გაყიდვები დღეს | ჩეკები | საშ. ჩეკი | მოგება  
Quick actions row: [+ გაყიდვა] [+ ზედნადები] [+ პროდუქტი] [+ შეძენა]  
Recharts LineChart (7-day sales) + PieChart (sales by category)  
Debt Dashboard cards: კლიენტების ვალი (green) + ჩვენი ვალი მომწოდ. (red)  
Recent sales table (last 10)  
Low stock alerts (top 5 products)  
Supabase Realtime subscription on sales + notifications  

### B) POS PAGE
Split layout: products grid (left) + cart (right)  
Search bar with barcode scanner button (F2)  
Category filter tabs  
Product tiles: name, price, stock badge, color-coded  
Cart: items with +/- qty, delete, running total  
Discount: fixed ₾ or %  
Promo code input field  
Loyalty points display + redeem option  
Gift card input  
Payment modal: ნაღდი | ბარათი | გადარიცხვა | შერეული  
Change calculator (for cash)  
Printable receipt with company header, VAT breakdown, "გმადლობთ!"  
Keyboard shortcuts: F1=clear, F2=scanner, F4=customer, Enter=checkout, Esc=close  
Mobile: cart slides in from right  

### C) INVENTORY PAGE
Stats: სულ პროდუქტი | დაბალი მარაგი | ჯამური ღირებულება | ჯამური საცალო  
Filters: search, category, stock status (ყველა/დაბ.მარ./ამოწ.)  
Table: სახელი | SKU | ბარკოდი | კატეგ. | ფასი | მარ. ფასი | მარაგი | სტატუსი | ✏️🗑  
Barcode scanner button in search bar  
Product modal: ყველა ველი (name, sku, barcode, category, price_retail/wholesale/vip, cost, min_price, stock, min_stock, unit, vat, image_url)  
Excel import: drag&drop → preview table → column mapping → import  
Excel export: download all products  
Template download: blank Excel with Georgian headers  

### D) SALES HISTORY
Table: ჩეკი | კლიენტი | გადახდა | სულ | თარიღი | მოქმედება  
Filters: date range, payment method, customer  
View receipt modal  
Return/Refund: item selection, qty input, reason, negative receipt (RT-XXXXXX prefix)  
Excel export  

### E) PURCHASES
Stats: ამ თვე | გადაუხდელი | ჩამოსული | მომლოდინე  
Table with status badges: მუსვერი(gray) | შეკვეთილი(blue) | ნაწილობ.(amber) | მიღებული(green) | გაუქმ.(red)  
3-step new order modal: მომწოდებელი → პროდუქტები → დადასტურება  
Detail modal with "მარკირება მიღებულად" → updates stock  

### F) CASH REGISTER
State A (closed): last session summary + opening cash input + open button  
State B (open): live timer, cash/card totals, receipt count  
Cash movements: in/out with description  
Close session modal: expected vs actual cash, difference highlight  
End of Day Report: printable, 80mm style, top 5 products, payment breakdown  

### G) ACCOUNTING
4 tabs: ისტორია | შემოსავალი | ხარჯები | ანგარიში  
5th tab: დღგ — monthly VAT report (sales VAT - purchases VAT = payable)  
P&L tab: income breakdown, expense breakdown, net profit, margin %, Excel+PDF export  
VAT Excel export: 3 sheets (შეჯამება, გაყიდვ.დღგ, შეძ.დღგ)  
Bar chart (Recharts) for income, Pie chart for expenses  

### H) WAYBILLS
Table: RS# | ტიპი | სტატუსი | მყიდველი | ჯამი | თარიღი  
Status: draft(gray) | sent(blue) | confirmed(green) | deleted(red)  
New waybill form: TIN auto-lookup (calls rs.ge API), goods list, [💾 შენახვა] [⬆️ rs.ge-ზე]  
Send to rs.ge button: disabled until saved  

### I) INVOICES
Similar to waybills. Includes VAT calculation (18% default).  
[⬆️ rs.ge-ზე ატვირთვა] button  

### J) CUSTOMERS
Table: სახელი | ტელ. | TIN | ტიპი | ქულები | ვალი | ✏️  
Customer type: საცალო / საბითუმო / VIP → determines which price to use in POS  
Debt filter: "💰 ვალიანები" button  
Balance column: green if they owe us, red if we owe them  
Customer detail: purchase history, loyalty points, edit  

### K) SUPPLIERS
Table with balance column (red if we owe them)  
Links to purchase orders by supplier  

### L) STOCK TRANSFERS
From branch → To branch  
Product list with quantities  
Status: pending → approved → completed  
Approval required by manager+ role  

### M) ALERTS
Low stock list with severity color (🔴 <2, 🟠 <5, 🟡 <10)  
"შეკვეთა →" button: opens purchases page with product pre-filled  

### N) REPORTS
Date range selector  
Charts: Daily sales (Line), Category breakdown (Bar), Payment methods (Pie)  
Top 10 products by revenue  
Best customers  
Excel export  

### O) AUDIT LOG
Table: დრო | მომხ. | მოქმ. | ობიექტი | ID  
JSON diff viewer for old_data → new_data  
Filters: user, action type, date  

### P) RS.GE SETTINGS PAGE
Service User (su) + Service Password (sp) input  
Test connection button  
TIN lookup test  
Instructions: "rs.ge → ჩემი გვერდი → სერვისები → IP დარეგისტრირება"  

### Q) COMPANY PAGE (Owner only)
3 tabs: ფილიალები | გუნდი | სტატისტიკა  
Branches: card grid with edit modal  
Team: invite by email, assign role and branch  
Stats: side-by-side comparison of all branches (sales, receipts, profit)  

### R) SETTINGS PAGE
6 tabs: ზოგადი | RS.GE | ბეჭდვა | ლოიალობა | Happy Hour | სარეზ. კოდები  
General: company name, logo upload, address, VAT rate, receipt footer  
Happy Hour: create rules (time range + % discount + days of week)  
Promo Codes: CRUD with usage stats  
Backup section: export all data as Excel + JSON  

---

## ═══════════════════════════════
## PART 8 — RS.GE INTEGRATION
## ═══════════════════════════════

**lib/rs-ge/soap-client.ts:**
```typescript
const WAYBILL_URL = 'https://services.rs.ge/WayBillService/WayBillService.asmx';
export class RsGeError extends Error {
  constructor(public code: string, message: string) { super(message); this.name='RsGeError'; }
}
export async function soapRequest(method: string, params: Record<string,any>): Promise<string> {
  const paramXml = Object.entries(params).map(([k,v])=>`<${k}>${escapeXml(String(v??''))}</${k}>`).join('\n');
  const envelope = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><${method} xmlns="http://tempuri.org/">${paramXml}</${method}></soap:Body></soap:Envelope>`;
  const res = await fetch(WAYBILL_URL, { method:'POST', headers:{'Content-Type':'text/xml; charset=utf-8','SOAPAction':`http://tempuri.org/${method}`}, body:envelope });
  if(!res.ok) throw new RsGeError('HTTP_ERROR',`rs.ge HTTP ${res.status}`);
  const xml = await res.text();
  if(xml.includes('<soap:Fault>')){const m=xml.match(/<faultstring>([\s\S]*?)<\/faultstring>/);throw new RsGeError('SOAP_FAULT',m?.[1]||'SOAP Fault');}
  const rm=xml.match(new RegExp(`<${method}Result>([\\s\\S]*?)<\\/${method}Result>`));
  if(!rm) throw new RsGeError('PARSE_ERROR','პასუხის დამუშავება ვერ მოხდა');
  const inner=rm[1];
  const em=inner.match(/<error_code>(\d+)<\/error_code>/);
  if(em&&em[1]!=='0'){const mm=inner.match(/<error_text>([\s\S]*?)<\/error_text>/);throw new RsGeError(em[1],mm?.[1]||`rs.ge შეცდომა: ${em[1]}`);}
  return inner;
}
function escapeXml(s:string){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
export function extractXmlValue(xml:string,tag:string):string{return xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim()||'';}
```

**lib/rs-ge/waybill.ts:** implement saveWaybill, sendWaybill, deleteWaybill, closeWaybill, getWaybills, getNameFromTin, isVatPayer  
**lib/rs-ge/invoice.ts:** implement saveInvoice, getInvoices  

**API Routes** (credentials always from branch_settings table):
- POST /api/rs-ge/waybill/save
- POST /api/rs-ge/waybill/send
- GET  /api/rs-ge/waybill/list
- POST /api/rs-ge/invoice/save
- GET  /api/rs-ge/tin/[tin]

---

## ═══════════════════════════════
## PART 9 — BARCODE SCANNER
## ═══════════════════════════════

**components/ui/BarcodeScanner.tsx**

Props: `onScan(code: string)`, `onClose()`, `title?: string`

Implementation:
1. getUserMedia({ video: { facingMode: 'environment' } })
2. BrowserMultiFormatReader from @zxing/library
3. Animated green scan line (CSS keyframes)
4. Beep on success (WebAudio API: 1200Hz, 80ms)
5. Manual text input fallback
6. CRITICAL cleanup on close: reader.reset() + stream.getTracks().forEach(t=>t.stop()) + video.srcObject=null

Integrate in:
- POS: F2 shortcut → scan → find product → add to cart
- Inventory: scan button in search → fills search field
- Waybills: scan to add items
- Purchases: scan to add items

---

## ═══════════════════════════════
## PART 10 — EXCEL IMPORT/EXPORT
## ═══════════════════════════════

**lib/excel.ts** (complete):

- `exportProductsToExcel(products)` — Georgian headers, column widths
- `exportSalesToExcel(sales, items)` — 2 sheets: გაყიდვები + ნივთები
- `exportPLReportToExcel(data, period)` — P&L formatted
- `exportVATReportToExcel(salesVAT, purchasesVAT, period)` — 3 sheets
- `importProductsFromExcel(file)` → returns `{ success, errors, data }`
- `downloadTemplate()` — blank Excel with Georgian column headers

Import modal (in Inventory):
1. Drag & drop or file picker
2. Preview table (first 5 rows)
3. Column mapping if needed
4. Validation errors highlighted in red
5. [❌ გაუქმება] [✅ იმპორტი (N პროდუქტი)]

---

## ═══════════════════════════════
## PART 11 — PDF GENERATION
## ═══════════════════════════════

**lib/pdf.ts** using jsPDF:

- `printReceipt(sale, items, settings)` — 80mm thermal receipt
- `generateInvoicePDF(invoice, items, company)` — A4 formatted invoice
- `generateWaybillPDF(waybill, items)` — A4 waybill
- `generatePLReport(data, period)` — A4 P&L report

Receipt format:
```
        DASTA
   [კომპანიის სახელი]
   [მისამართი] [ტელ.]
   ─────────────────────
   20/01/2024   09:15
   ჩეკი: RC-001234
   ─────────────────────
   პროდუქტი 1   2×5₾  10₾
   პროდუქტი 2   1×8₾   8₾
   ─────────────────────
   ქვეჯამი:         15₾
   დღგ 18%:        2.7₾
   სულ:            17.7₾
   ─────────────────────
   ნაღდი:          20₾
   ხურდა:         2.3₾
   ─────────────────────
   გმადლობთ შეძენისთვის!
```

---

## ═══════════════════════════════
## PART 12 — LOYALTY & GIFT CARDS
## ═══════════════════════════════

Loyalty Points in POS:
- Earn: 1 point per 1₾ spent (configurable in settings)
- Redeem: show available points, allow partial use in payment modal
- Display: customer card in POS shows "⭐ 450 ქულა"

Gift Cards:
- Create in Settings with code + amount + expiry
- Use in POS: input field in payment modal
- Remaining balance shown after use

Customer Types (retail/wholesale/vip):
- When customer selected in POS → use their price tier automatically
- Retail → price, Wholesale → price_wholesale, VIP → price_vip

---

## ═══════════════════════════════
## PART 13 — PREMIUM FEATURES
## ═══════════════════════════════

### Happy Hour
- Settings: create rules (time + % discount + days)
- POS: auto-applies if current time matches an active rule
- Visual indicator in POS: "🔥 Happy Hour — 15% ფასდ."

### Min Sale Price Control
- Product has min_sale_price field
- POS: if cashier tries to discount below min price → red warning + block

### Promo Codes
- Input field at bottom of POS cart
- Validates: active, not expired, not over max_uses, min_purchase met
- Shows: "-X₾" or "-X%" discount preview

### Global Search (Cmd+K)
- Works from any page
- Searches: products, customers, sales, waybills, invoices
- Keyboard navigation (↑↓ + Enter)
- Recent items shown by default

### Dark Mode
- Toggle in topbar
- Stored in localStorage + data-theme attribute
- All components support dark mode

### PWA
next.config.js with next-pwa config. manifest.json:
```json
{
  "name": "DASTA",
  "short_name": "DASTA",
  "theme_color": "#0f1724",
  "background_color": "#0f1724",
  "display": "standalone",
  "start_url": "/",
  "icons": [{"src":"/icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]
}
```
Cache POS products for offline use (service worker).

### Supabase Realtime
Dashboard subscribes to: sales inserts + notification inserts. Shows live toast when new sale from another terminal.

### Skeleton Loaders
Replace all loading spinners with skeleton screens:
- `<SkeletonCard />` — stat card placeholder
- `<SkeletonTable rows={5} />` — table placeholder
- `<SkeletonProducts count={12} />` — POS grid placeholder

### Backup System
Settings page → Backup section:
- [📥 Excel-ში] — exports products + sales + customers + transactions in one workbook
- [📥 JSON] — full data dump
- Backup log with timestamps

### Onboarding Wizard
5 steps after first registration:
1. კომპანიის ლოგო (upload or skip)
2. პირველი კატეგორია (create 1-3)
3. პირველი პროდუქტი (add one)
4. rs.ge კავშირი (enter su/sp or skip)
5. მზადაა! (confetti + "დაფაზე გადასვლა")

### Landing Page (app/(marketing)/page.tsx)
Sections: Hero + Features (6 cards) + Pricing + rs.ge Trust Badge + Testimonials + CTA + Footer  
Pricing: Free(0₾) | Starter(29₾/თვე) | Pro(79₾/თვე) | Enterprise(199₾/თვე)  
Brand: dark navy + green, Georgian text throughout  

---

## ═══════════════════════════════
## PART 14 — PLAN LIMITS
## ═══════════════════════════════

```typescript
export const PLAN_LIMITS = {
  free:       { branches:1,  users:2,  products:100, rsge:false, pdf:false, backup:false, api:false, happyHour:false },
  starter:    { branches:2,  users:5,  products:500, rsge:true,  pdf:false, backup:true,  api:false, happyHour:true  },
  pro:        { branches:10, users:20, products:-1,  rsge:true,  pdf:true,  backup:true,  api:true,  happyHour:true  },
  enterprise: { branches:-1, users:-1, products:-1,  rsge:true,  pdf:true,  backup:true,  api:true,  happyHour:true  },
}
```

Show upgrade prompts (lock icon + "Pro-ზე გადადი") when limit reached.

---

## ═══════════════════════════════
## PART 15 — IMPLEMENTATION ORDER
## ═══════════════════════════════

Build in this exact order:

```
1.  npx create-next-app + install all packages
2.  globals.css — implement EVERY line (do not skip)
3.  Supabase SQL schema → run in Supabase SQL Editor
4.  lib/supabase/client.ts + server.ts
5.  middleware.ts
6.  contexts/ThemeContext.tsx + contexts/BranchContext.tsx
7.  Auth: login, register (3-step), forgot-password
8.  Landing page (app/(marketing)/page.tsx)
9.  Layout: Sidebar + Topbar + BranchSwitcher
10. Onboarding wizard
11. Dashboard homepage (stats + realtime)
12. Inventory: CRUD + barcode + Excel import/export
13. Categories CRUD
14. POS: full with cart, payment, receipt, keyboard shortcuts
15. Cash Register: sessions + movements + EOD report
16. Sales history + returns/refunds
17. Purchases + 3-step modal
18. Customers + loyalty + types
19. Suppliers
20. Stock Transfers
21. Adjustments
22. Accounting: all 5 tabs + P&L + VAT report
23. Reports with Recharts
24. Waybills (rs.ge integration)
25. Invoices (rs.ge integration)
26. RS.GE Settings page
27. Alerts
28. Audit Log
29. Company Owner pages
30. Settings: all 6 tabs
31. Backup system
32. CommandPalette (Cmd+K)
33. Skeleton loaders everywhere
34. Dark mode polish
35. PWA manifest
36. Landing page polish
37. Billing page (Stripe scaffold)
```

---

## ═══════════════════════════════
## PART 16 — CRITICAL RULES
## ═══════════════════════════════

1. **ALL UI TEXT IN GEORGIAN** — zero English visible to users. Navigation, labels, buttons, toasts, errors — all ქართული.
2. **CURRENCY** — always format as `12,500.00 ₾` (Georgian Lari)
3. **EVERY DB QUERY** filters by `branch_id` — never query without this filter
4. **SIDEBAR COLOR** — `#0f1724` (dark navy). Active items: green gradient. This must match screenshots exactly.
5. **Server Components by default** — `'use client'` only when needed for interactivity
6. **BranchContext** — single source of truth for current branch
7. **Camera scanner** — ALWAYS cleanup: `stream.getTracks().forEach(t => t.stop())`
8. **Realtime** — ALWAYS unsubscribe on component unmount
9. **Skeleton loaders** — show during ALL data fetching, never blank screens
10. **Audit log** — call `logAction()` in every API route that mutates data
11. **Dark mode** — test every component in both light and dark
12. **Print styles** — POS receipt and EOD report must print correctly at 80mm
13. **Mobile POS** — cart panel slides in from right on mobile
14. **Error handling** — all API routes return `{ success, data?, error? }` JSON
15. **Georgian font** — `Noto Sans Georgian` for all text, `JetBrains Mono` for codes/numbers
16. **Project name is DASTA** — not JabsOn, not any other name. All branding: DASTA, dasta.ge
17. **Min price enforcement** — POS must block discounts below product.min_sale_price
18. **Customer price tiers** — auto-select retail/wholesale/vip price based on customer type
19. **rs.ge credentials** — always read from branch_settings, never hardcoded
20. **Implement EVERYTHING** — no placeholder pages, no "coming soon" sections
```

---

## ═══════════════════════════════
## PART 17 — CURRENT STATE & MIGRATION ROADMAP
## ═══════════════════════════════

### 🔍 CURRENT PROJECT ANALYSIS (WareFlow)
The existing code in `dasta-dev-main` is a high-fidelity prototype that lacks a backend.
- **Architecture**: Vite + React SPA (not Next.js App Router).
- **Data**: Fully hardcoded in `useState`. Refreshing resets everything.
- **Gaps**: 
  - No Supabase integration.
  - POS checkout is non-functional.
  - Components are fragmented (Products, Warehouse, and POS use different mock data).
  - Multiple sidebar routes lead to 404s.

### 🚀 MIGRATION STRATEGY
To reach the **DASTA Ultimate** state, we must transition from a Vite SPA to a Next.js Multi-tenant SaaS architecture.

#### Phase 1: Infrastructure & Re-branding
1.  Initialize Next.js project as per **Part 0**.
2.  Establish the **DASTA Design System** in `globals.css` (**Part 1**).
3.  Deploy Supabase schema (**Part 2**) to enable real multi-tenancy.
4.  Update all branding from "WareFlow" to **DASTA**.

#### Phase 2: Core Auth & Multi-tenancy
1.  Implement Supabase Auth with the 3-step registration wizard (**Part 5**).
2.  Set up `BranchContext` to handle branch-specific data isolation.

#### Phase 3: Database Integration (Data-over-UI)
1.  Migrate UI components from `src/components` to `app/(dashboard)/[branchId]`.
2.  Replace all hardcoded `useState` arrays with Supabase queries (filtering by `branch_id`).
3.  Unify Products and Inventory tables into the single `products` DB table.

#### Phase 4: Functional POS & RS.GE
1.  Implement POS checkout logic: save sale to `sales` table, update `products` stock via triggers, and generate PDF receipts.
2.  Enable RS.GE integration for Waybills and Invoices using the SOAP client in **Part 8**.

#### Phase 5: Polish & Scale
1.  Add Reports (Recharts), Audit Logs, and Global Search (Cmd+K).
2.  Implement PWA and Stripe Billing.

---
**Final Goal**: A unified, production-ready SaaS where Georgian businesses can manage their entire operations securely and efficiently.

