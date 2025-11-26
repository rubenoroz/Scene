import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma client
import { auth, authOptions } from "@/lib/auth"; // Import auth and authOptions

export async function GET(request: Request) {
  try {
    const session = await auth(); // Use the auth helper

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // The userId is now taken from the session, not the query params for security
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const isArchived = searchParams.get("archived") === "true";

    // Get projects where user is owner OR a project member
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            projectUsers: {
              some: {
                userId: userId
              }
            }
          }
        ],
        isArchived: isArchived
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("API_PROJECTS_GET_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth(); // Use the auth helper

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verify user exists in DB (in case of DB reset while session is active)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please sign in again." },
        { status: 401 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    // For simplicity, we'll find or create a default workspace for the user.
    // In a real multi-tenant app, this would be more sophisticated.
    let workspace = await prisma.workspace.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: `${session.user.name || session.user.email}'s Workspace`,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("API_PROJECTS_POST_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
