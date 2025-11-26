export const ROLES = {
    ADMIN: 'ADMIN',
    PROJECT_MANAGER: 'PROJECT_MANAGER',
    ARTIST: 'ARTIST',
    VIEWER: 'VIEWER',
} as const;

export type Role = keyof typeof ROLES;

export const PERMISSIONS = {
    // Workspace
    MANAGE_WORKSPACE: ['ADMIN'],
    CREATE_PROJECT: ['ADMIN', 'PROJECT_MANAGER'],
    DELETE_PROJECT: ['ADMIN'],

    // Project
    MANAGE_PROJECT: ['ADMIN', 'PROJECT_MANAGER'],
    VIEW_PROJECT: ['ADMIN', 'PROJECT_MANAGER', 'ARTIST', 'VIEWER'],
    MANAGE_ROLES: ['ADMIN', 'PROJECT_MANAGER'],

    // Tasks
    CREATE_TASK: ['ADMIN', 'PROJECT_MANAGER'],
    EDIT_ANY_TASK: ['ADMIN', 'PROJECT_MANAGER'],
    EDIT_OWN_TASK: ['ADMIN', 'PROJECT_MANAGER', 'ARTIST'],
    DELETE_TASK: ['ADMIN', 'PROJECT_MANAGER'],
    ASSIGN_TASK: ['ADMIN', 'PROJECT_MANAGER'],

    // Comments
    ADD_COMMENT: ['ADMIN', 'PROJECT_MANAGER', 'ARTIST'],
    DELETE_ANY_COMMENT: ['ADMIN', 'PROJECT_MANAGER'],
    DELETE_OWN_COMMENT: ['ADMIN', 'PROJECT_MANAGER', 'ARTIST'],

    // Files
    UPLOAD_FILE: ['ADMIN', 'PROJECT_MANAGER', 'ARTIST'],
    DELETE_FILE: ['ADMIN', 'PROJECT_MANAGER'],
} as const;

export function hasPermission(userRole: string, allowedRoles: readonly string[]): boolean {
    return allowedRoles.includes(userRole);
}

import prisma from "@/lib/prisma";

export async function getUserRoleInProject(userId: string, projectId: string): Promise<string> {
    // 1. Check direct project role
    const projectUser = await prisma.projectUser.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
    });

    if (projectUser) return projectUser.role;

    // 2. Check workspace role (if implemented, workspace admins might have access to all projects)
    // For now, we'll assume project-level roles are primary. 
    // But we should check if the user is a workspace admin.

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { workspaceId: true },
    });

    if (project) {
        const workspaceUser = await prisma.workspaceUser.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: project.workspaceId,
                    userId,
                },
            },
        });

        if (workspaceUser && workspaceUser.role === ROLES.ADMIN) {
            return ROLES.ADMIN;
        }
    }

    // Default fallback (e.g., if user is owner of project)
    const projectOwner = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
    });

    if (projectOwner && projectOwner.ownerId === userId) {
        return ROLES.ADMIN;
    }

    return ROLES.VIEWER; // Default role if found but no specific role assigned? Or maybe null?
    // For safety, let's return a restricted role or handle "not found"
}
