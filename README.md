# MiCompli 🌸

Plataforma de experiencias emocionales personalizadas.

## Stack

- **Next.js 15** — App Router + React Server Components
- **Supabase** — Auth, Postgres, Row Level Security
- **Tailwind CSS** — Estilos con tokens personalizados
- **TypeScript** — Tipos generados desde Supabase
- **Zustand** — Estado global del carrito
- **Sonner** — Notificaciones toast

## Estructura

```
micomplii/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── explorar/             # Catálogo de experiencias
│   ├── experiencia/[id]/     # Builder de experiencia
│   ├── checkout/             # Formulario de pago
│   ├── success/              # Confirmación de orden
│   └── dashboard/            # Portal de cómplices
├── components/
│   ├── layout/               # Navbar, Hero, CategoryCards
│   ├── experiencia/          # CatalogGrid, Builder, Checkout
│   └── dashboard/            # Sidebar, Stats, OrdenesTable
├── lib/
│   └── supabase/             # client.ts / server.ts / middleware.ts
├── types/                    # database.types.ts + index.ts
└── supabase/migrations/      # Schema SQL completo
```

## Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → New project
2. Copia las credenciales

### 3. Variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

### 4. Aplicar schema
En el SQL Editor de Supabase, ejecuta:
```
supabase/migrations/001_initial_schema.sql
```

### 5. Correr en local
```bash
npm run dev
```

### 6. Regenerar tipos (cuando cambies el schema)
```bash
npm run db:types
```

## Flujos principales

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con slogan y categorías |
| `/explorar` | Catálogo con filtros |
| `/experiencia/[id]` | Builder de experiencia personalizada |
| `/checkout` | Formulario de confirmación |
| `/success` | Confirmación con número de orden |
| `/dashboard` | Portal de cómplices (requiere auth) |

## Roles de usuario

- `cliente` — puede explorar y ordenar
- `complice` — accede al dashboard, ve y gestiona sus órdenes
- `admin` — acceso completo (por implementar)

## Próximos pasos

- [ ] Integración con pasarela de pago (Stripe / Conekta)
- [ ] Notificaciones push para cómplices (Supabase Realtime)
- [ ] Upload de imágenes de servicios (Supabase Storage)
- [ ] Panel de administración
- [ ] App móvil con React Native
