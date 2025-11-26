import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";

// PUT /api/projects/[projectId]/archive
// Toggle archive status
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId } = await params;
        const { isArchived } = await req.json();

        // Check permissions
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { isArchived },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error("Error updating project archive status:", error);
        return NextResponse.json(
            { message: "Error updating project" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[projectId]/archive
// Permanently delete project (must be archived first ideally, but we'll check permissions)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId } = await params;

        // Check permissions
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.DELETE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        return NextResponse.json({ message: "Project deleted" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Error deleting project" },
            { status: 500 }
        );
    }
}
