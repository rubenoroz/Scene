import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/invitations/accept
export async function POST(req: NextRequest) {
    try {
        const { token, name, password } = await req.json();

        if (!token) {
            return NextResponse.json({ message: "Token is required" }, { status: 400 });
        }

        // 1. Validate Invitation
        const invitation = await prisma.invitation.findUnique({
            where: { token }
        });

        if (!invitation) {
            return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ message: "Invitation expired" }, { status: 410 });
        }

        let userId: string;

        // 2. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: invitation.email }
        });

        if (existingUser) {
            userId = existingUser.id;
        } else {
            // 3. Create new user if not exists
            if (!name || !password) {
                return NextResponse.json({ message: "Name and password are required for new users" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    email: invitation.email,
                    name,
                    hashedPassword
                }
            });
            userId = newUser.id;
        }

        // 4. Add user to project
        // Check if already in project to avoid unique constraint error
        const existingProjectUser = await prisma.projectUser.findUnique({
            where: {
                projectId_userId: {
                    projectId: invitation.projectId,
                    userId
                }
            }
        });

        if (!existingProjectUser) {
            await prisma.projectUser.create({
                data: {
                    projectId: invitation.projectId,
                    userId,
                    role: invitation.role
                }
            });
        }

        // 5. Delete invitation
        await prisma.invitation.delete({
            where: { id: invitation.id }
        });

        return NextResponse.json({ message: "Invitation accepted successfully" });

    } catch (error) {
        console.error("Error accepting invitation:", error);
        return NextResponse.json(
            { message: "Error accepting invitation" },
            { status: 500 }
        );
    }
}
