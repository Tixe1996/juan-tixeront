import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { asset, projects } from "../../lib/content";
import { ContactBand, ProjectResources, Tags } from "../../components/shared";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title || "Project", description: project?.summary };
}

function CancerStudy() {
  return (
    <section className="cancer-study" data-reveal>
      <p className="eyebrow">Inside the research</p>
      <h2>
        Two datasets.
        <br />
        <em>One analytical workflow.</em>
      </h2>
      <div className="study-metrics">
        <div>
          <strong>309</strong>
          <span>Survey patients</span>
        </div>
        <div>
          <strong>1,139</strong>
          <span>CT nodules</span>
        </div>
        <div>
          <strong>150</strong>
          <span>Imaging patients</span>
        </div>
        <div>
          <strong>15</strong>
          <span>Radiomic features</span>
        </div>
      </div>
      <div className="study-part">
        <span className="study-index">01</span>
        <div>
          <h3>Patient survey: from 15 variables to principal components</h3>
          <p>
            Standardisation, a covariance matrix, singular value decomposition
            and projection. The study retains 13 components to explain more than
            95% of the variance, then explores logistic regression and L2
            regularisation.
          </p>
          <p>
            The dataset is imbalanced: 270 of 309 records are positive. This
            makes class balance and the choice of evaluation metrics central to
            interpreting the results.
          </p>
        </div>
      </div>
      <figure className="study-figure">
        <a
          href={asset("/assets/projects/cancer-pca.png")}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the original PCA chart"
        >
          <img
            src={asset("/assets/projects/cancer-pca.png")}
            alt="Two-dimensional PCA projection of survey patients from the original report"
            loading="lazy"
          />
        </a>
        <figcaption>
          PCA projection from the original notebook. Two components show only
          part of the dataset’s variation.
        </figcaption>
      </figure>
      <div className="study-part">
        <span className="study-index">02</span>
        <div>
          <h3>LIDC-IDRI: from CT images to model comparison</h3>
          <p>
            DICOM images and XML annotations feed a pipeline covering radiomic
            feature extraction, exploratory analysis, PCA, K-Means, logistic
            regression and an MLP. The CNN approach uses image crops under three
            Hounsfield windows, with augmentation and focal loss.
          </p>
          <p>
            A separate comparison in the notebook samples one nodule from each
            of 50 patients. Interpreting it requires checking patient
            separation, label definitions and the differences between the
            models’ classification tasks.
          </p>
        </div>
      </div>
      <div className="method-list">
        {[
          ["01", "Prepare", "DICOM, annotations and feature extraction"],
          ["02", "Explore", "Distributions, correlations, PCA and K-Means"],
          ["03", "Model", "Logistic regression, MLP and CNN"],
          ["04", "Evaluate", "Class balance, errors and model limitations"],
        ].map(([number, title, text]) => (
          <div key={number}>
            <span>{number}</span>
            <h4>{title}</h4>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <details className="study-details">
        <summary>
          CT image windows from the notebook<span>View figure</span>
        </summary>
        <figure>
          <img
            src={asset("/assets/projects/cancer-ct.png")}
            alt="Nodule image crops shown under lung, soft-tissue and bone windows, extracted from the original notebook"
            loading="lazy"
          />
          <figcaption>
            Original figure: image crops and three complementary Hounsfield
            windows.
          </figcaption>
        </figure>
      </details>
      <p className="study-credit">
        Co-authored with Audrey Valero-Petit · Introduction to Data Science · L.
        Ortega · IPSA Toulouse, 2026.
      </p>
    </section>
  );
}
export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <>
      <div className="project-detail wrap">
        <Link className="back-link" href="/projects/">
          <ArrowLeft size={16} />
          All projects
        </Link>
        <header className="project-detail-header">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p className="page-lede">{project.summary}</p>
          <ProjectResources project={project} />
        </header>
        <div
          className={`detail-visual ${slug === "lung-cancer-data-science" ? "chart-visual" : ""}`}
        >
          <img
            src={asset(project.image)}
            alt={project.imageAlt}
            width={1200}
            height={760}
          />
        </div>
        <div className="project-body">
          <aside className="project-meta">
            <p className="eyebrow">Project context</p>
            <p>{project.type}</p>
            <p className="eyebrow tools-label">Methods & tools</p>
            <Tags items={project.tools} />
          </aside>
          <div className="project-narrative">
            <section data-reveal>
              <p className="eyebrow">The question</p>
              <h2>{project.question}</h2>
              <p>{project.approach}</p>
            </section>
            <section data-reveal>
              <p className="eyebrow">The work</p>
              <ul className="project-points">
                {project.points.map((point) => (
                  <li key={point}>
                    <Check size={18} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
            {slug === "lung-cancer-data-science" && <CancerStudy />}
            <section data-reveal>
              <p className="eyebrow">What I take from it</p>
              <p className="takeaway">{project.takeaway}</p>
            </section>
            {project.note && <p className="project-note">{project.note}</p>}
            <div className="source-block">
              <p>Explore the original work</p>
              <ProjectResources project={project} />
            </div>
          </div>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}/`}>
          <div>
            <span className="eyebrow">Next project</span>
            <h2>{next.title}</h2>
          </div>
          <ArrowRight size={30} />
        </Link>
      </div>
      <ContactBand />
    </>
  );
}
