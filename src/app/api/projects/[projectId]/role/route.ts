import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRoleInProject } from "@/lib/permissions";

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
        console.log(`[Role Check] User: ${session.user.id}, Project: ${projectId}`);
        const role = await getUserRoleInProject(session.user.id, projectId);
        console.log(`[Role Check] Resolved Role: ${role}`);

        return NextResponse.json({ role });
    } catch (error) {
        console.error("Error fetching user role:", error);
        return NextResponse.json(
            { message: "Error fetching user role" },
            { status: 500 }
        );
    }
}
