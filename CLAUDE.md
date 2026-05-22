# retail_new_ui

React 19 POS (Point-of-Sale) retail management system. Runs in the browser during development; in production it is wrapped by **Astilectron** (Go-based desktop app shell).

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Tech Stack

| Purpose | Library |
|---|---|
| UI framework | React 19 |
| Styling | TailwindCSS 3.4 |
| Routing | React Router v7 (HashRouter) |
| Server state | @tanstack/react-query v5 |
| Client state | Zustand v5 + Immer |
| HTTP | Axios 1.12 |
| Forms | React Hook Form v7 |
| Tables | @tanstack/react-table v8 |
| i18n | i18next + react-i18next |
| Excel | xlsx |
| Print | print-js |
| Animation | Framer Motion |
| Dates | dayjs |
| Build | Vite 7, TypeScript 5.9 |

## Architecture

FSD-inspired layered structure. Import direction: `pages → features → entities → shared`.

```
src/
  app/        # Providers, router, Zustand stores, axios config
  entities/   # Domain data layer (API + React Query hooks)
  features/   # Business logic UI components
  pages/      # Route-level page components (lazy-loaded)
  shared/     # Reusable UI kit, hooks, utilities
  widgets/    # Composite UI sections
  @types/     # Global TypeScript type declarations
```

Path alias: `@/*` → `src/*`

## Entity Layer Pattern

Every entity follows the same two-file pattern:

- `src/entities/{name}/api/index.ts` — raw Axios calls via `apiRequest<T>()`
- `src/entities/{name}/repository/index.ts` — React Query `useQuery`/`useMutation` hooks

**Entities:** `auth`, `products`, `categories`, `cashbox`, `sale`, `refund`, `purchase`, `revision`, `history`, `settings`, `init`

When adding a new entity: create `api/` + `repository/` files, register the path in `src/entities/path.ts`, then wire the route in `src/app/config/routes/`.

## Zustand Stores (`src/app/store/`)

| Store | Purpose |
|---|---|
| `useSettingsStore` | Org settings, active shift, warehouse |
| `useSaleDraftStore` | Sale draft state (multi-tab support) |
| `useRefundDraftStore` | Refund draft state |
| `usePurchaseDraftStore` | Purchase draft state |
| `useCashbox` | Cashbox operations |
| `useCurrencyStore` | Currency data |
| `useRevision` | Inventory revision state |
| `useWriteofStroe` | Write-off state |
| `useVersionStore` | App version management |

Zustand handles **client/draft state**; React Query handles **server state**. All stores use Immer middleware — mutate state directly inside actions.

## Routes (HashRouter)

| Path | Page |
|---|---|
| `/login`, `/register` | Auth (public) |
| `/sales` | Sale (POS) |
| `/refund` | Refund |
| `/purchase` | Purchase price management |
| `/products` | Product catalog |
| `/favoutite-products` | Favorite products |
| `/categories` | Product categories |
| `/cashbox` | Cashbox management |
| `/cashbox/cash-operation` | Cash operations history |
| `/sales-history` | Sale history |
| `/refund-history` | Refund history |
| `/purchase-history` | Purchase history |
| `/counterparties` | Contractors/suppliers |
| `/counterparties/:id` | Contractor detail |
| `/revisiya` | Inventory revision |
| `/revisiya/operation` | Revision operation |
| `/write-off` | Write-off |
| `/write-off/operation` | Write-off operation |
| `/report` | Reports |
| `/period-report` | Period report |
| `/settings` | Settings |
| `/accounts` | Account management |

All pages are lazy-loaded. See `src/app/config/routes/RoutePath.ts` and `src/app/config/routes/index.tsx`.

## Shared UI

- `src/shared/ui/kit/` — base components: Button, Input, Table, Dialog, Drawer, Tabs, Select, Checkbox, Badge, Pagination, etc.
- `src/shared/ui/kit-pro/` — extended: BarcodeInput, NumericInput, PhoneInput, RangeSlider, AlertDialog

## Key Patterns

**Authentication:** Base64-encoded credentials stored in `sessionStorage`; Axios interceptor reads them and adds `Authorization: Basic ...` to every request. Keys: `u` (username), `p` (password), `token`, `i` (user object).

**Dual HTTP mode:** `apiRequest<T>()` in `src/app/config/axios/index.ts` transparently uses Axios in dev and Astilectron IPC in production.

**React Query config:** `refetchOnWindowFocus: false`, `staleTime: 0`, `cacheTime: 2000ms`, `retry: 2`.

**Barcode scanning:** Global keyboard event listener via `src/shared/lib/useBarcodeScanner.ts`.

**QR scanning:** `html5-qrcode` via `src/shared/lib/useQrScanner.ts`.

**Permissions:** `src/shared/lib/checkPermission.ts` — use to gate UI elements.

**Excel import/export:** `src/shared/lib/arrayToExcelConvert.ts` + `xlsx`. Import UI in `src/features/upload-excel-file/`.

**Printing:** `print-js` via `src/features/print-modal/`.

**Multi-tab drafts:** Stores hold an array of drafts with an `isActive` flag. Actions follow pattern: `addDraft`, `updateDraft*`, `deleteDraft`, `completeDraft`.

## Features (`src/features/`)

`account`, `auth`, `barcode-form`, `cashbox`, `cashbox-card`, `cashbox-form`, `catalog-selector`, `category`, `download-scale`, `favourite-product`, `favorit-table`, `fiscalized`, `history`, `image-form`, `modals`, `order-actions`, `payme-type-cards`, `payment`, `payment-section`, `print-modal`, `product`, `product-form`, `revision`, `sale-refund-table`, `search-product`, `search-product-table`, `settings`, `shift`, `update`, `update-catalog-code`, `upload-excel-file`, `viewMark`

## Environment Variables (`.env`)

```
VITE_BASE_URL=http://localhost:7072   # backend API base URL
VITE_PUBLIC_URL=./
VITE_NODE_ENV=development
```
