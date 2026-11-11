import { type ReactElement, useState } from "react";
import { appConfig } from "./config/env";
import { ConfigurationPage } from "./pages/ConfigurationPage";
import { CohortsPage } from "./pages/CohortsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PartnerLogoWall } from "./components/PartnerLogoWall";
import { AcknowledgementsFooter } from "./components/AcknowledgementsFooter";

type PageKey = "overview" | "configuration" | "cohorts";

const pageNavItems: Array<{ key: PageKey; label: string }> = [
  { key: "cohorts", label: "Cohorts" },
  { key: "overview", label: "Overview" },
  { key: "configuration", label: "Configuration" }
];

export default function App(): ReactElement {
  const [page, setPage] = useState<PageKey>("cohorts");
  const [cohortsResetToken, setCohortsResetToken] = useState<number>(0);

  const selectPage = (key: PageKey): void => {
    if (key === "cohorts") {
      setCohortsResetToken((value) => value + 1);
    }
    setPage(key);
  };

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-brand" href="https://www.biocommons.org.au/" aria-label="Australian BioCommons website">
            <img src="/logos/biocommons.png" alt="Australian BioCommons" />
          </a>
          <span className="site-service-label">DATA DISCOVERY</span>
          <nav className="site-nav" aria-label="Main navigation">
            {pageNavItems.map(({ key, label }) => (
              <button
                key={key}
                className={key === page ? "active" : ""}
                aria-current={key === page ? "page" : undefined}
                onClick={() => selectPage(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="app-shell">
        <h1 className="page-title">{appConfig.appTitle}</h1>

        <main>
          {page === "overview" && <OverviewPage />}
          {page === "configuration" && <ConfigurationPage />}
          {page === "cohorts" && <CohortsPage resetToken={cohortsResetToken} />}
        </main>

        <PartnerLogoWall />
        <div className="guardians-divider" aria-hidden="true" />
        <div className="guardians-line">
          <a
            className="guardians-line-mark"
            href="https://guardians.biocommons.org.au/"
            aria-label="GUARDIANS website"
          >
            <img src="/logos/guardians.png" alt="GUARDIANS" />
          </a>
          <p>
            Part of the GUARDIANS infrastructure. Powered by GA4GH{" "}
            <a href="https://github.com/elixir-europe/beacon-network-backend">Beacon</a>
          </p>
        </div>
        <AcknowledgementsFooter />
      </div>
    </div>
  );
}
