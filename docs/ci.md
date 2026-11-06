# CI

Previous: [Testing](testing.md)  
Next: [Deployment](deployment.md)

## Workflow

GitHub Actions workflow: `.github/workflows/ci.yml`

Triggers:
- Pushes to `main`
- Pull requests

Steps:
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Purpose

CI is the release gate for code health and build validity.

Unit tests include the CloudFormation deployment-target and publishing-role contracts.
Infrastructure setup is operator-run; the release workflow only publishes app files.
