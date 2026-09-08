"""
Modern Dark-Themed Desktop GUI for Offline Apple .pages Converter
Built with Python Tkinter and multi-threaded background processing.
"""

import os
import subprocess
import sys
import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from converter import PagesConverter


class DarkPagesConverterGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Apple .pages Offline Converter | ClimateSphere Tools")
        self.root.geometry("820x680")
        self.root.minsize(740, 560)

        # Palette
        self.bg_dark = "#0B0F19"
        self.bg_card = "#131B2E"
        self.bg_inner = "#1E293B"
        self.border = "#334155"
        self.text_main = "#F8FAFC"
        self.text_muted = "#94A3B8"
        self.accent_cyan = "#06B6D4"
        self.accent_cyan_hover = "#0891B2"
        self.accent_green = "#10B981"
        self.accent_red = "#EF4444"

        self.root.configure(bg=self.bg_dark)

        # State
        self.file_queue = []  # list of Path
        self.output_dir = None
        self.is_converting = False
        self.converter = PagesConverter()

        self._setup_styles()
        self._build_ui()

    def _setup_styles(self):
        self.style = ttk.Style(self.root)
        self.style.theme_use("clam")

        # Treeview styling
        self.style.configure(
            "Treeview",
            background=self.bg_card,
            foreground=self.text_main,
            fieldbackground=self.bg_card,
            bordercolor=self.border,
            borderwidth=0,
            rowheight=30,
            font=("Segoe UI", 9),
        )
        self.style.map("Treeview", background=[("selected", self.accent_cyan)], foreground=[("selected", "#000000")])
        self.style.configure(
            "Treeview.Heading",
            background=self.bg_inner,
            foreground=self.text_muted,
            relief="flat",
            font=("Segoe UI", 9, "bold"),
        )
        self.style.map("Treeview.Heading", background=[("active", self.border)])

        # Progressbar
        self.style.configure(
            "Horizontal.TProgressbar",
            troughcolor=self.bg_inner,
            background=self.accent_cyan,
            bordercolor=self.bg_dark,
            thickness=8,
        )

    def _build_ui(self):
        # 1. Header Banner
        header = tk.Frame(self.root, bg=self.bg_card, padx=20, pady=16)
        header.pack(fill="x", padx=16, pady=(16, 12))

        title_box = tk.Frame(header, bg=self.bg_card)
        title_box.pack(side="left")

        title_lbl = tk.Label(
            title_box,
            text="🍏 Offline Apple .pages Converter",
            font=("Segoe UI", 15, "bold"),
            fg=self.text_main,
            bg=self.bg_card,
        )
        title_lbl.pack(anchor="w")

        sub_lbl = tk.Label(
            title_box,
            text="Convert Apple Pages to PDF, Word (DOCX), Plain Text & Extract High-Res Media Assets",
            font=("Segoe UI", 9),
            fg=self.text_muted,
            bg=self.bg_card,
        )
        sub_lbl.pack(anchor="w", pady=(2, 0))

        badge = tk.Label(
            header,
            text="100% OFFLINE",
            font=("Segoe UI", 8, "bold"),
            fg=self.accent_green,
            bg=self.bg_inner,
            padx=8,
            pady=4,
        )
        badge.pack(side="right")

        # 2. Controls & Actions Bar
        actions_bar = tk.Frame(self.root, bg=self.bg_dark)
        actions_bar.pack(fill="x", padx=16, pady=(0, 10))

        btn_select_files = tk.Button(
            actions_bar,
            text="📄 Add .pages Files",
            font=("Segoe UI", 9, "bold"),
            bg=self.bg_inner,
            fg=self.accent_cyan,
            activebackground=self.accent_cyan,
            activeforeground="#000000",
            relief="flat",
            padx=14,
            pady=6,
            cursor="hand2",
            command=self._on_add_files,
        )
        btn_select_files.pack(side="left", padx=(0, 8))

        btn_select_folder = tk.Button(
            actions_bar,
            text="📁 Add Folder",
            font=("Segoe UI", 9, "bold"),
            bg=self.bg_inner,
            fg=self.text_main,
            activebackground=self.border,
            activeforeground=self.text_main,
            relief="flat",
            padx=14,
            pady=6,
            cursor="hand2",
            command=self._on_add_folder,
        )
        btn_select_folder.pack(side="left", padx=(0, 8))

        btn_clear = tk.Button(
            actions_bar,
            text="🗑 Clear Queue",
            font=("Segoe UI", 9),
            bg=self.bg_dark,
            fg=self.text_muted,
            activebackground=self.bg_dark,
            activeforeground=self.accent_red,
            relief="flat",
            padx=10,
            pady=6,
            cursor="hand2",
            command=self._on_clear,
        )
        btn_clear.pack(side="left")

        # 3. Format Selection & Output Folder Card
        settings_card = tk.Frame(self.root, bg=self.bg_card, padx=16, pady=12)
        settings_card.pack(fill="x", padx=16, pady=(0, 12))

        fmt_lbl = tk.Label(
            settings_card,
            text="TARGET FORMATS:",
            font=("Segoe UI", 8, "bold"),
            fg=self.text_muted,
            bg=self.bg_card,
        )
        fmt_lbl.pack(anchor="w", pady=(0, 6))

        fmt_box = tk.Frame(settings_card, bg=self.bg_card)
        fmt_box.pack(fill="x", pady=(0, 8))

        self.var_pdf = tk.BooleanVar(value=True)
        self.var_docx = tk.BooleanVar(value=True)
        self.var_txt = tk.BooleanVar(value=True)
        self.var_assets = tk.BooleanVar(value=True)

        for text, var in [
            ("PDF Document (.pdf)", self.var_pdf),
            ("Word Document (.docx)", self.var_docx),
            ("Plain Text (.txt)", self.var_txt),
            ("Extract Media Assets", self.var_assets),
        ]:
            cb = tk.Checkbutton(
                fmt_box,
                text=text,
                variable=var,
                bg=self.bg_card,
                fg=self.text_main,
                activebackground=self.bg_card,
                activeforeground=self.accent_cyan,
                selectcolor=self.bg_inner,
                font=("Segoe UI", 9),
            )
            cb.pack(side="left", padx=(0, 16))

        # Output Folder selector
        out_box = tk.Frame(settings_card, bg=self.bg_card)
        out_box.pack(fill="x")

        out_lbl = tk.Label(
            out_box,
            text="OUTPUT TO:",
            font=("Segoe UI", 8, "bold"),
            fg=self.text_muted,
            bg=self.bg_card,
        )
        out_lbl.pack(side="left", padx=(0, 8))

        self.out_path_var = tk.StringVar(value="[Beside original .pages file]")
        out_entry = tk.Entry(
            out_box,
            textvariable=self.out_path_var,
            bg=self.bg_inner,
            fg=self.text_main,
            insertbackground=self.accent_cyan,
            relief="flat",
            font=("Segoe UI", 9),
            state="readonly",
        )
        out_entry.pack(side="left", fill="x", expand=True, padx=(0, 8))

        btn_browse_out = tk.Button(
            out_box,
            text="Browse...",
            font=("Segoe UI", 8, "bold"),
            bg=self.bg_inner,
            fg=self.text_main,
            relief="flat",
            padx=10,
            pady=3,
            cursor="hand2",
            command=self._on_choose_output_dir,
        )
        btn_browse_out.pack(side="right")

        # 4. Queue Treeview Table
        table_frame = tk.Frame(self.root, bg=self.bg_card)
        table_frame.pack(fill="both", expand=True, padx=16, pady=(0, 12))

        columns = ("name", "size", "status", "details")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", selectmode="browse")

        self.tree.heading("name", text="Document File")
        self.tree.heading("size", text="Size")
        self.tree.heading("status", text="Status")
        self.tree.heading("details", text="Output Result")

        self.tree.column("name", width=260, minwidth=180)
        self.tree.column("size", width=80, minwidth=60, anchor="center")
        self.tree.column("status", width=110, minwidth=90, anchor="center")
        self.tree.column("details", width=320, minwidth=200)

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # 5. Bottom Action Bar & Progress
        bottom_bar = tk.Frame(self.root, bg=self.bg_dark)
        bottom_bar.pack(fill="x", padx=16, pady=(0, 16))

        self.progress_bar = ttk.Progressbar(bottom_bar, style="Horizontal.TProgressbar", mode="determinate")
        self.progress_bar.pack(fill="x", pady=(0, 10))

        btn_row = tk.Frame(bottom_bar, bg=self.bg_dark)
        btn_row.pack(fill="x")

        self.status_label = tk.Label(
            btn_row,
            text="Ready. Select files or a folder to start.",
            font=("Segoe UI", 9),
            fg=self.text_muted,
            bg=self.bg_dark,
        )
        self.status_label.pack(side="left")

        self.btn_open_folder = tk.Button(
            btn_row,
            text="📂 Open Output Folder",
            font=("Segoe UI", 9, "bold"),
            bg=self.bg_card,
            fg=self.text_main,
            relief="flat",
            padx=14,
            pady=8,
            cursor="hand2",
            state="disabled",
            command=self._on_open_output_folder,
        )
        self.btn_open_folder.pack(side="right", padx=(8, 0))

        self.btn_convert = tk.Button(
            btn_row,
            text="🚀 Convert All Files",
            font=("Segoe UI", 10, "bold"),
            bg=self.accent_cyan,
            fg="#000000",
            activebackground=self.accent_cyan_hover,
            activeforeground="#000000",
            relief="flat",
            padx=20,
            pady=8,
            cursor="hand2",
            command=self._on_start_conversion,
        )
        self.btn_convert.pack(side="right")

    # Event Handlers
    def _on_add_files(self):
        files = filedialog.askopenfilenames(
            title="Select Apple .pages Files",
            filetypes=[("Apple Pages Documents", "*.pages"), ("All Files", "*.*")],
        )
        if files:
            for f_str in files:
                p = Path(f_str)
                if p not in self.file_queue:
                    self.file_queue.append(p)
                    size_kb = p.stat().st_size / 1024
                    size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1024 else f"{size_kb:.0f} KB"
                    self.tree.insert("", "end", iid=str(p), values=(p.name, size_str, "Ready", "Pending conversion"))
            self.status_label.config(text=f"{len(self.file_queue)} file(s) in queue.")

    def _on_add_folder(self):
        folder = filedialog.askdirectory(title="Select Folder with .pages Files")
        if folder:
            p = Path(folder)
            found = list(p.glob("**/*.pages"))
            added = 0
            for f in found:
                if f not in self.file_queue:
                    self.file_queue.append(f)
                    size_kb = f.stat().st_size / 1024 if f.is_file() else 0
                    size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1024 else f"{size_kb:.0f} KB"
                    self.tree.insert("", "end", iid=str(f), values=(f.name, size_str, "Ready", "Pending conversion"))
                    added += 1
            self.status_label.config(text=f"Added {added} file(s). Total: {len(self.file_queue)} in queue.")

    def _on_clear(self):
        if self.is_converting:
            return
        self.file_queue.clear()
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.progress_bar["value"] = 0
        self.status_label.config(text="Queue cleared.")
        self.btn_open_folder.config(state="disabled")

    def _on_choose_output_dir(self):
        dir_selected = filedialog.askdirectory(title="Select Output Directory")
        if dir_selected:
            self.output_dir = Path(dir_selected)
            self.out_path_var.set(str(self.output_dir))
            self.btn_open_folder.config(state="normal")

    def _on_open_output_folder(self):
        target = self.output_dir
        if not target and self.file_queue:
            target = self.file_queue[0].parent
        if target and target.exists():
            if sys.platform == "win32":
                os.startfile(target)
            elif sys.platform == "darwin":
                subprocess.run(["open", str(target)])
            else:
                subprocess.run(["xdg-open", str(target)])

    def _on_start_conversion(self):
        if not self.file_queue:
            messagebox.showinfo("Queue Empty", "Please select one or more .pages files to convert.")
            return

        formats = []
        if self.var_pdf.get():
            formats.append("pdf")
        if self.var_docx.get():
            formats.append("docx")
        if self.var_txt.get():
            formats.append("txt")
        if self.var_assets.get():
            formats.append("assets")

        if not formats:
            messagebox.showwarning("No Format Selected", "Please select at least one target output format.")
            return

        self.is_converting = True
        self.btn_convert.config(state="disabled", text="Converting...")
        self.progress_bar["value"] = 0
        self.progress_bar["maximum"] = len(self.file_queue)

        # Run conversion on background thread
        thread = threading.Thread(target=self._run_batch_conversion, args=(formats,))
        thread.daemon = True
        thread.start()

    def _run_batch_conversion(self, formats):
        total = len(self.file_queue)
        success_count = 0

        for idx, f_path in enumerate(self.file_queue, 1):
            iid = str(f_path)
            self.root.after(0, lambda p=iid: self.tree.set(p, "status", "Converting..."))
            self.root.after(0, lambda i=idx, t=total: self.status_label.config(text=f"Converting ({i}/{t}): {f_path.name}"))

            try:
                res = self.converter.convert(
                    f_path,
                    formats=formats,
                    custom_output_dir=self.output_dir,
                )
                if res["success"]:
                    success_count += 1
                    status_text = "✓ Converted"
                    details_text = res.get("message", "Generated output files")
                else:
                    status_text = "✗ Failed"
                    details_text = res.get("message", "Could not generate files")

            except Exception as e:
                status_text = "✗ Error"
                details_text = str(e)

            # Update UI
            self.root.after(0, lambda p=iid, s=status_text, d=details_text: (
                self.tree.set(p, "status", s),
                self.tree.set(p, "details", d),
                self.progress_bar.step(1),
            ))

        def on_done():
            self.is_converting = False
            self.btn_convert.config(state="normal", text="🚀 Convert All Files")
            self.btn_open_folder.config(state="normal")
            self.status_label.config(
                text=f"Batch complete: {success_count}/{total} converted successfully."
            )
            messagebox.showinfo(
                "Conversion Complete",
                f"Successfully converted {success_count} of {total} document(s)!"
            )

        self.root.after(0, on_done)


def main():
    root = tk.Tk()
    app = DarkPagesConverterGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
