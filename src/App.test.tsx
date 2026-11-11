import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import App from "./App";
import { appConfig } from "./config/env";

describe("App", () => {
  it("renders app title", () => {
    const html = renderToString(<App />);
    expect(html).toContain(`<h1 class="page-title">${appConfig.appTitle}</h1>`);
    expect(html).not.toContain("Beacon Network UI");
    expect(html).toContain("DATA DISCOVERY");
    expect(html).toContain("Powered by GA4GH");
    expect(html).toContain("https://github.com/elixir-europe/beacon-network-backend");
    expect(html).toContain('aria-label="Funder logos"');
  });
});
