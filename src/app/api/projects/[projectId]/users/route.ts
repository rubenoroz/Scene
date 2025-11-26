import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS, ROLES } from "@/lib/permissions";

// GET /api/projects/[projectId]/users
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

        // 1. Get explicit project users
        const projectUsers = await prisma.projectUser.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            }
        });

        // 2. Get workspace users (implicit access)
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                workspace: {
                    include: {
                        workspaceUsers: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Map to unify structure
        const userMap = new Map();

        // Add owner (Admin by default in context of project ownership, usually)
        // Or we can check their workspace role. 
        // For simplicity, let's treat owner as having a role too if they are in workspace users.
        // If not, we add them.

        // Add workspace users first (base roles)
        project.workspace.workspaceUsers.forEach(wu => {
            userMap.set(wu.userId, {
                user: wu.user,
                role: wu.role === 'ADMIN' ? 'ADMIN' : 'ARTIST', // Default mapping if not explicit in project
                source: 'workspace',
                workspaceRole: wu.role
            });
        });

        // Override with project specific roles
        projectUsers.forEach(pu => {
            const existing = userMap.get(pu.userId);
            userMap.set(pu.userId, {
                user: pu.user,
                role: pu.role,
                source: 'project',
                workspaceRole: existing?.workspaceRole
            });
        });

        // Ensure owner is in the list with ADMIN rights if not already
        if (!userMap.has(project.ownerId)) {
            userMap.set(project.ownerId, {
                user: project.owner,
                role: 'ADMIN',
                source: 'owner'
            });
        } else {
            // Force owner to be ADMIN effectively? Or just respect their role?
            // Usually owner is ADMIN.
            const ownerEntry = userMap.get(project.ownerId);
            ownerEntry.role = 'ADMIN';
            ownerEntry.source = 'owner';
        }

        return NextResponse.json(Array.from(userMap.values()));
    } catch (error) {
        console.error("Error fetching project users:", error);
        return NextResponse.json(
            { message: "Error fetching users" },
            { status: 500 }
        );
    }
}

// POST /api/projects/[projectId]/users
// Add a user to the project (create ProjectUser record)
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
        const { email, role } = await req.json();

        if (!email || !role) {
            return NextResponse.json({ message: "Email and role are required" }, { status: 400 });
        }

        // Check permissions
        const currentUserRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(currentUserRole, PERMISSIONS.MANAGE_PROJECT)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Find user by email
        const userToAdd = await prisma.user.findUnique({
            where: { email }
        });

        if (!userToAdd) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if user is already in the project explicitly
        const existingProjectUser = await prisma.projectUser.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: userToAdd.id
                }
            }
        });

        if (existingProjectUser) {
            return NextResponse.json({ message: "User already in project" }, { status: 409 });
        }

        // Create ProjectUser
        const newProjectUser = await prisma.projectUser.create({
            data: {
                projectId,
                userId: userToAdd.id,
                role: role
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(newProjectUser, { status: 201 });

    } catch (error) {
        console.error("Error adding user to project:", error);
        return NextResponse.json(
            { message: "Error adding user to project" },
            { status: 500 }
        );
    }
}
