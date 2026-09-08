#!/usr/bin/env python3
"""
Command-Line Interface for Offline Apple .pages Converter
Usage:
    python cli.py document.pages --format pdf,docx,txt
    python cli.py ./my_folder/ --output ./converted/ --recursive
"""

import argparse
import sys
import time
from pathlib import Path
from converter import PagesConverter

# Ensure clean UTF-8 console output on Windows (avoid charmap codec errors)
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ANSI Colors for terminal output
class Colors:
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"


def print_banner():
    banner = f"""
{Colors.CYAN}{Colors.BOLD}╔═══════════════════════════════════════════════════════════════╗
║          🍏 OFFLINE APPLE .PAGES CONVERTER (v1.0.0)           ║
║       Converts .pages to PDF, Word (DOCX), Text & Assets      ║
╚═══════════════════════════════════════════════════════════════╝{Colors.RESET}
"""
    print(banner)


def collect_pages_files(paths, recursive=False):
    files = []
    for p_str in paths:
        p = Path(p_str)
        if not p.exists():
            print(f"{Colors.YELLOW}[!] Path does not exist: {p}{Colors.RESET}")
            continue

        if p.is_file() and p.suffix.lower() == ".pages":
            files.append(p)
        elif p.is_dir():
            if p.suffix.lower() == ".pages":
                # Mac package bundle
                files.append(p)
            else:
                # Search directory
                pattern = "**/*.pages" if recursive else "*.pages"
                found = list(p.glob(pattern))
                files.extend(found)
    return sorted(list(set(files)))


def main():
    print_banner()

    parser = argparse.ArgumentParser(
        description="Convert Apple .pages files to PDF, DOCX, TXT, and extracted assets offline.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "inputs",
        nargs="+",
        help="One or more .pages files or directories to convert.",
    )
    parser.add_argument(
        "-f",
        "--format",
        default="pdf,docx,txt,assets",
        help="Comma-separated target formats: pdf, docx, txt, assets (default: all).",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Custom destination directory for converted files (default: beside input file).",
    )
    parser.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="Recursively scan directories for .pages files.",
    )

    args = parser.parse_args()

    # Parse requested formats
    if args.format.lower().strip() == "all":
        requested_formats = ["pdf", "docx", "txt", "assets"]
    else:
        requested_formats = [fmt.strip().lower() for fmt in args.format.split(",") if fmt.strip()]

    print(f"{Colors.DIM}Target Formats: {Colors.CYAN}{', '.join(requested_formats).upper()}{Colors.RESET}")
    if args.output:
        print(f"{Colors.DIM}Output Directory: {Colors.RESET}{args.output}")

    # Gather files
    files = collect_pages_files(args.inputs, recursive=args.recursive)
    if not files:
        print(f"{Colors.RED}[✗] No .pages documents found in specified path(s).{Colors.RESET}")
        sys.exit(1)

    print(f"{Colors.GREEN}[+] Found {len(files)} document(s) to process.{Colors.RESET}\n")

    converter = PagesConverter(output_dir=args.output)
    start_time = time.time()
    success_count = 0
    fail_count = 0

    for idx, f in enumerate(files, 1):
        print(f"[{idx}/{len(files)}] {Colors.BOLD}{f.name}{Colors.RESET}")
        try:
            res = converter.convert(
                f,
                formats=requested_formats,
                custom_output_dir=args.output,
            )
            if res["success"]:
                success_count += 1
                for fmt, path in res["outputs"].items():
                    print(f"     {Colors.GREEN}✓ {fmt.upper()}:{Colors.RESET} {path}")
                if res.get("asset_count", 0) > 0:
                    print(f"     {Colors.CYAN}🖼 Extracted {res['asset_count']} media asset(s){Colors.RESET}")
            else:
                fail_count += 1
                print(f"     {Colors.RED}✗ Failed: {res.get('message', 'Unknown error')}{Colors.RESET}")

        except Exception as e:
            fail_count += 1
            print(f"     {Colors.RED}✗ Error: {e}{Colors.RESET}")
        print()

    duration = time.time() - start_time
    print(f"{Colors.CYAN}═══════════════════════════════════════════════════════════════{Colors.RESET}")
    print(
        f"{Colors.BOLD}Completed in {duration:.2f}s | "
        f"{Colors.GREEN}Success: {success_count}{Colors.RESET} | "
        f"{Colors.RED if fail_count > 0 else Colors.DIM}Failed: {fail_count}{Colors.RESET}"
    )


if __name__ == "__main__":
    main()
