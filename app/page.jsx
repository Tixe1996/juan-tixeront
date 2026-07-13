"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Briefcase,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Home as HomeIcon,
  Languages,
  Mail,
  Plane,
  Rocket,
  Target,
  TrendingUp,
  Trophy,
  Utensils,
  Wallet,
  Wrench
} from "lucide-react";

const projects = [
  {
    slug: "home-capital-studio",
    title: "Home Capital Studio - personal finance simulator",
    category: "Finance & Decision Tools",
    filter: "Finance",
    summary:
      "Interactive finance application to compare investing, buying a home and buying a rental property, with compound interest, cash-flow, DTI, probability scenarios and portfolio allocation diagnostics.",
    image: "/assets/projects/home-capital-studio.jpg",
    app: "/finance-app/index.html",
    tools: ["React", "TypeScript", "Vite", "Scenario modelling", "Compound interest"],
    featured: true
  },
  {
    slug: "lung-cancer-data-science",
    title: "Data science: pulmonary nodule classification",
    category: "Data Science & Machine Learning",
    filter: "Data & ML",
    summary:
      "LIDC-IDRI pipeline with 1139 nodules, 150 patients and 15 radiomic features. Compared PCA, logistic regression, MLP and CNN approaches for CT-based classification.",
    image: "/assets/projects/lung-cancer-data-science.jpg",
    pdf: "/assets/downloads/lung-cancer-data-science.pdf",
    html: "/assets/downloads/lung-cancer-data-science.html",
    tools: ["Python", "pandas", "scikit-learn", "PCA", "MLP/CNN"],
    featured: true
  },
  {
    slug: "finite-difference-aerodynamics",
    title: "Finite-difference aerodynamics",
    category: "Aerodynamics & Numerical Methods",
    filter: "Aerospace",
    summary:
      "Numerical solution of advection and diffusion equations using Lax-Wendroff and Euler schemes, with stability, consistency and convergence analysis.",
    image: "/assets/projects/finite-difference-aerodynamics.jpg",
    pdf: "/assets/downloads/finite-difference-aerodynamics.pdf",
    tools: ["Numerical methods", "Von Neumann", "Taylor expansions", "Excel"],
    featured: true
  },
  {
    slug: "ucav-aerodynamics",
    title: "Experimental and numerical UCAV aerodynamics",
    category: "Aerodynamics & CAD",
    filter: "Aerospace",
    summary:
      "Geometry reconstruction in CATIA and aerodynamic study of a UCAV, connecting experimental methodology with numerical engineering analysis.",
    image: "/assets/projects/ucav-aerodynamics.jpg",
    pdf: "/assets/downloads/ucav-aerodynamics.pdf",
    tools: ["CATIA V5", "Aerodynamics", "Experimental analysis", "CFD thinking"],
    featured: true
  },
  {
    slug: "matlab-vibration-cantilever-plate",
    title: "MATLAB vibration analysis of a cantilever plate",
    category: "Engineering Computation",
    filter: "Computation",
    summary:
      "Modal analysis, compliance matrices and MATLAB workflow to study vibration modes and static response in a cantilever plate.",
    image: "/assets/projects/matlab-vibration-cantilever-plate.jpg",
    pdf: "/assets/downloads/matlab-vibration-cantilever-plate.pdf",
    tools: ["MATLAB", "Modal analysis", "Eigenvalues", "Engineering computation"],
    featured: true
  },
  {
    slug: "liquid-hydrogen-road-haulage",
    title: "Liquid hydrogen for heavy road haulage",
    category: "Energy & Propulsion",
    filter: "Aerospace",
    summary:
      "Study of hydrogen technologies for road haulage, including H-ICE, fuel cells, thermal management, performance and component adaptation.",
    image: "/assets/projects/liquid-hydrogen-road-haulage.jpg",
    pdf: "/assets/downloads/liquid-hydrogen-road-haulage.pdf",
    tools: ["Hydrogen", "Thermodynamics", "Propulsion", "Energy systems"]
  },
  {
    slug: "supersonic-nozzle-design",
    title: "Supersonic nozzle design and analysis",
    category: "Turbomachinery",
    filter: "Aerospace",
    summary:
      "Turbomachinery project on a 2D supersonic nozzle, combining preliminary thermodynamics with numerical aerodynamic design.",
    image: "/assets/projects/supersonic-nozzle-design.jpg",
    pdf: "/assets/downloads/supersonic-nozzle-design.pdf",
    tools: ["Turbomachinery", "Supersonic flow", "Thermodynamics", "Nozzle design"]
  },
  {
    slug: "advanced-equations-algorithms",
    title: "Advanced equations and algorithms",
    category: "Applied Mathematics",
    filter: "Computation",
    summary:
      "Applied mathematics study around Euler-Lagrange equations, variational analysis, integration by parts and physical applications.",
    image: "/assets/projects/advanced-equations-algorithms.jpg",
    pdf: "/assets/downloads/advanced-equations-algorithms.pdf",
    tools: ["Applied maths", "Euler-Lagrange", "Variational analysis"]
  },
  {
    slug: "optical-flow-motion-images",
    title: "Apparent motion detection in images",
    category: "Applied Mathematics & Vision",
    filter: "Computation",
    summary:
      "Optical-flow project covering problem formalization, least squares, variational methods, comparison and image-analysis applications.",
    image: "/assets/projects/optical-flow-motion-images.jpg",
    pdf: "/assets/downloads/optical-flow-motion-images.pdf",
    tools: ["Optical flow", "Least squares", "Variational methods", "Image analysis"]
  },
  {
    slug: "turkish-aerospace-strategy",
    title: "Strategic analysis of Turkish Aerospace",
    category: "Aerospace Strategy",
    filter: "Strategy",
    summary:
      "Structured diagnosis of TAI in the aerospace and defense market, covering sovereignty, stakeholders, competition and strategic constraints.",
    image: "/assets/projects/turkish-aerospace-strategy.jpg",
    pdf: "/assets/downloads/turkish-aerospace-strategy.pdf",
    tools: ["Strategy", "Aerospace defense", "Market analysis", "Competition"]
  }
];

