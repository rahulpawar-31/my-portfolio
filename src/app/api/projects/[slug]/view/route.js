import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, findProjectBySlug, handleApiError } from "@/lib/api";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

const viewDedupe = createRateLimiter({
  name: "project-views",
  max: 1,
  windowMs: 60 * 60 * 1000,
});

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const project = await findProjectBySlug(slug);
    if (!project) {
      return jsonError("Project not found", 404);
    }
    return NextResponse.json({ viewCount: project.viewCount ?? 0 });
  } catch (error) {
    return handleApiError(error, `View count API: failed to fetch views for "${slug}":`, "Failed to fetch view count");
  }
}

export async function POST(req, { params }) {
  const { slug } = await params;
  const dedupeKey = `${clientIp(req)}:${slug}`;

  try {
    if (viewDedupe.isOverLimit(dedupeKey)) {
      const project = await findProjectBySlug(slug);
      if (!project) {
        return jsonError("Project not found", 404);
      }
      return NextResponse.json({ viewCount: project.viewCount });
    }

    const project = await prisma.project.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    viewDedupe.record(dedupeKey);

    return NextResponse.json({ viewCount: project.viewCount });
  } catch (error) {
    if (error?.code === "P2025") {
      return jsonError("Project not found", 404);
    }
    console.error(`View count API: failed to increment views for "${slug}":`, error);
    return jsonError("Failed to update view count", 500);
  }
}
