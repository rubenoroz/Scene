import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserRoleInProject, hasPermission, PERMISSIONS } from "@/lib/permissions";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Configure max file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Allowed file types
const ALLOWED_TYPES = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // Videos
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    // Design files
    "application/x-photoshop",
    "application/postscript",
    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    // Text files
    "text/plain",
    "text/csv",
];

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const projectId = formData.get("projectId") as string;
        const taskId = formData.get("taskId") as string;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        if (!projectId || !taskId) {
            return NextResponse.json(
                { message: "Project ID and Task ID are required" },
                { status: 400 }
            );
        }

        // Check permissions
        const userRole = await getUserRoleInProject(session.user.id, projectId);

        // Check if user can edit any task
        const canEditAny = hasPermission(userRole, PERMISSIONS.EDIT_ANY_TASK);

        if (!canEditAny) {
            // If not, check if they can edit their own task AND are assigned to it
            const canEditOwn = hasPermission(userRole, PERMISSIONS.EDIT_OWN_TASK);
            if (!canEditOwn) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }

            // Verify assignment
            const task = await prisma.task.findUnique({
                where: { id: taskId },
                include: { assignees: true }
            });

            if (!task) {
                return NextResponse.json({ message: "Task not found" }, { status: 404 });
            }

            const isAssigned = task.assignees.some((a: { id: string }) => a.id === session.user.id);
            if (!isAssigned) {
                return NextResponse.json({ message: "Forbidden: You are not assigned to this task" }, { status: 403 });
            }
        }

        // ... rest of the upload logic ...

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: "File size exceeds 50MB limit" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { message: `File type ${file.type} is not allowed` },
                { status: 400 }
            );
        }

        // Create directory structure
        const uploadDir = join(process.cwd(), "public", "uploads", projectId, taskId);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}_${originalName}`;
        const filepath = join(uploadDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return file URL
        const fileUrl = `/uploads/${projectId}/${taskId}/${filename}`;

        return NextResponse.json({
            url: fileUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { message: "Error uploading file" },
            { status: 500 }
        );
    }
}
