import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// PUT /api/projects/[projectId]/users/[userId]
// Update user role in project
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; userId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId, userId } = await params;
        const { role } = await req.json();

        if (!role) {
            return NextResponse.json({ message: "Role is required" }, { status: 400 });
        }

        // Check permissions
        const currentUserRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(currentUserRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Check if ProjectUser record exists
        const existingProjectUser = await prisma.projectUser.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        let updatedProjectUser;

        if (existingProjectUser) {
            // Update existing record
            updatedProjectUser = await prisma.projectUser.update({
                where: {
                    projectId_userId: {
                        projectId,
                        userId
                    }
                },
                data: { role }
            });
        } else {
            // Create new record (override workspace role)
            updatedProjectUser = await prisma.projectUser.create({
                data: {
                    projectId,
                    userId,
                    role
                }
            });
        }

        return NextResponse.json(updatedProjectUser);

    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { message: "Error updating user role" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[projectId]/users/[userId]
// Remove user from project (delete ProjectUser record)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; userId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId, userId } = await params;

        // Check permissions
        const currentUserRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(currentUserRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Delete ProjectUser record
        // Note: This only removes explicit project-level assignment. 
        // If user is in workspace, they might still have access via workspace role.
        // But for now this is the expected behavior for "removing from project specific role".

        try {
            await prisma.projectUser.delete({
                where: {
                    projectId_userId: {
                        projectId,
                        userId
                    }
                }
            });
            return NextResponse.json({ message: "User removed from project" });
        } catch (error) {
            // If record doesn't exist, maybe they are just a workspace user.
            // In that case, we can't "remove" them from project unless we remove from workspace, 
            // or we need a "BLOCK" role? 
            // For now, let's assume we just handle the explicit record deletion.
            return NextResponse.json({ message: "User was not explicitly assigned to project" }, { status: 404 });
        }

    } catch (error) {
        console.error("Error removing user from project:", error);
        return NextResponse.json(
            { message: "Error removing user from project" },
            { status: 500 }
        );
    }
}
