import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// GET /api/projects/[projectId]/columns/[columnId]
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; columnId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, columnId } = params;

    const column = await prisma.column.findUnique({
      where: { id: columnId, projectId },
      include: {
        tasks: true,
      },
    });

    if (!column) {
      return NextResponse.json({ message: "Column not found" }, { status: 404 });
    }

    return NextResponse.json(column);
  } catch (error) {
    console.error("Error fetching column:", error);
    return NextResponse.json(
      { message: "Error fetching column" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[projectId]/columns/[columnId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; columnId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, columnId } = await params; // Correctly await the params
    const { name, color, cardColor, order } = await req.json();

    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const data: { name?: string; color?: string; cardColor?: string; order?: number } = {};
    if (name) data.name = name;
    if (color) data.color = color;
    if (cardColor) data.cardColor = cardColor;
    if (order !== undefined) data.order = order;

    const updatedColumn = await prisma.column.update({
      where: { id: columnId, projectId },
      data,
    });

    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error("Error updating column:", error);
    return NextResponse.json(
      { message: "Error updating column" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/columns/[columnId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; columnId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, columnId } = await params;

    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // First, delete all tasks within the column
      prisma.task.deleteMany({
        where: { columnId: columnId },
      }),
      // Then, delete the column itself
      prisma.column.delete({
        where: { id: columnId, projectId },
      }),
    ]);

    return NextResponse.json({ message: "Column and its tasks deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting column:", error);
    return NextResponse.json(
      { message: "Error deleting column" },
      { status: 500 }
    );
  }
}
