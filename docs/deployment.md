# Publish a frontend release

The frontend is static files in S3 in Sydney, served by CloudFront. Test and
production use separate AWS accounts and GitHub environments.

## Release an update

1. Publish a GitHub Release. It deploys automatically to **test**.
2. Check https://bn.test.biocommons.org.au, including Overview, Configuration,
   and Cohorts.
3. In GitHub Actions, run **Release Deploy (AWS)** from `main`. Select
   **production** and enter the same release tag.
4. Check https://bn.biocommons.org.au.

To roll back or redeploy, run the same workflow with a published release tag and
choose the destination. Keep release tags immutable. The workflow verifies the
release is published; checking it in test before promotion is the operator's step.

The workflow checks out the selected tag, builds with that environment's settings,
uploads `dist/` to S3, and invalidates CloudFront. It cannot deploy infrastructure.
Normal releases need **no CloudFormation commands, certificate ARN, or DNS changes**.

## Environment configuration

Set these in each GitHub environment (`test` and `production`):

| Setting | Value |
| --- | --- |
| Variable `AWS_S3_BUCKET` | Site stack output `BucketName` |
| Variable `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Site stack output `DistributionId` |
| Secret `AWS_ROLE_TO_ASSUME` | Site stack output `ReleaseRoleArn` |
| Variable `VITE_API_BASE_URL` | Target's API URL below |

| Environment | Frontend | API base URL |
| --- | --- | --- |
| `test` | `bn.test.biocommons.org.au` | `https://api.bn.test.biocommons.org.au/beacon-network/v2.0.0` |
| `production` | `bn.biocommons.org.au` | `https://api.bn.biocommons.org.au/beacon-network/v2.0.0` |

The workflow uses `ap-southeast-2` for publishing and rejects an API URL that does
not match the selected target. Optional `VITE_*` settings are described in
[Configuration](configuration-model.md). Use environment-scoped variables so the
two destinations cannot overwrite each other's settings. Production environment
protection rules can restrict who deploys and which workflow refs are allowed.

Each target rebuilds the selected source release; this is not promotion of an
identical built artifact. `/config.json` supports runtime overrides, but every
release replaces that file. Keep persistent settings in GitHub.

## First-time setup

[Set up the infrastructure](aws-infrastructure-runbook.md) once per account;
repeat only when infrastructure changes. DNS and backend deployment are separate.

Before enabling this workflow, complete the [existing test environment transition](test-environment-transition.md).
The old GitHub environment named `production` currently publishes to test;
it must be corrected before it can hold real production settings.
