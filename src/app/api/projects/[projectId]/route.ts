import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS, ROLES } from "@/lib/permissions";

// GET /api/projects/[projectId]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId } = await params;

        // Check if user has access to the project
        const userProject = await prisma.projectUser.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: session.user.id,
                },
            },
        });

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Allow access if user is a member OR the owner
        if (!userProject && project.ownerId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { message: "Error fetching project" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[projectId]
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
        const { name, description } = await req.json();

        const userRole = await getUserRoleInProject(session.user.id, projectId);

        if (!hasPermission(userRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { message: "Error updating project" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[projectId]
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
        const userRole = await getUserRoleInProject(session.user.id, projectId);

        // Only owner can delete project usually, or ADMIN role
        // Assuming MANAGE_PROJECT includes deletion or checking specifically for owner/admin
        // Let's use a specific permission if available, or check role directly
        // For now, let's assume MANAGE_PROJECT is enough, or check if user is owner.

        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

        if (project.ownerId !== session.user.id && userRole !== ROLES.ADMIN) {
            return NextResponse.json({ message: "Forbidden. Only owner can delete project." }, { status: 403 });
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Error deleting project" },
            { status: 500 }
        );
    }
}
