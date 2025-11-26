import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// GET /api/projects/[projectId]/tasks
// This endpoint can optionally filter tasks by columnId
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
    const { searchParams } = new URL(req.url);
    const columnId = searchParams.get("columnId");

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(columnId && { columnId }), // Conditionally add columnId filter
      },
      orderBy: { order: "asc" },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        children: true, // Include subtasks
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/tasks
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
    const { title, columnId, parentId, startDate, endDate, toleranceDate } = await req.json();

    if (!title || !columnId) {
      return NextResponse.json(
        { message: "Title and Column ID are required" },
        { status: 400 }
      );
    }

    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    if (!hasPermission(userRole, PERMISSIONS.CREATE_TASK)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let newOrder: number;

    if (parentId) {
      // If this is a subtask, place it right after the parent and all its existing subtasks
      const parentTask = await prisma.task.findUnique({
        where: { id: parentId },
        include: {
          children: {
            orderBy: { order: 'desc' },
            take: 1,
          },
        },
      });

      if (!parentTask) {
        return NextResponse.json({ message: "Parent task not found" }, { status: 404 });
      }

      // Find the position after the last subtask (or after parent if no subtasks exist)
      let insertAfterOrder: number;
      if (parentTask.children.length > 0) {
        // Place after the last existing subtask
        insertAfterOrder = parentTask.children[0].order;
      } else {
        // Place right after the parent
        insertAfterOrder = parentTask.order;
      }

      // Get all tasks in the same column with order > insertAfterOrder
      const tasksToShift = await prisma.task.findMany({
        where: {
          columnId,
          order: { gt: insertAfterOrder },
        },
        orderBy: { order: "asc" },
      });

      // Shift all tasks after the insertion point down by 1
      // Shift all tasks after the insertion point down by 1
      await Promise.all(
        tasksToShift.map((task) =>
          prisma.task.update({
            where: { id: task.id },
            data: { order: task.order + 1 },
          })
        )
      );

      // Place the new subtask right after the insertion point
      newOrder = insertAfterOrder + 1;
    } else {
      // If not a subtask, append to the end of the column
      const lastTask = await prisma.task.findFirst({
        where: { columnId },
        orderBy: { order: "desc" },
      });

      newOrder = lastTask ? lastTask.order + 1 : 0;
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        columnId,
        projectId,
        order: newOrder,
        parentId: parentId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        toleranceDate: toleranceDate || null,
      },
      include: {
        assignees: true,
        children: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 }
    );
  }
}