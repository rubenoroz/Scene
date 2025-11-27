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
    const canMoveOwn = hasPermission(userRole, PERMISSIONS.MOVE_OWN_TASK) && isOwnTask;

    // Special case: if only moving task (columnId or order), check MOVE_OWN_TASK
    const isOnlyMoving = (columnId !== undefined || order !== undefined) &&
      !title && !description && !assignees && !startDate && !endDate &&
      !toleranceDate && !links && !attachments && !images && !tags &&
      !priority && !checklist && !color && !isHiddenInGantt && !progress;

    if (isOnlyMoving && !canEditAny && canMoveOwn) {
      // Allow Artists to move their own tasks
    } else if (!canEditAny && !canEditOwn) {
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

    // Handle dates - convert strings to Date objects if needed
    if (startDate !== undefined) {
      updateData.startDate = startDate ? new Date(startDate) : null;
    }
    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }
    if (toleranceDate !== undefined) {
      updateData.toleranceDate = toleranceDate ? new Date(toleranceDate) : null;
    }

    if (links !== undefined) updateData.links = links;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (images !== undefined) updateData.images = images;
    if (tags !== undefined) updateData.tags = tags;
    if (priority !== undefined) updateData.priority = priority;
    if (checklist !== undefined) updateData.checklist = checklist;
    if (color !== undefined) updateData.color = color;
    if (isHiddenInGantt !== undefined) updateData.isHiddenInGantt = isHiddenInGantt;
    if (progress !== undefined) updateData.progress = progress;

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

    // Handle progress aggregation for ALL ancestors (recursive)
    if (currentTask.parentId) {
      let currentParentId: string | null = currentTask.parentId;

      // Optimization: Limit recursion depth to avoid infinite loops and excessive time
      let depth = 0;
      const MAX_DEPTH = 10;

      while (currentParentId && depth < MAX_DEPTH) {
        // 1. Calculate average progress for the current parent's children
        const aggregations = await prisma.task.aggregate({
          where: { parentId: currentParentId },
          _avg: { progress: true },
        });

        const averageProgress = Math.round(aggregations._avg.progress || 0);

        // 2. Update the current parent and get its parentId for the next iteration
        const updatedParent: { parentId: string | null } = await prisma.task.update({
          where: { id: currentParentId },
          data: { progress: averageProgress },
          select: { parentId: true }
        });

        currentParentId = updatedParent.parentId;
        depth++;
      }
    }

    // Handle cascade completion if progress is 100
    if (progress === 100) {
      // Optimized recursive function to get all descendant IDs
      // We fetch only IDs, which is lighter.
      const getAllDescendantIds = async (rootId: string): Promise<string[]> => {
        // Fetch all potential descendants in one go if possible, or layer by layer.
        // For deep hierarchies, layer by layer is safer to avoid recursion limits in code,
        // but fetching all tasks for the project and building a tree in memory is often faster for < 10k tasks.
        // Given we don't want to fetch the whole project here, let's stick to a more efficient recursive fetch.

        let allDescendants: string[] = [];
        let currentLevelIds = [rootId];

        while (currentLevelIds.length > 0) {
          const children = await prisma.task.findMany({
            where: { parentId: { in: currentLevelIds } },
            select: { id: true }
          });

          if (children.length === 0) break;

          const childIds = children.map(c => c.id);
          allDescendants.push(...childIds);
          currentLevelIds = childIds;
        }

        return allDescendants;
      };

      const descendantIds = await getAllDescendantIds(taskId);

      if (descendantIds.length > 0) {
        // Bulk update all descendants
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

    // Iterative function to delete all descendants level by level
    async function deleteWithDescendants(rootId: string) {
      // 1. Collect all IDs level by level
      const levels: string[][] = [];
      let currentLevelIds = [rootId];

      while (currentLevelIds.length > 0) {
        levels.push(currentLevelIds);

        const children = await prisma.task.findMany({
          where: { parentId: { in: currentLevelIds } },
          select: { id: true }
        });

        if (children.length === 0) break;
        currentLevelIds = children.map(c => c.id);
      }

      // 2. Delete from bottom up (deepest level first)
      for (let i = levels.length - 1; i >= 0; i--) {
        const idsToDelete = levels[i];
        if (idsToDelete.length > 0) {
          await prisma.task.deleteMany({
            where: { id: { in: idsToDelete } }
          });
        }
      }
    }

    await deleteWithDescendants(taskId);

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 500 }
    );
  }
}