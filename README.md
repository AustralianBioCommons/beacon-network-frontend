# Beacon Network Front-end

Lightweight React + TypeScript UI for public GA4GH Beacon Network metadata from:
- `/info`
- `/configuration`
- `/cohorts`

## Quickstart

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Checks and build:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Deployment has two separate tasks:

- [Set up AWS infrastructure](docs/aws-infrastructure-runbook.md) once per account.
- [Publish a release](docs/deployment.md) to test, then promote it to production.

Before enabling the new workflow, complete the [existing test environment transition](docs/test-environment-transition.md).

## Suggested Reading Path

1. [Getting Started](docs/getting-started.md)
2. [Configuration Model](docs/configuration-model.md)
3. [Development](docs/development.md)
4. [Testing](docs/testing.md)
5. [CI](docs/ci.md)
6. (one-time, AWS ops) [AWS Infrastructure Runbook](docs/aws-infrastructure-runbook.md)
7. [Deployment](docs/deployment.md)
8. [Architecture](docs/architecture.md)
9. [Twelve-factor Alignment](docs/twelve-factor.md)

## Notes

- Agent workflow guidance: `AGENTS.md`
- API contract notes: `src/api/contracts.md`
