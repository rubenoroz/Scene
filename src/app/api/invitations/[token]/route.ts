import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/invitations/[token]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json({ message: "Token is required" }, { status: 400 });
        }

        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: {
                project: {
                    select: {
                        name: true,
                        description: true,
                        owner: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!invitation) {
            return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ message: "Invitation expired" }, { status: 410 });
        }

        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: invitation.email },
            select: { id: true, name: true, email: true, image: true }
        });

        return NextResponse.json({
            invitation,
            existingUser
        });

    } catch (error) {
        console.error("Error fetching invitation:", error);
        return NextResponse.json(
            { message: "Error fetching invitation" },
            { status: 500 }
        );
    }
}
