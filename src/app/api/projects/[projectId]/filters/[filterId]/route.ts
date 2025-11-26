import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/projects/[projectId]/filters/[filterId] - Update filter
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; filterId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { projectId, filterId } = await params;
        const { name, criteria, isDefault } = await req.json();

        // Verify ownership
        const existingFilter = await prisma.filter.findUnique({
            where: { id: filterId },
        });

        if (!existingFilter || existingFilter.userId !== session.user.id) {
            return NextResponse.json({ message: "Filter not found" }, { status: 404 });
        }

        const filter = await prisma.filter.update({
            where: { id: filterId },
            data: {
                name: name || existingFilter.name,
                criteria: criteria ? JSON.stringify(criteria) : existingFilter.criteria,
                isDefault: isDefault !== undefined ? isDefault : existingFilter.isDefault,
            },
        });

        return NextResponse.json(filter);
    } catch (error) {
        console.error("Error updating filter:", error);
        return NextResponse.json(
            { message: "Error updating filter" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[projectId]/filters/[filterId] - Delete filter
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; filterId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { filterId } = await params;

        // Verify ownership
        const existingFilter = await prisma.filter.findUnique({
            where: { id: filterId },
        });

        if (!existingFilter || existingFilter.userId !== session.user.id) {
            return NextResponse.json({ message: "Filter not found" }, { status: 404 });
        }

        await prisma.filter.delete({
            where: { id: filterId },
        });

        return NextResponse.json({ message: "Filter deleted" });
    } catch (error) {
        console.error("Error deleting filter:", error);
        return NextResponse.json(
            { message: "Error deleting filter" },
            { status: 500 }
        );
    }
}
