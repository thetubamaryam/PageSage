# backend/utils/pdf_utils.py
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

def generate_pdf(content: str) -> bytes:
    """
    Create a nicely formatted PDF and return bytes.
    """
    if not content:
        content = "No content provided."

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=40, leftMargin=40,
                            topMargin=60, bottomMargin=18)

    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph("PageSage Summary", styles["Title"]))
    story.append(Spacer(1, 12))

    # Body (split paragraphs by blank lines)
    for para in content.split("\n\n"):
        safe_para = para.replace("\n", "<br/>")
        story.append(Paragraph(safe_para, styles["Normal"]))
        story.append(Spacer(1, 10))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
