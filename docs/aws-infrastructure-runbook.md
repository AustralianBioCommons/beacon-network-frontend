# Frontend AWS Runbook

Use this for infrastructure maintenance. Normal releases only upload files;
see [Deployment](deployment.md).

## Resource ownership

The live frontend runs in GUARDIANS Test account `181259112927`:

- `infra/cloudformation/frontend-site.json` defines the private S3 bucket,
  CloudFront distribution, origin access control, and GitHub publishing role.
  The deployed stack is `BeaconNetworkFrontend-test` in `ap-southeast-2`.
- `infra/cloudformation/frontend-edge.json` defines CloudFront's WAF in
  `us-east-1`, with Amazon IP reputation, common, and known-bad-input rules.
- The site stack uses an existing ACM certificate and GitHub OIDC provider.
  Its publishing role can upload/delete this site's files and invalidate this
  distribution; it cannot deploy infrastructure.
- The bucket is retained if the site stack is removed.

DNS is managed externally in the generic Test account `232870232581`.
The A and AAAA records for `bn.test.biocommons.org.au` point to
`dewh1xhhi1hq7.cloudfront.net`, the active distribution in GUARDIANS Test.

## Finding the HTTPS certificate

In account `181259112927`, select **N. Virginia (`us-east-1`)** in ACM to find
`bn.test.biocommons.org.au`. CloudFront uses certificate
`a23ac3c9-c8d9-4312-9572-9c8125543ce4`.

AWS requires CloudFront's certificate and WAF configuration in `us-east-1`,
even though the assets bucket is in Sydney. The backend's ALB certificate is
regional and may appear in Sydney instead. CloudFront serves the website globally.

The certificate ARN was supplied as the site's CloudFormation `CertificateArn`
parameter. Ordinary frontend releases do not need to supply it again.

## Infrastructure changes or a new installation

Review a CloudFormation change set before updating an existing stack. Preserve
its current parameter values unless deliberately changing them.

For a new installation:

1. Obtain a validated frontend ACM certificate in `us-east-1`. The DNS
   administrator adds its validation CNAME and retains it for renewal.
2. Ensure the account has the GitHub OIDC provider.
3. Deploy the edge template in `us-east-1`.
4. Deploy the site template in `ap-southeast-2`, supplying `CertificateArn`,
   the edge stack's `WebAclArn`, `FrontendHostname`, and `AttachHostname=true`.
5. Configure publishing from the site's outputs, then upload the frontend.
6. Ask the DNS administrator to point A/AAAA aliases at `DistributionDomainName`.

These templates describe the existing test setup, not a general multi-environment
framework: the WAF name and GitHub environment trust are fixed to their current
values. Review them before reusing them for another environment.

`AttachHostname=false` is available for staging a distribution during a hostname
migration. The existing live site already uses `AttachHostname=true`; normal
updates do not require toggling it.

## Backend interface

The frontend requires an HTTPS API base URL, browser CORS access, and the response
shapes documented in [API contracts](../src/api/contracts.md). It calls `/info`,
`/configuration`, and `/cohorts`. It has no dependency on the backend's application
server, compute service, or internal network configuration. Backend deployment
instructions belong in `beacon-network-aws-cdk`.
