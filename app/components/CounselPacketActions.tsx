"use client";

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { useState } from "react";

type PacketSection = {
  title: string;
  sourceType: "Founder-supplied facts" | "Platform-organized summary" | "Information requiring verification";
  body: string[];
};

type CounselPacketPdfData = {
  packetTitle: string;
  companyName: string;
  matterTitle: string;
  founderContact: string[];
  dateGenerated: string;
  sections: PacketSection[];
};

const disclaimer =
  "This packet was prepared by the founder using VenturePack. It is not a legal opinion and does not provide legal advice. It should be reviewed by qualified counsel.";

const page = {
  width: 612,
  height: 792,
  margin: 54,
};

export function CounselPacketActions({ packet }: { packet: CounselPacketPdfData }) {
  const [reviewed, setReviewed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  async function downloadPacket() {
    setIsGenerating(true);

    try {
      const bytes = await createPacketPdf(packet);
      const pdfBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = packet.companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "venturepack";

      link.href = url;
      link.download = `${safeName}-counsel-packet.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-sm">
      <label className="flex items-start gap-3 text-sm leading-6 text-[#00173C]">
        <input
          type="checkbox"
          checked={reviewed}
          onChange={(event) => setReviewed(event.target.checked)}
          className="mt-1 size-4 accent-[#009EA7]"
        />
        <span>
          I have reviewed this packet and understand it is not legal advice.
        </span>
      </label>
      <button
        type="button"
        onClick={downloadPacket}
        disabled={!reviewed || isGenerating}
        className="mt-5 rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isGenerating ? "Preparing PDF..." : "Download PDF"}
      </button>
    </div>
  );
}

async function createPacketPdf(packet: CounselPacketPdfData) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let currentPage = pdf.addPage([page.width, page.height]);
  let y = page.height - page.margin;

  drawBrandHeader(currentPage, bold);
  y -= 74;
  y = drawText(currentPage, packet.packetTitle, { x: page.margin, y, font: bold, size: 24, maxWidth: 430 });
  y -= 20;
  y = drawLabeledLine(currentPage, "Company", packet.companyName || "Not provided", y, bold, regular);
  y = drawLabeledLine(currentPage, "Matter", packet.matterTitle || "No matter selected", y, bold, regular);
  y = drawLabeledLine(currentPage, "Date generated", packet.dateGenerated, y, bold, regular);
  y -= 8;
  y = drawSectionBlock(currentPage, "Founder contact information", packet.founderContact, y, bold, regular);
  y = drawSectionBlock(currentPage, "Disclaimer", [disclaimer], y - 6, bold, regular);

  for (const section of packet.sections) {
    if (section.title === "Cover page" || section.title === "Disclaimer") {
      continue;
    }

    if (y < 170) {
      currentPage = pdf.addPage([page.width, page.height]);
      y = page.height - page.margin;
      drawBrandHeader(currentPage, bold);
      y -= 52;
    }

    y = drawSectionBlock(
      currentPage,
      section.title,
      [`Source: ${section.sourceType}`, ...section.body],
      y - 8,
      bold,
      regular,
    );
  }

  void currentPage;
  void y;
  drawFooterOnPages(pdf, regular);

  return pdf.save();
}

function drawBrandHeader(pdfPage: PDFPage, bold: PDFFont) {
  pdfPage.drawRectangle({
    x: page.margin,
    y: page.height - page.margin - 28,
    width: 28,
    height: 28,
    color: rgb(0.03, 0.45, 0.42),
  });
  pdfPage.drawText("VP", {
    x: page.margin + 6,
    y: page.height - page.margin - 19,
    font: bold,
    size: 10,
    color: rgb(1, 1, 1),
  });
  pdfPage.drawText("VenturePack", {
    x: page.margin + 40,
    y: page.height - page.margin - 18,
    font: bold,
    size: 16,
    color: rgb(0.06, 0.09, 0.16),
  });
}

function drawLabeledLine(pdfPage: PDFPage, label: string, value: string, y: number, bold: PDFFont, regular: PDFFont) {
  pdfPage.drawText(`${label}:`, {
    x: page.margin,
    y,
    font: bold,
    size: 10,
    color: rgb(0.22, 0.27, 0.35),
  });
  drawText(pdfPage, value, {
    x: page.margin + 112,
    y,
    font: regular,
    size: 10,
    maxWidth: page.width - page.margin * 2 - 112,
  });
  return y - 18;
}

function drawSectionBlock(pdfPage: PDFPage, title: string, lines: string[], y: number, bold: PDFFont, regular: PDFFont) {
  pdfPage.drawText(title, {
    x: page.margin,
    y,
    font: bold,
    size: 14,
    color: rgb(0.06, 0.09, 0.16),
  });
  let cursor = y - 18;

  for (const line of lines) {
    cursor = drawText(pdfPage, line || "Not provided", {
      x: page.margin,
      y: cursor,
      font: regular,
      size: 10,
      maxWidth: page.width - page.margin * 2,
      lineHeight: 14,
    });
    cursor -= 6;
  }

  return cursor - 8;
}

function drawText(
  pdfPage: PDFPage,
  text: string,
  options: { x: number; y: number; font: PDFFont; size: number; maxWidth: number; lineHeight?: number },
) {
  const lineHeight = options.lineHeight ?? options.size + 5;
  const lines = wrapText(text, options.font, options.size, options.maxWidth);
  let cursor = options.y;

  for (const line of lines) {
    pdfPage.drawText(line, {
      x: options.x,
      y: cursor,
      font: options.font,
      size: options.size,
      color: rgb(0.22, 0.27, 0.35),
    });
    cursor -= lineHeight;
  }

  return cursor;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) {
        lines.push(line);
      }
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.length > 0 ? lines : ["Not provided"];
}

function drawFooterOnPages(pdf: PDFDocument, regular: PDFFont) {
  const pages = pdf.getPages();

  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({
      start: { x: page.margin, y: 38 },
      end: { x: page.width - page.margin, y: 38 },
      thickness: 0.5,
      color: rgb(0.84, 0.87, 0.91),
    });
    pdfPage.drawText(`VenturePack preparation packet | Page ${index + 1} of ${pages.length}`, {
      x: page.margin,
      y: 24,
      font: regular,
      size: 8,
      color: rgb(0.42, 0.47, 0.55),
    });
  });
}
