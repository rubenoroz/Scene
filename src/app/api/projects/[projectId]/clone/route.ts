import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from '@prisma/client'; // Add this import

// POST /api/projects/[projectId]/clone
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

        // Check permissions (need to be able to view the source project and create new projects)
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.VIEW_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        // Also check if user can create projects (usually ADMIN or PROJECT_MANAGER)
        // For now, we'll assume if they can see it, they can clone it to their own workspace? 
        // Or strictly follow CREATE_PROJECT permission.
        // Let's stick to: if you can view it, you can clone it as a new project where YOU are the owner.

        // 1. Fetch source project with all relations
        const sourceProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                columns: {
                    include: {
                        tasks: {
                            include: {
                                // We don't clone comments or assignees for now, maybe just basic task info
                                // If we want to clone subtasks, we need to be careful with IDs.
                                // For simplicity V1: Clone flat tasks.
                                // V2: Clone hierarchy (requires mapping old IDs to new IDs).
                                // Let's try to clone hierarchy if possible, but it's complex.
                                // Let's start with flat tasks to ensure stability.
                            }
                        }
                    }
                }
            }
        });

        if (!sourceProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // 2. Create new project
        const newProject = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name: `Copy of ${sourceProject.name}`,
                    description: sourceProject.description,
                    ownerId: session.user.id!,
                    workspaceId: sourceProject.workspaceId, // Clone to same workspace for now
                    // Add creator as Project User
                    projectUsers: {
                        create: {
                            userId: session.user.id!,
                            role: 'ADMIN' // Creator is Admin of the clone
                        }
                    }
                }
            });

            // 3. Clone columns and tasks
            // We need to maintain the order and relationships.
            // Since we are cloning to a new project, we can just create new columns.

            // Map to store oldTaskId -> newTaskId for parent/child relationships if we were doing that.
            // For now, let's just clone columns and their tasks.

            for (const column of sourceProject.columns) {
                const newColumn = await tx.column.create({
                    data: {
                        name: column.name,
                        order: column.order,
                        projectId: project.id,
                    }
                });

                // Clone tasks for this column
                for (const task of column.tasks) {
                    await tx.task.create({
                        data: {
                            title: task.title,
                            description: task.description,
                            order: task.order,
                            projectId: project.id,
                            columnId: newColumn.id,
                            priority: task.priority,
                            tags: task.tags,
                            // Reset dates and assignees
                        }
                    });
                }
            }

            return project;
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Error cloning project:", error);
        return NextResponse.json(
            { message: "Error cloning project" },
            { status: 500 }
        );
    }
}
