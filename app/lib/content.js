export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path) => `${basePath}${path}`;
export const profile = {
  name: "Juan Tixeront",
  email: "jeantixeront@gmail.com",
  linkedin: "https://www.linkedin.com/in/juan-tixeront-880421277/",
  cv: "/assets/downloads/cv-juan-tixeront.pdf",
};

export const projects = [
  {
    slug: "home-capital-studio",
    title: "Home Capital Studio",
    category: "Finance & decision tools",
    filter: "Finance",
    type: "Interactive application",
    summary:
      "Making investment and property decisions easier to compare through cash flow, scenarios and long-term capital projections.",
    image: "/assets/projects/home-capital-studio.jpg",
    imageAlt:
      "The Home Capital Studio finance application with investment and property scenario inputs",
    app: "https://home-capital-studio.web.app",
    tools: [
      "React",
      "TypeScript",
      "Vite",
      "Scenario modelling",
      "Compound interest",
    ],
    question:
      "How can different financial choices be compared on the same basis?",
    approach:
      "Built an interactive application to compare investing, buying a home and buying a rental property. The models connect income, expenses, compound interest, debt-to-income ratios and allocation assumptions to a long-term view of capital.",
    takeaway:
      "A practical exercise in translating quantitative assumptions into a decision tool that someone can explore and understand.",
    points: [
      "Compare investment and property scenarios",
      "Explore cash flow and financing assumptions",
      "Inspect portfolio allocation and long-term outcomes",
    ],
    note: "Personal modelling project. Projections depend on the assumptions entered and are not investment recommendations.",
  },
  {
    slug: "aerobox",
    title: "AéroBox",
    category: "Product design & aerospace",
    filter: "Aerospace",
    type: "Academic CAD project · IPSA · May 2026",
    summary:
      "A configurable transport-drone concept, connecting mission requirements, parametric design and manufacturing decisions.",
    image: "/assets/projects/aerobox.webp",
    imageAlt:
      "Original AéroBox CAD render showing the central fuselage, four motor arms and landing structure",
    pdf: "/assets/downloads/aerobox-project-brief.pdf",
    supportingPdf: "/assets/downloads/aerobox-manufacturing-report.pdf",
    tools: [
      "CATIA V5",
      "Parametric CAD",
      "Excel configurations",
      "BOM",
      "Manufacturing strategy",
      "Product requirements",
    ],
    question:
      "How can one drone architecture adapt to different delivery missions?",
    approach:
      "Developed with Matis Lebrun at IPSA, AéroBox explores a compact transport drone with a configurable CAD assembly. The concept brings together delivery-oriented requirements and an agile aircraft layout. Mission choices inform arm length, propeller geometry, payload protection and material options.",
    takeaway:
      "A product only becomes credible when the requirements, geometry and manufacturing choices agree. This project connects engineering detail with the practical questions behind a product: what it is for, how it can be made and what still needs validation.",
    points: [
      "Develop a parametric CATIA assembly and configuration matrix",
      "Compare 16 design variants across arm length, blade count and material family",
      "Document the bill of materials and proposed manufacturing processes",
      "Define supplier scope and the checks needed before any physical flight testing",
    ],
    metrics: [
      { value: "16", label: "Design configurations" },
      { value: "2", label: "Material families" },
      { value: "CAD", label: "Concept-stage deliverable" },
    ],
    note: "Academic concept co-developed by Jean Tixeront and Matis Lebrun, not a flight-tested aircraft. Mass, endurance, speed and payload performance remain unvalidated. Amazon and Red Bull are design references, not project partners or endorsers.",
  },
  {
    slug: "push-quest",
    title: "Push Quest",
    category: "Computer vision & product development",
    filter: "Data & ML",
    type: "Personal project · Python desktop system & browser demo",
    summary:
      "A camera-based push-up counter exploring pose tracking, movement detection and clear feedback. Try the browser demo.",
    image: "/assets/projects/push-quest.webp",
    imageAlt:
      "Push Quest browser demo with an explicitly simulated pose sequence and movement counter",
    demo: "/projects/push-quest/demo/",
    tools: [
      "Python",
      "MediaPipe",
      "OpenCV",
      "State machines",
      "PySide6",
      "JavaScript",
      "Automated testing",
    ],
    question:
      "How do you turn a noisy camera signal into a useful movement counter?",
    approach:
      "The original Python application combines pose estimation, a stable-plank gate and a temporal state machine. Its later desktop versions add session controls, identity checks and coaching feedback. The portfolio demo adapts the central movement-counting idea for the browser, with local camera or video processing and no account required.",
    takeaway:
      "Building the detector made evaluation as important as the interface. A count, a form assessment and an identity check are different claims, and each needs its own tests. The browser demo deliberately focuses on visible, explainable movement detection.",
    points: [
      "Track body landmarks and calculate joint angles with MediaPipe",
      "Require a stable starting posture and a complete down-and-up cycle",
      "Discard interrupted movements when the pose is lost",
      "Separate software regression tests from real-world accuracy claims",
    ],
    metrics: [
      { value: "94 + 56", label: "Desktop tests documented in V31" },
      { value: "Local", label: "Browser video processing" },
      { value: "Live", label: "Camera and video demo" },
    ],
    note: "Experimental movement demo, not a medical assessment or certified form judge. The browser version does not include the desktop classifier or facial verification. The V31 test counts refer to the documented desktop release, not to browser accuracy. No financial reward or official ranking should depend on its output.",
  },
  {
    slug: "image-diffusion-numerical-methods",
    title: "Images through equations",
    category: "Image processing & numerical methods",
    filter: "Computation",
    type: "Academic Python study · MA327 · June 2025",
    summary:
      "Making differential equations visible: exploring image diffusion, texture and detail through Python experiments.",
    image: "/assets/projects/image-math/seascape-exp.jpg",
    imageAlt:
      "Saved anisotropic-diffusion output from the MA327 Python study, applied to a seascape painting",
    source: "/assets/downloads/ma327-python-study.zip",
    tools: ["Python", "NumPy", "OpenCV", "scikit-image", "Runge-Kutta", "Finite differences", "Image diffusion"],
    question: "What happens when an image becomes the initial condition of an equation?",
    approach:
      "The MA327 coursework moves from pendulum dynamics to image processing. RGB channels become numerical fields: a heat-equation model smooths a landscape, while gradient-based and anisotropic updates explore how texture and edges change. The Python files include RK2 and RK4 experiments, boundary handling and visual comparisons.",
    takeaway:
      "Images make numerical assumptions tangible. Changing the update rule or its parameters changes the result, so a convincing visual effect is only the beginning: stability, boundary conditions and implementation details still matter.",
    points: [
      "Implement RK2 and RK4 experiments for pendulum dynamics",
      "Apply a finite-difference heat operator to separate RGB channels",
      "Explore gradient-based processing and two anisotropic conduction functions",
      "Compare original inputs with outputs saved alongside the Python code",
    ],
    note: "Academic numerical experiments, not a trained AI model or a validated restoration tool. The comparisons use saved project outputs, not a new execution of the code. Paintings and photographs are study inputs, not original artworks by Juan. The source archive retains the original scripts and their local-path assumptions.",
  },
  {
    slug: "lung-cancer-data-science",
    title: "Lung cancer data science",
    category: "Data science & machine learning",
    filter: "Data & ML",
    type: "Academic research project · IPSA 2026",
    summary:
      "From a 309-patient survey to 1,139 CT nodules: exploring data, building models and evaluating their limits.",
    image: "/assets/projects/cancer-pca.png",
    imageAlt:
      "Principal component projection of the patient survey, extracted from the original notebook",
    pdf: "/assets/downloads/lung-cancer-data-science.pdf",
    html: "/assets/downloads/lung-cancer-data-science.html",
    tools: [
      "Python",
      "pandas",
      "NumPy",
      "scikit-learn",
      "PCA",
      "K-Means",
      "Logistic regression",
      "MLP",
      "CNN",
    ],
    question:
      "What can structured patient data and CT images tell us, and where do the models reach their limits?",
    approach:
      "Co-authored with Audrey Valero-Petit for Introduction to Data Science at IPSA Toulouse. The work combines a from-scratch PCA and logistic regression study with a LIDC-IDRI imaging pipeline, from DICOM and XML annotations to radiomic features and neural networks.",
    takeaway:
      "The project brings together data preparation, model comparison and clear reporting. The most transferable lesson is to question the data and the evaluation before trusting an attractive result.",
    points: [
      "Standardise data and implement PCA using covariance and SVD",
      "Extract and explore 15 radiomic features from CT nodules",
      "Compare interpretable models, MLP and convolutional approaches",
    ],
    note: "Academic exploration using public datasets, not a clinically validated diagnostic system. The original notebook contains differing performance summaries, so no single accuracy figure is presented as a validated result.",
  },
  {
    slug: "ucav-aerodynamics",
    title: "UCAV aerodynamics",
    category: "Aerodynamics & CAD",
    filter: "Aerospace",
    type: "Engineering study",
    summary:
      "Connecting CATIA geometry reconstruction with experimental and numerical aerodynamic analysis.",
    image: "/assets/projects/ucav-model.jpg",
    imageAlt: "The UCAV geometry model from the original aerodynamics report",
    pdf: "/assets/downloads/ucav-aerodynamics.pdf",
    tools: [
      "CATIA V5",
      "Aerodynamics",
      "Experimental analysis",
      "CFD thinking",
    ],
    question:
      "How does an aircraft geometry translate into aerodynamic behaviour?",
    approach:
      "Reconstructed a UCAV geometry in CATIA and studied its aerodynamic characteristics through experimental methodology and numerical engineering analysis.",
    takeaway:
      "A technical basis for discussing aircraft performance, design trade-offs and the reasoning behind engineering choices.",
    points: [
      "Reconstruct and inspect the aircraft geometry",
      "Connect experimental observations with numerical analysis",
      "Document assumptions and aerodynamic behaviour",
    ],
  },
  {
    slug: "turkish-aerospace-strategy",
    title: "Turkish Aerospace strategy",
    category: "Aerospace strategy",
    filter: "Strategy",
    type: "Strategic analysis",
    summary:
      "An aerospace and defence market study connecting competition, stakeholders and strategic constraints.",
    image: "/assets/projects/turkish-aerospace-strategy.jpg",
    imageAlt: "Cover of the Turkish Aerospace strategic analysis report",
    pdf: "/assets/downloads/turkish-aerospace-strategy.pdf",
    tools: ["Strategy", "Aerospace defence", "Market analysis", "Competition"],
    question:
      "What shapes the strategic position of an aerospace manufacturer?",
    approach:
      "Developed a structured diagnosis of Turkish Aerospace in the aerospace and defence market, examining sovereignty, stakeholders, competition and strategic constraints.",
    takeaway:
      "An opportunity to connect technical industry knowledge with the commercial and institutional context in which companies compete.",
    points: [
      "Map stakeholders and the competitive environment",
      "Consider sovereignty and industrial constraints",
      "Structure the findings into a strategic diagnosis",
    ],
  },
  {
    slug: "finite-difference-aerodynamics",
    title: "Finite-difference aerodynamics",
    category: "Aerodynamics & numerical methods",
    filter: "Aerospace",
    type: "Numerical study",
    summary:
      "Testing numerical solutions for advection and diffusion through stability, consistency and convergence analysis.",
    image: "/assets/projects/finite-difference-aerodynamics.jpg",
    imageAlt: "Cover of the finite-difference aerodynamics report",
    pdf: "/assets/downloads/finite-difference-aerodynamics.pdf",
    tools: ["Numerical methods", "Von Neumann", "Taylor expansions", "Excel"],
    question: "When is a numerical approximation reliable?",
    approach:
      "Studied advection and diffusion equations using Lax-Wendroff and Euler schemes, with stability, consistency and convergence analysis.",
    takeaway:
      "A disciplined approach to checking a model's assumptions and behaviour before interpreting its output.",
    points: [
      "Implement and compare finite-difference schemes",
      "Investigate stability through Von Neumann analysis",
      "Study consistency and convergence",
    ],
  },
  {
    slug: "matlab-vibration-cantilever-plate",
    title: "Vibration of a cantilever plate",
    category: "Engineering computation",
    filter: "Computation",
    type: "MATLAB study",
    summary:
      "A MATLAB workflow for vibration modes, compliance matrices and the static response of a cantilever plate.",
    image: "/assets/projects/matlab-vibration-cantilever-plate.jpg",
    imageAlt: "Cover of the MATLAB cantilever plate vibration report",
    pdf: "/assets/downloads/matlab-vibration-cantilever-plate.pdf",
    tools: [
      "MATLAB",
      "Modal analysis",
      "Eigenvalues",
      "Engineering computation",
    ],
    question: "How does a structure respond to static and dynamic loads?",
    approach:
      "Used modal analysis, compliance matrices and a MATLAB workflow to study vibration modes and static response in a cantilever plate.",
    takeaway:
      "Turning a physical problem into a computational model and communicating the resulting structural behaviour.",
    points: [
      "Formulate compliance matrices",
      "Analyse eigenvalues and vibration modes",
      "Connect computational results with physical response",
    ],
  },
  {
    slug: "liquid-hydrogen-road-haulage",
    title: "Hydrogen for heavy transport",
    category: "Energy & propulsion",
    filter: "Aerospace",
    type: "Technology study",
    summary:
      "Investigating liquid hydrogen, fuel cells and combustion technologies for heavy road haulage.",
    image: "/assets/projects/liquid-hydrogen-road-haulage.jpg",
    imageAlt: "Cover of the liquid hydrogen for road haulage study",
    pdf: "/assets/downloads/liquid-hydrogen-road-haulage.pdf",
    tools: ["Hydrogen", "Thermodynamics", "Propulsion", "Energy systems"],
    question:
      "What does adopting hydrogen mean at the level of an entire transport system?",
    approach:
      "Studied hydrogen technologies for heavy road haulage, including hydrogen internal combustion engines, fuel cells, thermal management, performance and component adaptation.",
    takeaway:
      "A systems perspective on comparing alternative technologies and understanding the constraints behind adoption.",
    points: [
      "Examine hydrogen combustion and fuel-cell options",
      "Consider thermal management and system performance",
      "Identify component adaptation requirements",
    ],
  },
  {
    slug: "supersonic-nozzle-design",
    title: "Supersonic nozzle design",
    category: "Turbomachinery",
    filter: "Aerospace",
    type: "Engineering design",
    summary:
      "Combining thermodynamic fundamentals with the numerical aerodynamic design of a 2D supersonic nozzle.",
    image: "/assets/projects/supersonic-nozzle-design.jpg",
    imageAlt: "Cover of the supersonic nozzle design and analysis report",
    pdf: "/assets/downloads/supersonic-nozzle-design.pdf",
    tools: [
      "Turbomachinery",
      "Supersonic flow",
      "Thermodynamics",
      "Nozzle design",
    ],
    question:
      "How can thermodynamic requirements be translated into an aerodynamic design?",
    approach:
      "Developed a turbomachinery project on a two-dimensional supersonic nozzle, combining preliminary thermodynamics with numerical aerodynamic design.",
    takeaway:
      "Connecting requirements, calculations and geometry in a traceable engineering workflow.",
    points: [
      "Establish the thermodynamic basis",
      "Develop the numerical aerodynamic design",
      "Analyse the supersonic flow requirements",
    ],
  },
  {
    slug: "advanced-equations-algorithms",
    title: "Advanced equations & algorithms",
    category: "Applied mathematics",
    filter: "Computation",
    type: "Mathematical study",
    summary:
      "Exploring Euler-Lagrange equations, variational analysis and their physical applications.",
    image: "/assets/projects/advanced-equations-algorithms.jpg",
    imageAlt: "Cover of the advanced equations and algorithms report",
    pdf: "/assets/downloads/advanced-equations-algorithms.pdf",
    tools: ["Applied maths", "Euler-Lagrange", "Variational analysis"],
    question:
      "How do mathematical principles describe optimisation in physical systems?",
    approach:
      "Studied Euler-Lagrange equations through variational analysis, integration by parts and applications to physical problems.",
    takeaway:
      "Strengthening the mathematical foundations behind modelling and optimisation.",
    points: [
      "Formulate variational problems",
      "Work through Euler-Lagrange derivations",
      "Connect equations to physical applications",
    ],
  },
  {
    slug: "optical-flow-motion-images",
    title: "Motion detection in images",
    category: "Applied mathematics & vision",
    filter: "Computation",
    type: "Computer vision study",
    summary:
      "Formalising apparent motion through optical flow, least squares and variational methods.",
    image: "/assets/projects/optical-flow-motion-images.jpg",
    imageAlt: "Cover of the apparent motion detection report",
    pdf: "/assets/downloads/optical-flow-motion-images.pdf",
    tools: [
      "Optical flow",
      "Least squares",
      "Variational methods",
      "Image analysis",
    ],
    question: "How can motion be inferred from changes between images?",
    approach:
      "Formalised an optical-flow problem and explored least-squares and variational methods, comparing approaches and image-analysis applications.",
    takeaway:
      "A study in extracting useful information from observations through mathematical modelling.",
    points: [
      "Formalise the apparent-motion problem",
      "Explore least-squares and variational approaches",
      "Compare methods and image-analysis applications",
    ],
  },
];

