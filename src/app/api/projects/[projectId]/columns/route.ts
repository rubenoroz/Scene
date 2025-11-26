import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// GET /api/projects/[projectId]/columns
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const columns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(columns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json(
      { message: "Error fetching columns" },
      { status: 500 }
    );
  }
}

import { pastelColorPairs } from "@/lib/colors";

// ... (existing GET handler)

// POST /api/projects/[projectId]/columns
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get the count of existing columns to assign a color pair
    const columnCount = await prisma.column.count({
      where: { projectId },
    });

    const colorPair = pastelColorPairs[columnCount % pastelColorPairs.length];

    // Get the highest order to append the new column
    const lastColumn = await prisma.column.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 0;

    const newColumn = await prisma.column.create({
      data: {
        name,
        projectId,
        order: newOrder,
        color: colorPair.column,
        cardColor: colorPair.card,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(newColumn, { status: 201 });
  } catch (error) {
    console.error("Error creating column:", error);
    return NextResponse.json(
      { message: "Error creating column" },
      { status: 500 }
    );
  }
}