# Getting Started

Previous: README  
Next: [Configuration Model](configuration-model.md)

## Prerequisites

- Node.js LTS
- `pnpm`

## Install

```bash
pnpm install
```

## Minimal setup

```bash
cp .env.example .env
```

The example points at a local backend on `https://localhost`. To use the shared
test backend instead, set this in `.env`:

```dotenv
VITE_API_BASE_URL=https://api.bn.test.biocommons.org.au/beacon-network/v2.0.0
```

If browser CORS prevents access, use the [development proxy](development.md#cors-and-local-proxy).

## Run locally

```bash
pnpm dev
```

## Validate and build

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

## What to read next

Continue to [Configuration Model](configuration-model.md) to understand env/runtime config precedence.