export const filters = [
  "All",
  "Finance",
  "Aerospace",
  "Data & ML",
  "Strategy",
  "Computation",
];

export const experiences = [
  {
    slug: "pld-space",
    company: "PLD Space",
    role: "Mechanical Engineering Intern",
    date: "Jun 2026 - present",
    location: "Alicante, Spain",
    current: true,
    summary:
      "Contributing to MIURA 5, an orbital launch vehicle, through mechanical design, manufacturing and procurement.",
    points: [
      "Design mechanical parts and components with Siemens NX, from CAD definition to manufacturing and assembly support.",
      "Support procurement of parts, components and materials, including supplier coordination, technical selection and purchasing.",
    ],
    relevance:
      "Technical requirements, supplier dialogue and purchasing decisions.",
    tags: ["MIURA 5", "Siemens NX", "Mechanical design", "Procurement"],
    output:
      "Mechanical component designs and support for manufacturing, assembly and procurement on MIURA 5.",
    perspective:
      "Working between design requirements and supplier constraints has shown me how technical choices affect purchasing and delivery. It is a practical foundation for discussing complex products with different stakeholders.",
  },
  {
    slug: "fujifilm-sonosite",
    company: "Fujifilm Sonosite",
    role: "Logistics & Technical Support Intern",
    date: "Jul - Aug 2024",
    location: "Amsterdam, Netherlands",
    summary:
      "Combined hands-on support for ultrasound systems with a data-led approach to inventory prioritisation.",
    points: [
      "Supported diagnostics, repair and maintenance while reorganising warehouse product groups.",
      "Developed a Python machine learning model to rank items by repair, update and review priority using service and expiry deadlines.",
    ],
    relevance:
      "Operational priorities, service quality and data-informed decisions.",
    tags: ["Python", "Machine learning", "Technical support", "Logistics"],
    output:
      "A Python model for prioritising inventory by repair, update and review needs, alongside ultrasound-system support.",
    perspective:
      "The challenge was to translate service and expiry deadlines into a useful order of priority. The experience connected data work with the operational needs of a technical-support team.",
  },
  {
    slug: "black-and-blue",
    company: "Black & Blue",
    role: "Waiter / Bartender",
    date: "2023 - 2024",
    location: "Amsterdam, Netherlands",
    summary:
      "Customer-facing work in a fast-paced international hospitality environment.",
    points: [
      "Communicated with international customers and worked closely with the team during busy services.",
      "Developed adaptability, attention to customer needs and calm execution under pressure.",
    ],
    relevance:
      "Listening, customer relationships and clear communication under pressure.",
    tags: ["Customer service", "Teamwork", "International environment"],
    output:
      "Direct customer service and team coordination in an international restaurant and bar.",
    perspective:
      "Listening carefully, adapting to different customers and keeping communication clear during busy services are skills I want to carry into client-facing business roles.",
  },
  {
    slug: "eurospacehub",
    company: "EuroSpaceHub Forum",
    role: "Event Logistics Volunteer",
    date: "May 2023",
    location: "Ibiza, Spain",
    summary:
      "Supported an aerospace event through speaker coordination, logistics and participant reception.",
    points: [
      "Helped coordinate speakers, event operations and the welcome experience for participants.",
    ],
    relevance: "Stakeholder coordination and professional event communication.",
    tags: ["Aerospace", "Event coordination", "Participant reception"],
    output:
      "Speaker coordination, participant reception and logistical support for an aerospace forum.",
    perspective:
      "Supporting a professional event reinforced the importance of preparation and clear communication when people with different expectations need to work together.",
  },
  {
    slug: "alstom",
    company: "Alstom",
    role: "Observation Internship",
    date: "2019",
    location: "Madrid, Spain",
    summary:
      "An early introduction to engineering operations and management processes.",
    points: [
      "Observed how engineering work and management processes connect in an industrial environment.",
    ],
    relevance: "Understanding how technical work fits into an organisation.",
    tags: ["Industry", "Engineering operations"],
    output:
      "An observation placement introducing engineering operations and management processes.",
    perspective:
      "This early exposure helped me understand how individual engineering tasks fit into a wider industrial organisation.",
  },
];

