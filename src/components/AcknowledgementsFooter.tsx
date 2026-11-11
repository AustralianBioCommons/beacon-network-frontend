export function AcknowledgementsFooter() {
  return (
    <footer className="acknowledgements">
      <div className="acknowledgements-inner">
        <nav className="acknowledgements-logos" aria-label="Funder logos">
          <a href="https://www.biocommons.org.au/" target="_blank" rel="noreferrer">
            <img src="/logos/biocommons.png" alt="Australian BioCommons" />
          </a>
          <a href="https://bioplatforms.com/" target="_blank" rel="noreferrer">
            <img src="/logos/bpa.png" alt="Bioplatforms Australia" />
          </a>
          <a href="https://www.education.gov.au/ncris" target="_blank" rel="noreferrer">
            <img src="/logos/ncris.png" alt="National Collaborative Research Infrastructure Strategy" />
          </a>
        </nav>
        <div className="acknowledgements-text">
          <p>
            The GUARDIANS program is led by{" "}
            <a href="https://www.biocommons.org.au/">Australian BioCommons</a> with
            contributions from partner organisations including the{" "}
            <a href="https://aaf.edu.au/">Australian Access Federation</a>,{" "}
            <a href="https://baker.edu.au/">Baker Heart &amp; Diabetes Institute</a>,{" "}
            <a href="https://populationgenomics.org.au/">Centre for Population Genomics</a>,{" "}
            <a href="https://www.ccia.org.au/">Children’s Cancer Institute Australia</a>,{" "}
            <a href="https://www.garvan.org.au/">Garvan Institute of Medical Research</a>,{" "}
            <a href="https://www.monash.edu/">Monash University</a>,{" "}
            <a href="https://nci.org.au/">National Computational Infrastructure</a>,{" "}
            <a href="https://www.qimrb.edu.au/">QIMR Berghofer Medical Research Institute</a>,{" "}
            <a href="https://www.sydney.edu.au/">The University of Sydney</a>, and{" "}
            <a href="https://www.unimelb.edu.au/">The University of Melbourne</a>.
          </p>
          <p>
            The Australian BioCommons project is led by the University of Melbourne
            and hosted within the University’s Faculty of Medicine, Dentistry and
            Health Sciences.
          </p>
          <p>
            Australian BioCommons and the GUARDIANS program are supported by{" "}
            <a href="https://bioplatforms.com/">Bioplatforms Australia</a>.
            Bioplatforms Australia is enabled by{" "}
            <a href="https://www.education.gov.au/ncris">NCRIS</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
