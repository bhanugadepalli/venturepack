import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

type BriefSection = {
  title: string;
  founderSuppliedFacts: string[];
  platformOrganizedSummary: string;
  missingInformation: string[];
};

type BriefContent = {
  sections: BriefSection[];
  warnings: string[];
  disclaimer: string;
};

const counselDisclaimer = "VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.";
const pitchDisclaimer = "This brief is for preparation only. It does not indicate investment readiness or likelihood of funding.";
const pageSize: [number, number] = [612, 792];
const margin = 54;

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

async function getCurrentCompany(ownerId: string) {
  return prisma.company.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map(text).filter(Boolean);
}

function briefContent(value: unknown): BriefContent {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const sectionsValue = Array.isArray(record.sections) ? record.sections : [];
  const sections = sectionsValue
    .map((sectionValue) => {
      const sectionRecord = sectionValue && typeof sectionValue === "object" ? (sectionValue as Record<string, unknown>) : {};

      return {
        title: text(sectionRecord.title),
        founderSuppliedFacts: stringArray(sectionRecord.founderSuppliedFacts),
        platformOrganizedSummary: text(sectionRecord.platformOrganizedSummary),
        missingInformation: stringArray(sectionRecord.missingInformation),
      };
    })
    .filter((section) => section.title);

  return {
    sections,
    warnings: stringArray(record.warnings),
    disclaimer: text(record.disclaimer),
  };
}

function briefTypeLabel(briefType: string) {
  return briefType === "COUNSEL_BRIEF" ? "Counsel Brief" : "Pitch Brief";
}

function briefFilename(briefType: string) {
  return briefType === "COUNSEL_BRIEF" ? "venturepack-counsel-brief.pdf" : "venturepack-pitch-brief.pdf";
}

function disclaimerForBrief(briefType: string) {
  return briefType === "COUNSEL_BRIEF" ? counselDisclaimer : pitchDisclaimer;
}

