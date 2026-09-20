"""Build the portfolio brief from the original AéroBox project documents."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/downloads/aerobox-project-brief.pdf"
W, H = 595.28, 841.89
INK, GREEN, GREY = "#202722", "#185e45", "#657069"
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle("AeroBox | Configurable transport drone | Project brief")
c.setAuthor("Jean Tixeront and Matis Lebrun")

def text(value, x, y, width=499, size=11, color=INK, font="Helvetica", leading=None):
    p = Paragraph(value, ParagraphStyle("body", fontName=font, fontSize=size, leading=leading or size*1.55, textColor=HexColor(color)))
    _, height = p.wrap(width, 700)
    p.drawOn(c, x, y-height)
    return y-height

def footer(page):
    c.setStrokeColor(HexColor("#dce2dc")); c.line(48, 48, W-48, 48)
    text("JUAN TIXERONT / PROJECT PORTFOLIO", 48, 35, size=8, color=GREY)
    text(f"AEROBOX    /    {page:02d}", W-153, 35, width=110, size=8, color=GREY)

def heading(label, title, page):
    text(label, 48, H-48, size=9, color=GREEN, font="Helvetica-Bold")
    y = text(title, 48, H-79, size=31, font="Times-Roman", leading=36)
    footer(page)
    return y-26

y = heading("ACADEMIC DESIGN STUDY / IPSA / MAY 2026", "AéroBox", 1)
y = text("A configurable transport-drone concept", 48, y+12, size=17, color=GREEN)
y = text("Jean Tixeront and Matis Lebrun", 48, y-10, size=10, color=GREY)
image = ImageReader(str(ROOT / "public/assets/projects/aerobox.webp"))
c.drawImage(image, 48, 345, width=499, height=300, preserveAspectRatio=True, anchor="c", mask="auto")
text("Original project render. Academic concept, not a flight-tested aircraft.", 48, 336, size=8, color=GREY)
y = text("The idea", 48, 300, size=20, font="Times-Roman")
y = text("AéroBox explores how a compact drone could adapt to different small-payload delivery missions. The project connects a parametric CATIA assembly with a configuration matrix, a bill of materials and a proposed manufacturing strategy.", 48, y-12)
y = text("The design takes inspiration from delivery-oriented drones and compact, agile aircraft. Amazon Prime Air and Red Bull are references only: neither company is a partner or an endorser of this academic project.", 48, y-12, size=10, color=GREY)
text("16 design variants", 48, 116, width=160, size=14, color=GREEN, font="Helvetica-Bold")
text("2 material families", 230, 116, width=170, size=14, color=GREEN, font="Helvetica-Bold")
text("Concept-stage CAD deliverable. No measured flight-performance claim.", 48, 86, size=9, color=GREY)
c.showPage()

y = heading("DESIGN LOGIC", "From a mission to an assembly", 2)
sections = [
    ("01 / Requirements", "The proposed product transports a light payload and is intended for vertical take-off and landing. Payload protection, access to electronics, stability and maintenance guide the layout. These are intended functions, not demonstrated operational capabilities."),
    ("02 / Parametric configuration", "The design matrix combines arm lengths of 0.30 and 0.50 m, propellers with two to five blades, and carbon-fibre or glass-fibre material options. The resulting 16 variants structure comparison within a common assembly. Mass and flight performance still need to be calculated and validated."),
    ("03 / Product architecture", "The central body groups the payload and electronic integration. Arms locate the motors, while propellers, protective elements and landing supports complete the layout. CATIA parameters make it possible to explore geometric changes without starting a new model for each variant."),
    ("04 / Manufacturing and sourcing", "The proposed process depends on the part family: laser cutting or CNC machining for plates, tube cutting and drilling for arms, printing or machining for connectors, and composite or printed prototypes for fairings. Electrical components are treated as bought-in items requiring mechanical integration."),
]
for title, body in sections:
    y = text(title, 48, y, size=15, color=GREEN, font="Helvetica-Bold")
    y = text(body, 48, y-10, size=10.5)-28
text("Supplier scope matters", 48, y, size=17, font="Times-Roman")
text("The subcontracted contribution described in the source report is limited to propeller drawings. It does not establish manufacture, dynamic balancing or flight validation of the propellers or complete drone.", 48, y-30, size=10.5)
c.showPage()

y = heading("DELIVERABLES & LIMITS", "What the project demonstrates", 3)
for title, body in [
    ("Engineering deliverables", "A parametric CAD assembly, project renders, a configuration matrix and documentation of components, manufacturing processes and supplier responsibilities."),
    ("Business relevance", "The work links a user need to product choices. It provides a basis for discussing variant complexity, make-or-buy decisions, maintenance and the evidence needed before presenting a concept as a usable product."),
    ("Not yet validated", "Final mass and centre of gravity, material assignments, interference checks, motor and battery selection, endurance, payload capability and flight behaviour. Proposed mission speeds or distances are not measured results."),
    ("Before any flight testing", "Complete the assembly and clearance checks, verify the configuration changes, confirm suitable materials and motor alignment, and use appropriately validated and balanced propellers. A render alone cannot establish structural or flight safety."),
    ("Sources and attribution", "Based on the original AéroBox presentation (May 2026), the General Concept of the Hybrid Transport Drone overview, and the Subcontracting Specification, BOM Overview and Manufacturing Strategy report (15 May 2026). Project co-developed by Jean Tixeront and Matis Lebrun. Portfolio brief prepared in September 2026."),
]:
    y = text(title, 48, y, size=15, color=GREEN, font="Helvetica-Bold")
    y = text(body, 48, y-9, size=10.5)-25
text("Full project and original manufacturing report", 48, y, size=10, font="Helvetica-Bold")
text('<link href="https://tixe1996.github.io/juan-tixeront/projects/aerobox/" color="#185e45">tixe1996.github.io/juan-tixeront/projects/aerobox/</link>', 48, y-22, size=10)
c.save()
print(OUT)
