import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";
import crypto from "crypto";

// GET /api/projects/[projectId]/invitations
// List pending invitations
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

        // Check permissions
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.MANAGE_ROLES)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const invitations = await prisma.invitation.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(invitations);
    } catch (error) {
        console.error("Error fetching invitations:", error);
        return NextResponse.json(
            { message: "Error fetching invitations" },
            { status: 500 }
        );
    }
}

// POST /api/projects/[projectId]/invitations
// Create a new invitation
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
        const userRole = await getUserRoleInProject(session.user.id, projectId);
        if (!hasPermission(userRole, PERMISSIONS.MANAGE_ROLES)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Check if user is already in the project
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const existingProjectUser = await prisma.projectUser.findUnique({
                where: {
                    projectId_userId: {
                        projectId,
                        userId: existingUser.id
                    }
                }
            });

            if (existingProjectUser) {
                return NextResponse.json({ message: "User is already a member of this project" }, { status: 400 });
            }
        }

        // Check if invitation already exists
        const existingInvitation = await prisma.invitation.findUnique({
            where: {
                email_projectId: {
                    email,
                    projectId
                }
            }
        });

        if (existingInvitation) {
            return NextResponse.json({ message: "Invitation already sent to this email" }, { status: 400 });
        }

        // Create invitation
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

        const invitation = await prisma.invitation.create({
            data: {
                email,
                projectId,
                role,
                token,
                expiresAt
            }
        });

        // TODO: Send email with the link: ${process.env.NEXTAUTH_URL}/invite/${token}
        console.log(`Invitation created for ${email}. Token: ${token}`);

        return NextResponse.json(invitation, { status: 201 });
    } catch (error) {
        console.error("Error creating invitation:", error);
        return NextResponse.json(
            { message: "Error creating invitation" },
            { status: 500 }
        );
    }
}
