import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/projects/[projectId]/filters - Get user's filters for project
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

        const filters = await prisma.filter.findMany({
            where: {
                projectId,
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(filters);
    } catch (error) {
        console.error("Error fetching filters:", error);
        return NextResponse.json(
            { message: "Error fetching filters" },
            { status: 500 }
        );
    }
}

// POST /api/projects/[projectId]/filters - Create new filter
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
        const { name, criteria, isDefault } = await req.json();

        if (!name || !criteria) {
            return NextResponse.json(
                { message: "Name and criteria are required" },
                { status: 400 }
            );
        }

        const filter = await prisma.filter.create({
            data: {
                name,
                criteria: JSON.stringify(criteria),
                isDefault: isDefault || false,
                userId: session.user.id,
                projectId,
            },
        });

        return NextResponse.json(filter);
    } catch (error) {
        console.error("Error creating filter:", error);
        return NextResponse.json(
            { message: "Error creating filter" },
            { status: 500 }
        );
    }
}
