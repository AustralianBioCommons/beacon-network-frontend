# Correct the existing test GitHub environment

The existing test site uses a GitHub environment named `production`. Correct
that once before enabling the updated release workflow or publishing a new release.
No AWS resources need to be replaced.

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
