# Correct the existing test GitHub environment

The test site previously used a GitHub environment named `production`. It now
publishes through `test`, using the same AWS resources.

## Current status

- **Steps 1–4 are complete.** The site stack update reached `UPDATE_COMPLETE`,
  and a release was successfully deployed through the `test` GitHub environment.
  A change to `VITE_APP_TITLE` confirmed that the build used the test settings.
- **Production certificate validation is pending.** The certificate has been
  requested and its validation CNAME details obtained. Wait for DNS validation
  to complete and ACM to report `ISSUED`.
- **Step 5 remains to be completed.** Production infrastructure has not yet been
  deployed, so its publishing role, bucket, and distribution outputs are not yet
  available. Do not run a production release with old test bindings.

Once the certificate is issued, continue with **step 3, Deploy the WAF, then the
site**, in the [AWS Infrastructure Runbook](aws-infrastructure-runbook.md#3-deploy-the-waf-then-the-site).
Use the resulting site outputs to finish step 5 below, clearing any remaining
test bindings. Publish the production frontend before asking the DNS administrator
to add its A/AAAA routing aliases to the CloudFront hostname. The certificate's
validation CNAME does not route frontend traffic.

## Transition checklist

Steps 1–4 are retained here for reference; they do not need to be repeated.

1. Pause releases and let any active deployment finish.
2. Create GitHub environment `test`. Copy the old `production` variables and
   re-enter `AWS_ROLE_TO_ASSUME` using the existing test site's `ReleaseRoleArn`
   stack output.
   Use the test API URL. `AWS_REGION` is no longer required as a variable;
   the publishing workflow fixes it to Sydney.
3. In the test hosting account, open the existing site stack in the CloudFormation
   console and update it by uploading `infra/cloudformation/frontend-site.json`
   as the replacement template.
   Set the new parameter `Environment=test` and keep all existing parameter
   values, including `AttachHostname=true`. Review the change set: the only
   resource property change should be the publishing role's GitHub trust condition.
4. Commit, push, and merge the updated `Release Deploy (AWS)` workflow
   (`.github/workflows/release-deploy-aws.yml`) into `main`. In GitHub Actions,
   select that workflow and choose **Run workflow**, using branch `main`, target
   `test`, and a known published release tag. Check the test website.
5. Clear the old test bindings from GitHub environment `production`, then populate
   it with the new production site outputs and production API URL when ready.

The existing WAF can stay as-is. On its next template update, supply
`Environment=test` and use its existing stack name; its WAF name and metric name
are preserved.

Use the new manual workflow for redeployments. Do not rerun historical workflow
runs that hardcode the `production` environment: after this transition, that name
means the real production destination.
