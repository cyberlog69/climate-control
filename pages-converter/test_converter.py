"""
Test script to verify PagesConverter offline functionality end-to-end.
Creates a valid sample .pages archive and runs converter against it.
"""

import sys
import zipfile
from pathlib import Path

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Use the virtual environment's pypdf and python-docx
from converter import PagesConverter


def create_sample_pages_file(output_path: Path):
    """Generates a synthetic Apple Pages container with QuickLook/Preview.pdf and Data/."""
    from pypdf import PageObject, PdfWriter
    from pypdf.generic import DecodedStreamObject, DictionaryObject, NameObject

    # 1. Create a sample PDF in memory
    writer = PdfWriter()
    # Simple blank page with text content stream
    page = PageObject.create_blank_page(width=612, height=792)

    # Add text stream directly
    stream = DecodedStreamObject()
    stream.set_data(
        b"BT /F1 24 Tf 100 700 Td (ClimateSphere Offline Apple Pages Test) Tj ET\n"
        b"BT /F1 14 Tf 100 650 Td (This document confirms the offline conversion engine functions cleanly.) Tj ET\n"
        b"BT /F1 12 Tf 100 600 Td (Generated 100% offline with zero cloud API keys.) Tj ET\n"
    )
    page[NameObject("/Contents")] = stream
    writer.add_page(page)

    pdf_bytes_path = output_path.parent / "_temp_preview.pdf"
    with open(pdf_bytes_path, "wb") as f:
        writer.write(f)

    # 2. Package into a .pages ZIP archive
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(pdf_bytes_path, arcname="QuickLook/Preview.pdf")
        # Dummy thumbnail
        zf.writestr("QuickLook/Thumbnail.jpg", b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00")
        # Sample embedded asset in Data/
        zf.writestr("Data/logo_figure.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
        # Sample index iwa
        zf.writestr("Index/Document.iwa", b"ClimateSphere Apple Pages Document Index Content")

    if pdf_bytes_path.exists():
        pdf_bytes_path.unlink()

    print(f"[+] Created synthetic .pages test document: {output_path}")


def main():
    test_dir = Path("./test_run")
    test_dir.mkdir(parents=True, exist_ok=True)
    sample_file = test_dir / "Sample_Climate_Report.pages"
    output_dir = test_dir / "converted_results"

    create_sample_pages_file(sample_file)

    converter = PagesConverter(output_dir=output_dir)
    print("\n[*] Running conversion to PDF, DOCX, TXT, Assets...")
    res = converter.convert(sample_file, formats=["pdf", "docx", "txt", "assets"])

    print("\n[*] Conversion Result:")
    print("    Success:", res["success"])
    print("    Preview Found:", res["preview_found"])
    print("    Message:", res["message"])
    for fmt, out_path in res["outputs"].items():
        p = Path(out_path)
        print(f"    - {fmt.upper()}: {p.name} (exists: {p.exists()}, size: {p.stat().st_size if p.is_file() else 'dir'})")

    # Assertions
    assert res["success"], "Conversion failed"
    assert (output_dir / "Sample_Climate_Report.pdf").exists(), "PDF not generated"
    assert (output_dir / "Sample_Climate_Report.txt").exists(), "TXT not generated"
    assert (output_dir / "Sample_Climate_Report.docx").exists(), "DOCX not generated"
    assert (output_dir / "Sample_Climate_Report_assets").exists(), "Assets directory not generated"

    print("\n[✓] ALL TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    main()
