import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const site = JSON.parse(readFileSync(new URL("../cloudformation/frontend-site.json", import.meta.url), "utf8"));
const edge = JSON.parse(readFileSync(new URL("../cloudformation/frontend-edge.json", import.meta.url), "utf8"));

describe("frontend infrastructure", () => {
  it("requires an explicit deployment target in both templates", () => {
    for (const template of [site, edge]) {
      expect(template.Parameters.Environment.AllowedValues).toEqual(["test", "production"]);
      expect(template.Parameters.Environment).not.toHaveProperty("Default");
    }
  });

  it("preserves the existing test resource identities and retained assets", () => {
    expect(site.Resources.Assets.Properties.BucketName).toEqual({ "Fn::Sub": "beacon-network-frontend-${AWS::AccountId}" });
    expect(site.Resources.ReleaseRole.Properties.RoleName).toBe("gh-deploy-beacon-frontend-to-s3");
    expect(site.Resources.Assets.DeletionPolicy).toBe("Retain");
    expect(site.Resources.Assets.UpdateReplacePolicy).toBe("Retain");
    expect(edge.Resources.WebAcl.Properties.Name["Fn::Sub"].replace("${Environment}", "test")).toBe("BeaconNetworkFrontend-test");
    expect(edge.Mappings.EnvironmentSettings.test.MetricName).toBe("BeaconNetworkFrontendTest");
  });

  it.each(["test", "production"])("trusts only the %s GitHub environment", (target) => {
    const trust = site.Resources.ReleaseRole.Properties.AssumeRolePolicyDocument.Statement;
    expect(trust).toHaveLength(1);
    expect(trust[0].Action).toBe("sts:AssumeRoleWithWebIdentity");
    const conditions = trust[0].Condition.StringEquals;
    expect(conditions["token.actions.githubusercontent.com:aud"]).toBe("sts.amazonaws.com");
    expect(conditions["token.actions.githubusercontent.com:sub"]["Fn::Sub"].replace("${Environment}", target)).toBe(
      `repo:GUARDIANS-infrastructure/beacon-network-frontend:environment:${target}`
    );
  });

  it("limits the release role to this bucket and distribution", () => {
    const statements = site.Resources.ReleaseRole.Properties.Policies[0].PolicyDocument.Statement;
    expect(statements).toHaveLength(3);
    expect(statements.flatMap((statement: { Action: string[] }) => statement.Action).sort()).toEqual([
      "s3:ListBucket", "s3:GetBucketLocation", "s3:GetObject", "s3:PutObject", "s3:DeleteObject",
      "cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"
    ].sort());
    expect(statements.map((statement: { Resource: unknown }) => statement.Resource)).toEqual([
      { "Fn::GetAtt": ["Assets", "Arn"] },
      { "Fn::Sub": "${Assets.Arn}/*" },
      { "Fn::Sub": "arn:${AWS::Partition}:cloudfront::${AWS::AccountId}:distribution/${Distribution}" }
    ]);
  });

  it("keeps storage private and imports certificate and WAF bindings without managing DNS", () => {
    expect(site.Resources.Assets.Properties.PublicAccessBlockConfiguration).toEqual({
      BlockPublicAcls: true, BlockPublicPolicy: true, IgnorePublicAcls: true, RestrictPublicBuckets: true
    });
    expect(site.Resources.Distribution.Properties.DistributionConfig.ViewerCertificate.AcmCertificateArn).toEqual({ Ref: "CertificateArn" });
    expect(site.Resources.Distribution.Properties.DistributionConfig.WebACLId).toEqual({ Ref: "WebAclArn" });
    for (const template of [site, edge]) {
      const types = Object.values(template.Resources).map((resource) => (resource as { Type: string }).Type);
      expect(types.some((type) => type.startsWith("AWS::Route53::"))).toBe(false);
      expect(types).not.toContain("AWS::CertificateManager::Certificate");
    }
  });
});