function wrapText(value: string, font: PDFFont, size: number, maxWidth: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;

    if (font.widthOfTextAtSize(nextLine, size) <= maxWidth) {
      line = nextLine;
      continue;
    }

    if (line) {
      lines.push(line);
      line = word;
    } else {
      lines.push(word);
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.length > 0 ? lines : [""];
}

function addPage(pdfDoc: PDFDocument) {
  return pdfDoc.addPage(pageSize);
}

function ensureSpace(pdfDoc: PDFDocument, page: PDFPage, y: number, needed: number) {
  if (y >= margin + needed) {
    return { page, y };
  }

  return { page: addPage(pdfDoc), y: pageSize[1] - margin };
}

function drawTextBlock({
  pdfDoc,
  page,
  textValue,
  x,
  y,
  maxWidth,
  font,
  size,
  color = rgb(0.1, 0.16, 0.28),
  lineGap = 5,
}: {
  pdfDoc: PDFDocument;
  page: PDFPage;
  textValue: string;
  x: number;
  y: number;
  maxWidth: number;
  font: PDFFont;
  size: number;
  color?: ReturnType<typeof rgb>;
  lineGap?: number;
}) {
  let currentPage = page;
  let currentY = y;
  const lines = wrapText(textValue, font, size, maxWidth);
  const lineHeight = size + lineGap;

  for (const line of lines) {
    const next = ensureSpace(pdfDoc, currentPage, currentY, lineHeight);
    currentPage = next.page;
    currentY = next.y;
    currentPage.drawText(line, {
      x,
      y: currentY,
      size,
      font,
      color,
    });
    currentY -= lineHeight;
  }

  return { page: currentPage, y: currentY };
}

function drawList({
  pdfDoc,
  page,
  items,
  x,
  y,
  maxWidth,
  font,
  size,
}: {
  pdfDoc: PDFDocument;
  page: PDFPage;
  items: string[];
  x: number;
  y: number;
  maxWidth: number;
  font: PDFFont;
  size: number;
}) {
  let currentPage = page;
  let currentY = y;
  const listItems = items.length > 0 ? items : ["Not yet provided."];

  for (const item of listItems) {
    const result = drawTextBlock({
      pdfDoc,
      page: currentPage,
      textValue: `- ${item}`,
      x,
      y: currentY,
      maxWidth,
      font,
      size,
    });
    currentPage = result.page;
    currentY = result.y - 2;
  }

  return { page: currentPage, y: currentY };
}

async function generatePdf({
  title,
  briefType,
  generatedAt,
  content,
}: {
  title: string;
  briefType: string;
  generatedAt: Date;
  content: BriefContent;
}) {
  const pdfDoc = await PDFDocument.create();
  let page = addPage(pdfDoc);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = pageSize[0] - margin * 2;
  let y = pageSize[1] - margin;

  page.drawText("VenturePack", {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0.09, 0.24),
  });
  y -= 30;

  let result = drawTextBlock({
    pdfDoc,
    page,
    textValue: title,
    x: margin,
    y,
    maxWidth,
    font: boldFont,
    size: 22,
    color: rgb(0, 0.09, 0.24),
  });
  page = result.page;
  y = result.y - 8;

  result = drawTextBlock({
    pdfDoc,
    page,
    textValue: `${briefTypeLabel(briefType)} | Generated ${generatedAt.toLocaleDateString("en-US")}`,
    x: margin,
    y,
    maxWidth,
    font: regularFont,
    size: 10,
    color: rgb(0.35, 0.43, 0.55),
  });
  page = result.page;
  y = result.y - 18;

  if (content.warnings.length > 0) {
    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: "Warnings",
      x: margin,
      y,
      maxWidth,
      font: boldFont,
      size: 13,
    });
    page = result.page;
    y = result.y - 2;

    const listResult = drawList({
      pdfDoc,
      page,
      items: content.warnings,
      x: margin + 12,
      y,
      maxWidth: maxWidth - 12,
      font: regularFont,
      size: 10,
    });
    page = listResult.page;
    y = listResult.y - 10;
  }

  for (const section of content.sections) {
    const next = ensureSpace(pdfDoc, page, y, 80);
    page = next.page;
    y = next.y;

    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: section.title,
      x: margin,
      y,
      maxWidth,
      font: boldFont,
      size: 14,
      color: rgb(0, 0.09, 0.24),
    });
    page = result.page;
    y = result.y - 6;

    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: "Founder-supplied facts",
      x: margin,
      y,
      maxWidth,
      font: boldFont,
      size: 10,
    });
    page = result.page;
    y = result.y;

    let listResult = drawList({
      pdfDoc,
      page,
      items: section.founderSuppliedFacts,
      x: margin + 12,
      y,
      maxWidth: maxWidth - 12,
      font: regularFont,
      size: 10,
    });
    page = listResult.page;
    y = listResult.y - 4;

    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: "Platform-organized summary",
      x: margin,
      y,
      maxWidth,
      font: boldFont,
      size: 10,
    });
    page = result.page;
    y = result.y;

    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: section.platformOrganizedSummary || "Not yet provided.",
      x: margin + 12,
      y,
      maxWidth: maxWidth - 12,
      font: regularFont,
      size: 10,
    });
    page = result.page;
    y = result.y - 4;

    result = drawTextBlock({
      pdfDoc,
      page,
      textValue: "Missing information",
      x: margin,
      y,
      maxWidth,
      font: boldFont,
      size: 10,
    });
    page = result.page;
    y = result.y;

    listResult = drawList({
      pdfDoc,
      page,
      items: section.missingInformation,
      x: margin + 12,
      y,
      maxWidth: maxWidth - 12,
      font: regularFont,
      size: 10,
    });
    page = listResult.page;
    y = listResult.y - 16;
  }

  const next = ensureSpace(pdfDoc, page, y, 70);
  page = next.page;
  y = next.y;
  result = drawTextBlock({
    pdfDoc,
    page,
    textValue: "Disclaimer",
    x: margin,
    y,
    maxWidth,
    font: boldFont,
    size: 13,
  });
  page = result.page;
  y = result.y - 2;

  drawTextBlock({
    pdfDoc,
    page,
    textValue: disclaimerForBrief(briefType),
    x: margin,
    y,
    maxWidth,
    font: regularFont,
    size: 10,
  });

  return pdfDoc.save();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const company = await getCurrentCompany(userId);

    if (!company) {
      return NextResponse.json({ ok: false, error: "BRIEF_NOT_FOUND" }, { status: 404 });
    }

    const brief = await prisma.generatedBrief.findFirst({
      where: {
        id,
        userId,
        companyId: company.id,
      },
    });

    if (!brief) {
      return NextResponse.json({ ok: false, error: "BRIEF_NOT_FOUND" }, { status: 404 });
    }

    if (brief.founderApprovalStatus !== "reviewed") {
      return NextResponse.json({ ok: false, error: "BRIEF_REVIEW_REQUIRED" }, { status: 403 });
    }

    const content = briefContent(brief.generatedContent);
    const pdfBytes = await generatePdf({
      title: brief.title,
      briefType: brief.briefType,
      generatedAt: brief.generatedAt,
      content,
    });

    await prisma.generatedBrief.update({
      where: { id: brief.id },
      data: { downloadedAt: new Date() },
    });

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${briefFilename(brief.briefType)}"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "BRIEF_DOWNLOAD_FAILED" }, { status: 500 });
  }
}