export const education = [
  {
    school: "IPSA Toulouse",
    qualification: "Engineering Cycle · Vehicles Track",
    date: "2022 - present",
    text: "Aerodynamics, aerospace systems, numerical analysis, optimisation, finite elements and CATIA V5. Projects include the conceptual design of a space module, from structures and propulsion to mission analysis.",
  },
  {
    school: "Universidad de Zaragoza",
    qualification: "Summer School · New Aviation & Space Technologies",
    date: "Summer 2025",
    text: "Industry sessions in Teruel with Eurocontrol, PLD Space and Tarmac Aerosave, alongside workshops on drones, aircraft processes and rocket propulsion.",
  },
  {
    school: "Lycée Français de Madrid",
    qualification: "Scientific Baccalaureate · Mention Bien",
    date: "2019 - 2022",
    text: "Mathematics and Engineering Sciences.",
  },
];

export const skills = [
  {
    title: "Finance & decision modelling",
    icon: "finance",
    text: "Applied through Home Capital Studio and personal finance projects.",
    items: [
      "Compound interest",
      "Scenario analysis",
      "Cash-flow modelling",
      "Portfolio allocation",
      "Real-estate ratios",
      "Excel models",
    ],
    href: "/projects/home-capital-studio/",
    link: "Finance project",
  },
  {
    title: "Commercial & interpersonal",
    icon: "people",
    text: "Grounded in procurement, customer service and international teamwork.",
    items: [
      "Supplier coordination",
      "Technical purchasing",
      "Customer communication",
      "Stakeholder coordination",
      "Teamwork",
      "Adaptability",
      "Analytical thinking",
      "Autonomy",
    ],
    href: "/experience/",
    link: "Professional experience",
  },
  {
    title: "Aerospace & mechanical engineering",
    icon: "plane",
    text: "From launcher components to aircraft geometry and systems.",
    items: [
      "Aerodynamics",
      "Aerospace systems",
      "Mechanical design",
      "CATIA V5",
      "Siemens NX",
      "STAR-CCM+",
      "ANSYS",
      "Patran",
      "Nastran",
      "Turbomachinery",
    ],
    href: "/projects/ucav-aerodynamics/",
    link: "Aerodynamics project",
  },
  {
    title: "Data science & machine learning",
    icon: "data",
    text: "End-to-end academic pipelines and an inventory prioritisation model.",
    items: [
      "Python",
      "Jupyter",
      "pandas",
      "NumPy",
      "scikit-learn",
      "PCA",
      "K-Means",
      "Logistic regression",
      "MLP / CNN",
      "ML pipelines",
    ],
    href: "/projects/lung-cancer-data-science/",
    link: "Lung cancer study",
  },
  {
    title: "Scientific & numerical computing",
    icon: "chart",
    text: "Mathematical methods that support robust technical analysis.",
    items: [
      "MATLAB",
      "Finite differences",
      "Modal analysis",
      "Eigenvalues",
      "Variational methods",
      "Optical flow",
      "Optimisation",
      "Finite elements",
    ],
    href: "/projects/matlab-vibration-cantilever-plate/",
    link: "MATLAB project",
  },
  {
    title: "Development & productivity",
    icon: "code",
    text: "Tools for building, documenting and sharing practical work.",
    items: [
      "React",
      "TypeScript",
      "Git",
      "Local web apps",
      "Automation",
      "MS Office",
      "LaTeX",
    ],
    href: "/projects/",
    link: "Project library",
  },
];

export const languages = [
  { code: "ES", name: "Spanish", level: "Native" },
  { code: "FR", name: "French", level: "Native" },
  { code: "EN", name: "English", level: "Advanced" },
  { code: "IT", name: "Italian", level: "Intermediate" },
];
