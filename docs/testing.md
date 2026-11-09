# Testing

Previous: [Development](development.md)  
Next: [CI](ci.md)

## Commands

```bash
pnpm test
pnpm typecheck
pnpm lint
```

## Current baseline

- Unit tests for config parsing/loading behavior.
- API response parsing and schema validation tests.
- App render smoke test.
- Overview node inventory and availability tests.
- Partner-logo parsing and rendering tests.
- CloudFormation deployment-target and publishing-role contract tests.

## Expected pre-PR checks

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
