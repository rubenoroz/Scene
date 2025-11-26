import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { hasPermission, ROLES } from "@/lib/permissions";

export function usePermissions(projectId: string) {
    const { data: session } = useSession();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!projectId || !session?.user) return;

        setIsLoading(true);
        fetch(`/api/projects/${projectId}/role`)
            .then((res) => res.json())
            .then((data) => {
                setUserRole(data.role);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching user role:", err);
                setIsLoading(false);
            });
    }, [projectId, session]);

    const can = (permission: readonly string[]) => {
        if (!userRole) return false;
        return hasPermission(userRole, permission);
    };

    const isOwner = (userId: string) => {
        return session?.user?.id === userId;
    };

    return {
        userRole,
        can,
        isLoading,
        isAdmin: userRole === ROLES.ADMIN,
        isProjectManager: userRole === ROLES.PROJECT_MANAGER,
        isArtist: userRole === ROLES.ARTIST,
        isViewer: userRole === ROLES.VIEWER
    };
}
