# -*- coding: utf-8 -*-
"""
Fill the user's official PPTX template (PBL_Project_Poster_Template DBMS.pptx)
with precision and high fidelity.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOWNLOADS_DIR = r"C:\Users\saisa\Downloads"
TEMPLATE_PATH = os.path.join(DOWNLOADS_DIR, "PBL_Project_Poster_Template DBMS.pptx")
OUTPUT_PROJECT_PATH = os.path.join(BASE_DIR, "PBL_Project_Poster_DBMS_Completed.pptx")
OUTPUT_DOWNLOADS_PATH = os.path.join(DOWNLOADS_DIR, "PBL_Project_Poster_DBMS_Completed.pptx")

def fill_text_frame(text_frame, paragraphs_data):
    """
    paragraphs_data: list of tuples (text, font_size_pt, is_bold, color_rgb)
    """
    text_frame.word_wrap = True
    # Clear existing paragraphs
    for i in range(len(text_frame.paragraphs) - 1, 0, -1):
        p = text_frame.paragraphs[i]
        p._p.getparent().remove(p._p)

    for idx, item in enumerate(paragraphs_data):
        if idx == 0:
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()

        text, font_size, is_bold, color = item
        p.text = text
        if p.runs:
            run = p.runs[0]
            run.font.name = "Calibri"
            if font_size:
                run.font.size = Pt(font_size)
            if is_bold is not None:
                run.font.bold = is_bold
            if color:
                run.font.color.rgb = color

def main():
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Error: Template not found at {TEMPLATE_PATH}")
        return

    prs = Presentation(TEMPLATE_PATH)
    slide = prs.slides[0]

    # Color definitions
    DARK_BLUE = RGBColor(15, 30, 60)
    DARK_TEXT = RGBColor(30, 41, 59)
    MUTED_TEXT = RGBColor(71, 85, 105)

    # 1. Shape 3: Header (Title, Team, Course)
    s3 = slide.shapes[3]
    s3_data = [
        ("BOOKVERSE: An Immersive 3D Interactive Digital Library & Distributed Social Reading Platform", 28.0, True, DARK_BLUE),
        ("Team ID: BV-PBL-042  |  Section: S-14  |  Members: J. SAI SATYAN - 2520030088,  M. TANMAYEE - 2520030339,  K. DEVIKA - 2520030329  |  Guide: Dr. K. V. Ramanathan", 12.5, False, DARK_TEXT),
        ("Database Systems Engineering and Distributed Backend Development (25CS1302E)  |  KLH Bachupally Campus, CSE  |  PBL 2026-27", 12.0, False, MUTED_TEXT)
    ]
    fill_text_frame(s3.text_frame, s3_data)

    # 2. Shape 6: Abstract
    s6 = slide.shapes[6]
    s6_data = [
        ("BookVerse is an end-to-end full-stack literary platform engineered for bibliophiles and students, unifying high-performance relational database management with an interactive 3D skeuomorphic reading experience. Powered by an asynchronous FastAPI (Python) REST backend, MySQL 8.0 (InnoDB) database, and React 18 client with 3D canvas scroll-turn physics.", 13.0, False, DARK_TEXT),
        ("Main Outcome: Eliminates catalog latency, guarantees complete referential integrity with cascading schemas, and restores the tactile nostalgia of paper books.", 13.0, True, DARK_BLUE)
    ]
    fill_text_frame(s6.text_frame, s6_data)

    # 3. Shape 9: Problem Statement & Objectives
    s9 = slide.shapes[9]
    s9_data = [
        ("Problem: Conventional book platforms (e.g. Goodreads, Calibre) suffer from outdated interfaces, sluggish monolithic queries, intrusive advertisements, detached shelf tracking, and brittle external cover hotlinks (HTTP 404).", 12.5, False, DARK_TEXT),
        ("Objective 1: Design and normalize a MySQL 8.0 schema to 3NF with foreign-key cascades for 58+ classic volumes.", 12.0, False, DARK_TEXT),
        ("Objective 2: Build an asynchronous FastAPI REST gateway with sub-35ms CRUD endpoints and Pydantic validation.", 12.0, False, DARK_TEXT),
        ("Objective 3: Implement an interactive 3D open-tome scroll canvas with dynamic leaf flippers and vector stationery.", 12.0, False, DARK_TEXT),
        ("Scope: Readers & researchers. Modules: Grand Library Catalog, Reading Shelf, Voices & Critique, Rituals, AI Oracle.", 12.0, False, MUTED_TEXT)
    ]
    fill_text_frame(s9.text_frame, s9_data)

    # 4. Shape 12: Existing vs Proposed Table
    table = slide.shapes[12].table
    table_content = [
        ("Feature", "Existing System", "Proposed System"),
        ("Visual Immersion", "Static 2D flat lists, heavy ad clutter", "3D Open Tome with scroll-turn animations & pencils"),
        ("Cover Delivery", "External CDN links prone to HTTP 404s", "100% Local uploads cache (58/58 books verified)"),
        ("Backend Architecture", "Monolithic blocking server queries", "Asynchronous ASGI (FastAPI + Uvicorn) <35ms"),
        ("Progress Tracking", "Rigid static text counters; manual submit", "Real-time range sliders with instant percentage sync"),
        ("Sensory Gap", "Tools feel like clinical spreadsheets", "BookVerse bridges digital speed with paper nostalgia")
    ]
    for r_idx, row in enumerate(table_content):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            if p.runs:
                p.runs[0].font.name = "Calibri"
                p.runs[0].font.size = Pt(11.5 if r_idx > 0 else 12.5)
                p.runs[0].font.bold = (r_idx == 0 or c_idx == 0)

    # 5. Shape 15: Feasibility Study
    s15 = slide.shapes[15]
    s15_data = [
        ("Technical: Built with Python 3.12, FastAPI, SQLAlchemy ORM, MySQL 8.0, React 18, and CSS3 3D Transforms.", 13.0, False, DARK_TEXT),
        ("Economic: 100% open-source software stack with zero licensing fees; operates on commodity servers.", 13.0, False, DARK_TEXT),
        ("Operational: Intuitive chapter-based layout; dark & light parchment modes; zero learning curve for users.", 13.0, False, DARK_TEXT),
        ("Schedule: Completed across 5 structured sprints within the academic semester timeline.", 13.0, False, DARK_TEXT)
    ]
    fill_text_frame(s15.text_frame, s15_data)

    # 6. Shape 18: Tools & Technologies
    s18 = slide.shapes[18]
    s18_data = [
        ("Front-End: React 18 (SPA), Vite 8.3, React Router 6, CSS3 3D Transforms, Canvas API", 13.0, False, DARK_TEXT),
        ("Back-End: FastAPI (Python 3.12+), Uvicorn ASGI Server, Pydantic v2, SQLAlchemy 2.0", 13.0, False, DARK_TEXT),
        ("Database: MySQL 8.0 (InnoDB Engine, utf8mb4_0900_ai_ci, PyMySQL Connection Pool)", 13.0, False, DARK_TEXT),
        ("Tools: Git & GitHub, Postman, VS Code, Pillow (PIL), Draw.io", 13.0, False, DARK_TEXT)
    ]
    fill_text_frame(s18.text_frame, s18_data)

    # 7. Shape 21 & 22: System Architecture Diagram
    arch_img_path = os.path.join(BASE_DIR, "arch_diagram.png")
    if os.path.exists(arch_img_path):
        s22 = slide.shapes[22]
        s22.text_frame.text = ""  # Clear placeholder text
        s21 = slide.shapes[21]
        slide.shapes.add_picture(arch_img_path, s21.left, s21.top, s21.width, s21.height)

    # 8. Shape 25 & 26: ER Diagram & Database Design
    er_img_path = os.path.join(BASE_DIR, "er_diagram.png")
    if os.path.exists(er_img_path):
        s26 = slide.shapes[26]
        s26.text_frame.text = ""  # Clear placeholder text
        s25 = slide.shapes[25]
        slide.shapes.add_picture(er_img_path, s25.left, s25.top, s25.width, s25.height)

    # 9. Shape 29 & 30: Screenshot 1 (Grand Library)
    s1_img_path = os.path.join(BASE_DIR, "screenshot1.png")
    if os.path.exists(s1_img_path):
        s30 = slide.shapes[30]
        s30.text_frame.text = ""  # Clear placeholder text
        s29 = slide.shapes[29]
        slide.shapes.add_picture(s1_img_path, s29.left, s29.top, s29.width, s29.height)

    # 10. Shape 31 & 32: Screenshot 2 (3D Tome & Reading Shelf)
    s2_img_path = os.path.join(BASE_DIR, "screenshot2.png")
    if os.path.exists(s2_img_path):
        s32 = slide.shapes[32]
        s32.text_frame.text = ""  # Clear placeholder text
        s31 = slide.shapes[31]
        slide.shapes.add_picture(s2_img_path, s31.left, s31.top, s31.width, s31.height)

    # 11. Shape 35: Results & Testing
    s35 = slide.shapes[35]
    s35_data = [
        ("• API Response Latency: < 35 ms across all CRUD endpoints (Books, Reviews, Shelves).", 12.5, False, DARK_TEXT),
        ("• Catalog Scale: 58 total books (48 requested classics + 10 contemporary titles).", 12.0, False, DARK_TEXT),
        ("• Cover Availability: 100% local files verified in /uploads/ with HTTP 200 OK.", 12.0, False, DARK_TEXT),
        ("• Security & Robustness: 100% SQL queries parameterized via ORM; Pydantic validation; 60 FPS 3D scroll physics.", 12.0, False, DARK_TEXT)
    ]
    fill_text_frame(s35.text_frame, s35_data)

    # 12. Shape 38: Conclusion
    s38 = slide.shapes[38]
    s38_data = [
        ("Achieved: Successfully built and deployed a production-grade distributed digital library platform.", 13.0, True, DARK_BLUE),
        ("Impact: Proves that rigorous MySQL database normalization and FastAPI asynchronous architecture can be seamlessly integrated with a captivating 3D tactile user interface, meeting all curriculum objectives.", 12.5, False, DARK_TEXT)
    ]
    fill_text_frame(s38.text_frame, s38_data)

    # 13. Shape 41: Future Scope
    s41 = slide.shapes[41]
    s41_data = [
        ("• Enhancement 1: Real-time WebSocket co-reading rooms with synchronized margin annotations and live discussion.", 12.5, False, DARK_TEXT),
        ("• Enhancement 2: Vector embeddings (RAG / AI) for natural language semantic trope and mood matching.", 12.5, False, DARK_TEXT),
        ("• Enhancement 3: Progressive Web App (PWA) with IndexedDB client caching for offline reading sync.", 12.0, False, MUTED_TEXT)
    ]
    fill_text_frame(s41.text_frame, s41_data)

    # 14. Shape 42: References
    s42 = slide.shapes[42]
    s42_data = [
        ("References: [1] R. Elmasri & S. Navathe, Fundamentals of Database Systems, 7th ed., Pearson, 2016.   [2] S. Ramirez, FastAPI Modern Python Web APIs, Packt, 2023.   [3] Oracle, MySQL 8.0 Reference Manual: InnoDB Engine, 2026.", 10.5, False, MUTED_TEXT)
    ]
    fill_text_frame(s42.text_frame, s42_data)

    # 15. Shape 43 & 44: QR Code
    qr_img_path = os.path.join(BASE_DIR, "qr_github.png")
    if os.path.exists(qr_img_path):
        s44 = slide.shapes[44]
        s44.text_frame.text = ""  # Clear placeholder text
        s43 = slide.shapes[43]
        slide.shapes.add_picture(qr_img_path, s43.left, s43.top, s43.width, s43.height)

    # Save to both locations
    prs.save(OUTPUT_PROJECT_PATH)
    print(f"[OK] Saved Completed Template to: {OUTPUT_PROJECT_PATH}")
    try:
        prs.save(OUTPUT_DOWNLOADS_PATH)
        print(f"[OK] Saved Completed Template to: {OUTPUT_DOWNLOADS_PATH}")
    except Exception as e:
        print(f"Warning: Could not save to downloads: {e}")

if __name__ == "__main__":
    main()