const filters = ["All", "Finance", "Data & ML", "Aerospace", "Computation", "Strategy"];

const skillGroups = [
  {
    title: "Data & ML",
    icon: BrainCircuit,
    items: ["Python", "Jupyter", "pandas", "numpy", "scikit-learn", "PCA", "MLP/CNN", "ML pipelines"]
  },
  {
    title: "Programming & Tools",
    icon: Code2,
    items: ["MATLAB", "React", "TypeScript", "Excel models", "Git", "Local web apps", "Automation"]
  },
  {
    title: "Aerospace Engineering",
    icon: Plane,
    items: ["Aerodynamics", "Aerospace systems", "CATIA V5", "STAR-CCM+", "ANSYS", "Turbomachinery"]
  },
  {
    title: "Numerical & Scientific Computing",
    icon: BarChart3,
    items: ["Finite differences", "Modal analysis", "Eigenvalues", "Variational methods", "Optical flow", "LaTeX"]
  },
  {
    title: "Finance & Decision Models",
    icon: TrendingUp,
    items: ["Compound interest", "Scenario analysis", "Cash-flow", "Portfolio allocation", "Real-estate ratios"]
  },
  {
    title: "Languages & Strengths",
    icon: Languages,
    items: [
      "Spanish native",
      "French native",
      "English advanced",
      "Italian intermediate",
      "Analytical thinking",
      "Autonomous",
      "Multicultural"
    ]
  }
];

const interestAreas = [
  {
    title: "Finance & Markets",
    icon: Wallet,
    text:
      "I follow financial markets through research and I build tools to understand capital, risk, cash-flow and long-term decisions.",
    link: "/finance-app/index.html",
    linkText: "Open finance app"
  },
  {
    title: "Machine Learning",
    icon: Database,
    text:
      "I like applying ML where the output is useful: ranking priorities, classifying medical imaging data or turning noisy inputs into decisions."
  },
  {
    title: "Aeronautics & Space",
    icon: Rocket,
    text:
      "Aerospace is the technical world that drives me: aerodynamics, propulsion, systems, missions and the precision needed to make things work."
  },
  {
    title: "Cooking",
    icon: Utensils,
    text:
      "Cooking keeps me close to craft: timing, iteration, taste and the habit of improving a process by paying attention."
  },
  {
    title: "Tennis & Football",
    icon: Trophy,
    text:
      "Sport gives me rhythm, pressure management and team reflexes, especially when the situation changes quickly."
  },
  {
    title: "Travel & Multicultural Work",
    icon: Globe2,
    text:
      "Growing between Spain, France and international environments makes me comfortable adapting, listening and working across cultures."
  }
];

