import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// ... GET handler remains unchanged ...

// PUT /api/projects/[projectId]/tasks/[taskId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, taskId } = await params;
    const {
      title,
      description,
      columnId,
      order,
      parentId,
      assignees,
      startDate,
      endDate,
      toleranceDate,
      links,
      attachments,
      images,
      tags,
      priority,
      checklist,
      color,
      isHiddenInGantt, // Add this
      progress, // Add progress
    } = await req.json();

    // First, fetch the current task
    const currentTask = await prisma.task.findUnique({
      where: { id: taskId, projectId },
      include: {
        children: true,
        assignees: true
      },
    });

    if (!currentTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }


    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    const isOwnTask = currentTask.assignees.some((a: { id: string }) => a.id === session.user.id);

    const canEditAny = hasPermission(userRole, PERMISSIONS.EDIT_ANY_TASK);
    const canEditOwn = hasPermission(userRole, PERMISSIONS.EDIT_OWN_TASK) && isOwnTask;

    if (!canEditAny && !canEditOwn) {
      // If trying to assign users, check ASSIGN_TASK permission specifically
      if (assignees && !hasPermission(userRole, PERMISSIONS.ASSIGN_TASK)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      // Otherwise, forbidden
      if (!assignees) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (columnId !== undefined) updateData.columnId = columnId;
    if (order !== undefined) updateData.order = order;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (toleranceDate !== undefined) updateData.toleranceDate = toleranceDate;
    if (links !== undefined) updateData.links = links;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (images !== undefined) updateData.images = images;
    if (tags !== undefined) updateData.tags = tags;
    if (priority !== undefined) updateData.priority = priority;
    if (checklist !== undefined) updateData.checklist = checklist;
    if (color !== undefined) updateData.color = color;
    if (isHiddenInGantt !== undefined) updateData.isHiddenInGantt = isHiddenInGantt;
    if (progress !== undefined) updateData.progress = progress; // Add progress

    // Si solo se envía color o isHiddenInGantt, permite actualizar solo esos campos
    if (
      (Object.keys(updateData).length === 1 && (updateData.color !== undefined || updateData.isHiddenInGantt !== undefined)) &&
      assignees === undefined
    ) {
      const updatedTask = await prisma.task.update({
        where: { id: taskId, projectId },
        data: updateData,
      });
      return NextResponse.json(updatedTask);
    }

    let updatedTask;

    // Special handling for moving a parent task
    const isMovingColumn = columnId && currentTask.columnId !== columnId;

    if (isMovingColumn && currentTask.children.length > 0) {
      // Use a transaction to move the parent and all its children
      const [, task] = await prisma.$transaction([
        prisma.task.updateMany({
          where: {
            parentId: taskId,
          },
          data: {
            columnId: columnId,
          },
        }),
        prisma.task.update({
          where: { id: taskId, projectId },
          data: {
            ...updateData,
            ...(assignees !== undefined && {
              assignees: {
                set: assignees.map((id: string) => ({ id })),
              },
            }),
          },
          include: {
            children: true, // Re-include children to return the full updated task
          }
        }),
      ]);
      updatedTask = task;
    } else {
      // Standard update for tasks without children or other field updates
      if (assignees !== undefined) {
        updatedTask = await prisma.task.update({
          where: { id: taskId, projectId },
          data: {
            ...updateData,
            assignees: {
              set: assignees.map((id: string) => ({ id })),
            },
          },
        });
      } else {
        updatedTask = await prisma.task.update({
          where: { id: taskId, projectId },
          data: updateData,
        });
      }
    }

    // Handle progress aggregation for parent task
    if (currentTask.parentId) {
      const parentId = currentTask.parentId;

      // Fetch all siblings to calculate new average
      const siblings = await prisma.task.findMany({
        where: { parentId: parentId },
        select: { progress: true }
      });

      // Calculate average progress
      const totalProgress = siblings.reduce((sum: number, task) => sum + (task.progress || 0), 0);
      const averageProgress = Math.round(totalProgress / siblings.length);

      // Update parent task progress
      await prisma.task.update({
        where: { id: parentId },
        data: { progress: averageProgress }
      });
    }

    // Handle cascade completion if progress is 100
    if (progress === 100) {
      // Recursive function to get all descendant IDs
      const getAllDescendantIds = async (taskId: string): Promise<string[]> => {
        const children = await prisma.task.findMany({
          where: { parentId: taskId },
          select: { id: true }
        });

        if (children.length === 0) return [];

        const childIds = children.map(c => c.id);
        const descendantIdsPromises = childIds.map(id => getAllDescendantIds(id));
        const descendantIdsArrays = await Promise.all(descendantIdsPromises);
        const descendantIds = descendantIdsArrays.flat();

        return [...childIds, ...descendantIds];
      };

      const descendantIds = await getAllDescendantIds(taskId);

      if (descendantIds.length > 0) {
        await prisma.task.updateMany({
          where: { id: { in: descendantIds } },
          data: { progress: 100 }
        });
      }
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Error updating task" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/tasks/[taskId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, taskId } = await params;

    // Check permissions
    const userRole = await getUserRoleInProject(session.user.id, projectId);
    if (!hasPermission(userRole, PERMISSIONS.DELETE_TASK)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: taskId, projectId },
    });

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 500 }
    );
  }
}