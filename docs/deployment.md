# Deployment

Previous: [CI](ci.md)  
Next: [Architecture](architecture.md)

## Current deployment

The frontend is static files in a private S3 bucket, served by CloudFront.
It consumes the backend's HTTPS endpoints; backend deployment is managed in the
separate `beacon-network-aws-cdk` repository.

| Setting | Current test deployment |
| --- | --- |
| Website | `https://bn.test.biocommons.org.au` |
| API base URL | `https://api.bn.test.biocommons.org.au/beacon-network/v2.0.0` |
| Hosting account | GUARDIANS Test, `181259112927` |
| S3 bucket | `beacon-network-frontend-181259112927`, Sydney (`ap-southeast-2`) |
| CloudFront distribution | `E15BGN8G408YZ0` (`dewh1xhhi1hq7.cloudfront.net`) |
| DNS zone | `test.biocommons.org.au`, generic Test account `232870232581` |
| GitHub environment | `production` — despite its name, this deploys the test site |

There is currently one release destination. This baseline does not implement
separate test and production deployment targets or a CDK frontend deployment.

## Publish a release

Publish a GitHub Release to trigger `.github/workflows/release-deploy-aws.yml`.
The workflow builds the frontend, assumes its AWS role through GitHub OIDC,
uploads `dist/` to the existing S3 bucket, and invalidates CloudFront.
It does not create or update AWS infrastructure.

After deployment, check the Overview, Configuration, and Cohorts pages at the
test URL. A release can be redeployed by rerunning its workflow.

## GitHub configuration

The GitHub environment `production` supplies these variables:

| Variable | Value |
| --- | --- |
| `AWS_REGION` | `ap-southeast-2` |
| `AWS_S3_BUCKET` | `beacon-network-frontend-181259112927` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `E15BGN8G408YZ0` |
| `VITE_API_BASE_URL` | The API base URL above |

Set the secret `AWS_ROLE_TO_ASSUME` to
`arn:aws:iam::181259112927:role/gh-deploy-beacon-frontend-to-s3`.
Optional variables are `VITE_REQUEST_TIMEOUT_MS`, `VITE_RETRY_COUNT`,
`VITE_APP_TITLE`, and `VITE_ENABLE_DEBUG_LOGS`.

The role's trust policy names the GitHub environment `production`. Renaming that
environment requires a coordinated trust-policy change; changing the label alone
will break publishing.

## Runtime configuration

The workflow builds with the environment's `VITE_*` values. `/config.json` can
override them at runtime, but each release overwrites that file with the committed
`public/config.json` (`{}` by default). Keep persistent settings in GitHub.
See [Configuration Model](configuration-model.md) for details.

For other static hosting, run `pnpm build` and serve `dist/`.
For the existing AWS resources and infrastructure templates, see the
[Frontend AWS Runbook](aws-infrastructure-runbook.md).
