import { NextResponse } from "next/server";
import { jsonError, handleApiError, findProjectBySlug } from "@/lib/api";

export async function GET(_req, { params }) {
  const { slug } = await params;

  try {
    const project = await findProjectBySlug(slug);
    if (!project) {
      return jsonError("Project not found", 404);
    }
    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error, `Projects API: failed to fetch project "${slug}":`, "Failed to fetch project");
  }
}