function ProjectCard({ project, compact = false }) {
  const primaryHref = project.app || project.pdf || project.html || "#";

  return (
    <article className={`project-card ${compact ? "compact" : ""}`}>
      <a className="project-image" href={primaryHref} target="_blank" rel="noreferrer">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
      </a>
      <div className="project-content">
        <p className="eyebrow">{project.category}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tags" aria-label={`${project.title} tools`}>
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
        <div className="project-actions">
          {project.app ? (
            <a href={project.app} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              Live app
            </a>
          ) : null}
          {project.pdf ? (
            <a href={project.pdf} target="_blank" rel="noreferrer">
              <FileText size={16} aria-hidden="true" />
              PDF
            </a>
          ) : null}
          {project.html ? (
            <a href={project.html} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              Notebook
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.filter === activeFilter);
  }, [activeFilter]);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Juan Tixeront home">
          JT
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#interests">Interests</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Final-year Master entry | Aerospace, data science & finance</p>
          <h1>Juan Tixeront</h1>
          <p className="hero-lede">
            Franco-Spanish aeronautical engineering student at IPSA Toulouse, entering
            the final year of my Master and ready to get fully involved in professional
            life. I connect aerospace systems, numerical methods, machine learning and
            finance-minded decision tools.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              View projects
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/finance-app/index.html" target="_blank" rel="noreferrer">
              Finance app
              <ExternalLink size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/assets/downloads/cv-juan-tixeront.pdf" target="_blank" rel="noreferrer">
              Download CV
              <Download size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-metrics" aria-label="Quick profile facts">
            <span>Final-year Master path</span>
            <span>Ready for professional impact</span>
            <span>Aerospace + Data + Finance</span>
            <span>Spanish, French, English, Italian</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Portrait and focus areas">
          <img className="portrait intro-photo" src="/assets/juan-tixeront-intro.jpg" alt="Juan Tixeront portrait" />
          <div className="focus-panel">
            <span>
              <Briefcase size={17} aria-hidden="true" />
              Professional direction
            </span>
            <strong>Ready to contribute in engineering, data and decision-making roles</strong>
            <p>Curious, analytical and practical: I like building things that can be used.</p>
          </div>
        </div>
      </section>

      <section className="section intro-grid" id="about">
        <div>
          <p className="eyebrow">About</p>
          <h2>Analytical, practical and ready for the next professional step.</h2>
        </div>
        <div className="intro-copy">
          <p>
            I like work that forces me to connect theory with something concrete: a
            simulation, a model, a repair workflow, a report, a design choice or a tool
            that helps someone decide. Aerospace gives me the physical systems; data
            science gives me the methods; finance gives me another field where modelling,
            risk and clarity matter.
          </p>
          <p>
            Outside the technical side, I bring a multicultural mindset and a hands-on
            attitude shaped by experiences in Madrid, Toulouse, Amsterdam and Ibiza.
            I am autonomous, adaptable and motivated by international environments where
            people need both precision and initiative.
          </p>
        </div>
      </section>

      <section className="section skills-section" id="skills">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>A technical profile built across engineering, data and decision tools</h2>
        </div>
        <div className="skills-grid">
          {skillGroups.map(({ title, icon: Icon, items }) => (
            <article className="skill-card" key={title}>
              <div className="skill-title">
                <Icon size={22} aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <div className="tags">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="readiness-band">
        <article>
          <Wrench size={24} aria-hidden="true" />
          <span>Hands-on engineering</span>
          <p>CAD, simulation, repair workflows, reports and technical problem solving.</p>
        </article>
        <article>
          <Target size={24} aria-hidden="true" />
          <span>Decision mindset</span>
          <p>Models, metrics, scenario comparison and clear recommendations.</p>
        </article>
        <article>
          <HomeIcon size={24} aria-hidden="true" />
          <span>Professional readiness</span>
          <p>Entering my final Master year and prepared to contribute in real teams.</p>
        </article>
      </section>

      <section className="section experience" id="experience">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Engineering mindset in real environments</h2>
        </div>
        <div className="timeline">
          <article>
            <span>Jul - Aug 2024</span>
            <div>
              <h3>Logistics & Technical Support Intern - Fujifilm Sonosite, Amsterdam</h3>
              <p>
                Reorganized warehouse product groups, supported ultrasound repair workflows
                and built a Python ML model to rank inventory items by repair, update or
                review priority.
              </p>
            </div>
          </article>
          <article>
            <span>2023 - 2024</span>
            <div>
              <h3>Waiter / Bartender - Black & Blue, Amsterdam</h3>
              <p>
                Worked in a fast-paced customer environment, strengthening adaptability,
                teamwork and calm execution under pressure.
              </p>
            </div>
          </article>
          <article>
            <span>2022 - Present</span>
            <div>
              <h3>Engineering Cycle - Vehicles Track, IPSA Toulouse</h3>
              <p>
                Aerospace systems, aerodynamics, CATIA modelling, finite elements,
                numerical analysis, optimisation and mission-oriented academic projects.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section interests-section" id="interests">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Centers of interest</p>
            <h2>What keeps me curious outside the classroom</h2>
          </div>
          <a className="text-link" href="/finance-app/index.html" target="_blank" rel="noreferrer">
            Finance app
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="interest-grid">
          {interestAreas.map(({ title, icon: Icon, text, link, linkText }) => (
            <article className="interest-card" key={title}>
              <div className="interest-icon">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                  {linkText}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section featured">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>Projects that show the direction I am taking</h2>
          </div>
          <a className="text-link" href="#projects">
            See all projects
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="featured-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section project-library" id="projects">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Project library</p>
            <h2>Reports, notebooks and engineering studies</h2>
          </div>
          <div className="filter-tabs" aria-label="Project filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="library-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} compact />
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Entering my final Master year and ready to get involved in professional life.</h2>
        </div>
        <div className="contact-actions">
          <a className="button primary" href="mailto:jeantixeront@gmail.com">
            <Mail size={17} aria-hidden="true" />
            Email me
          </a>
          <a className="button secondary" href="/finance-app/index.html" target="_blank" rel="noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            Finance app
          </a>
          <a
            className="button secondary"
            href="https://www.linkedin.com/in/juan-tixeront-880421277/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={17} aria-hidden="true" />
            LinkedIn
          </a>
          <a className="button secondary" href="/assets/downloads/cv-juan-tixeront.pdf" target="_blank" rel="noreferrer">
            <Download size={17} aria-hidden="true" />
            CV
          </a>
        </div>
      </section>
    </main>
  );
}
