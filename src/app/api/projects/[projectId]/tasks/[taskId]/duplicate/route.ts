import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// POST /api/projects/[projectId]/tasks/[taskId]/duplicate
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId, taskId } = await params;

        // Check permissions - only admins and project managers can duplicate
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Recursive function to duplicate task and all its subtasks
        async function duplicateTaskRecursive(
            originalTaskId: string,
            newParentId: string | null = null
        ): Promise<string> {
            // Get original task with all its data
            const originalTask = await prisma.task.findUnique({
                where: { id: originalTaskId },
                include: {
                    children: true,
                },
            });

            if (!originalTask) {
                throw new Error("Task not found");
            }

            // Create duplicate task
            const duplicateTask = await prisma.task.create({
                data: {
                    title: newParentId === null ? `${originalTask.title} (Copy)` : originalTask.title,
                    description: originalTask.description,
                    projectId: originalTask.projectId,
                    columnId: originalTask.columnId,
                    parentId: newParentId,
                    order: originalTask.order,
                    priority: originalTask.priority,
                    tags: originalTask.tags,
                    links: originalTask.links,
                    checklist: originalTask.checklist,
                    color: originalTask.color,
                    // Don't copy: assignees, dates, attachments, images, progress
                },
            });

            // Recursively duplicate all children
            for (const child of originalTask.children) {
                await duplicateTaskRecursive(child.id, duplicateTask.id);
            }

            return duplicateTask.id;
        }

        // Start duplication
        const newTaskId = await duplicateTaskRecursive(taskId);

        return NextResponse.json({ id: newTaskId }, { status: 201 });
    } catch (error) {
        console.error("Error duplicating task:", error);
        return NextResponse.json(
            { message: "Error duplicating task" },
            { status: 500 }
        );
    }
}
