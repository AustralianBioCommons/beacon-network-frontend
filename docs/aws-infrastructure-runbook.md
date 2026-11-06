# Set up frontend infrastructure

Do this once per AWS account, then use [Publish a release](deployment.md) for
normal updates. There is one frontend per account: test and production are separate.
No CDK is used.

## Dependencies

You need:

- An existing AWS account and an AWS CLI profile with infrastructure permissions.
- Permission to request an ACM certificate in the hosting account, in **`us-east-1`**.
- The account's GitHub OIDC provider (`token.actions.githubusercontent.com`,
  audience `sts.amazonaws.com`); reuse the backend's provider if present.
- An external DNS administrator to add certificate-validation and frontend records.
- An HTTPS backend API permitting the frontend origin through CORS.

The templates create everything else: a private encrypted S3 bucket in
**Sydney (`ap-southeast-2`)**, CloudFront distribution, WAF, and publishing role.
AWS requires CloudFront's certificate and WAF configuration in `us-east-1`,
even though the bucket is in Sydney. Select N. Virginia in ACM to find the frontend
certificate; the backend's regional certificate may instead appear in Sydney.

## 1. Select the account and environment

From the repository root, replace the example values:

```bash
export AWS_PROFILE=YOUR_PRODUCTION_PROFILE
export TARGET=production                     # or test
export FRONTEND_HOSTNAME=bn.biocommons.org.au # test: bn.test.biocommons.org.au
aws sts get-caller-identity
```

Check the returned account ID before proceeding. Both stacks and the certificate
must belong to that account. DNS may be managed in a different account; the hosting
account does not need a Route 53 hosted zone.

## 2. Request and validate the certificate

In ACM in the hosting account, select **N. Virginia (`us-east-1`)**, request a
public certificate for the selected frontend hostname, and choose DNS validation.

Send the DNS administrator the **CNAME name and value shown by ACM**. They add
that record in the authoritative DNS zone, even if it is in another account.
Keep the validation record for automatic certificate renewal.

Wait until ACM reports `ISSUED`, then copy the certificate ARN into your local shell:

```bash
export CERTIFICATE_ARN='<certificate ARN copied from ACM>'
```

This validation CNAME proves control of the hostname. It does not route website
traffic; the frontend routing records are added after the distribution exists.

## 3. Deploy the WAF, then the site

```bash
aws cloudformation deploy \
  --region us-east-1 \
  --stack-name "BeaconNetworkFrontend-${TARGET}-edge" \
  --template-file infra/cloudformation/frontend-edge.json \
  --parameter-overrides Environment="$TARGET"

export WEB_ACL_ARN="$(aws cloudformation describe-stacks \
  --region us-east-1 \
  --stack-name "BeaconNetworkFrontend-${TARGET}-edge" \
  --query 'Stacks[0].Outputs[?OutputKey==`WebAclArn`].OutputValue | [0]' \
  --output text)"

aws cloudformation deploy \
  --region ap-southeast-2 \
  --stack-name "BeaconNetworkFrontend-${TARGET}" \
  --template-file infra/cloudformation/frontend-site.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    Environment="$TARGET" \
    FrontendHostname="$FRONTEND_HOSTNAME" \
    CertificateArn="$CERTIFICATE_ARN" \
    WebAclArn="$WEB_ACL_ARN" \
    AttachHostname=true

aws cloudformation describe-stacks \
  --region ap-southeast-2 \
  --stack-name "BeaconNetworkFrontend-${TARGET}" \
  --query 'Stacks[0].Outputs' --output table
```

For an existing stack, use its actual name and preserve its parameter values.
Add `--no-execute-changeset` to `deploy` to review changes before executing them
in CloudFormation. The bucket and role names remain stable for existing test
hosting; do not create a second site stack in the same account. The bucket is
retained if its stack is removed.

## 4. Connect publishing and DNS

Use the site outputs to configure the matching [GitHub environment](deployment.md#environment-configuration).
Its role can publish only to this bucket and invalidate this distribution;
it has no CloudFormation or DNS permissions.

Publish a release, then send the DNS administrator:

- The frontend hostname for the selected environment.
- The site's `DistributionDomainName` output (the CloudFront hostname).
- A request to create **A and AAAA alias records** pointing to that distribution.

In Route 53, select a CloudFront alias target. When the distribution belongs to
another account and is not listed, enter its hostname manually. The distribution
must have the frontend hostname as an alternate domain name and use the validated
certificate; the site template configures both with `FrontendHostname`,
`CertificateArn`, and `AttachHostname=true`.

DNS stays in its existing account and is never managed by these templates. Check
HTTPS and API calls at the final hostname.

`AttachHostname=false` is only needed when staging a replacement distribution
before a hostname migration. A normal new deployment uses `true` and needs no
second infrastructure deployment when DNS is added.

## Existing test installation

The test site's hosting account and DNS account are separate. Find its existing
site stack in Sydney and read its outputs for the bucket, distribution, and
publishing role. Find the frontend certificate in ACM in N. Virginia. Use those
live values rather than copying resource identifiers from documentation.

Keep these resources. Follow the [one-time GitHub environment transition](test-environment-transition.md)
before switching to the new workflow. No bucket, distribution, or DNS migration
is required. Backend implementation details belong in `beacon-network-aws-cdk`;
the frontend only relies on the [API contract](../src/api/contracts.md).

## Local deployment details

Keep account IDs, resource IDs, and ARNs out of committed documentation. Use stack
outputs, ACM, and GitHub environment settings as the sources of deployment values.
If local notes are needed, put them under `docs/local/`, which is ignored by Git.
Do not store credentials or session tokens in those notes.
