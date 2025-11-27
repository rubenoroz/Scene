import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, ROLES } from "@/lib/permissions";
import { Trash2, UserPlus, Shield } from "lucide-react";

interface ProjectSettingsProps {
    projectId: string;
}

interface ProjectUser {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    role: string;
    source: 'project' | 'workspace' | 'owner';
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
    const { data: session } = useSession();
    const { can, isLoading: permissionsLoading } = usePermissions(projectId);
    const [users, setUsers] = useState<ProjectUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<string>(ROLES.ARTIST);
    const [isInviting, setIsInviting] = useState(false);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [projectName, setProjectName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchInvitations();
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setProjectName(data.name);
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
        }
    };

    const handleUpdateProjectName = async () => {
        if (!projectName.trim()) return;
        setIsUpdatingName(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: projectName }),
            });

            if (res.ok) {
                alert("Project name updated successfully!");
                // Optionally trigger a global refresh or context update if needed
                window.location.reload(); // Simple way to refresh the name in the header/sidebar
            } else {
                alert("Failed to update project name");
            }
        } catch (error) {
            console.error("Error updating project name:", error);
            alert("Error updating project name");
        } finally {
            setIsUpdatingName(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/invitations`);
            if (res.ok) {
                const data = await res.json();
                setInvitations(data);
            }
        } catch (error) {
            console.error("Error fetching invitations:", error);
        }
    };

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsInviting(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/invitations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });

            if (res.ok) {
                setInviteEmail("");
                alert("Invitation created successfully!");
                fetchInvitations();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to invite user");
            }
        } catch (error) {
            console.error("Error inviting user:", error);
        } finally {
            setIsInviting(false);
        }
    };

    // ... (handleRoleChange and handleRemoveUser remain the same)

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this user from the project?")) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/users/${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to remove user");
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };

    // Check loading states first
    if (loading || permissionsLoading) {
        return <div className="p-4">Loading...</div>;
    }

    // Check permissions after loading
    if (!can(PERMISSIONS.MANAGE_PROJECT)) {
        return <div className="p-4">You do not have permission to view project settings.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Project Access & Roles
                </h2>
            </div>

            {/* General Settings */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-3 text-slate-700">General Settings</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Project Name</label>
                        <Input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="bg-white h-10"
                        />
                    </div>
                    <Button
                        onClick={handleUpdateProjectName}
                        disabled={isUpdatingName || !projectName.trim()}
                        className="h-10"
                    >
                        {isUpdatingName ? "Saving..." : "Save Name"}
                    </Button>
                </div>
            </div>

            {/* Invite User Form */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-3 text-slate-700">Invite User to Project</h3>
                <form onSubmit={handleInviteUser} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <Input
                            type="email"
                            placeholder="user@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            className="bg-white h-10"
                        />
                    </div>
                    <div className="col-span-4 space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger className="bg-white h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ROLES.PROJECT_MANAGER}>Project Manager</SelectItem>
                                <SelectItem value={ROLES.ARTIST}>Artist</SelectItem>
                                <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2 pt-6">
                        <Button type="submit" disabled={isInviting} className="w-full h-10">
                            {isInviting ? "Inviting..." : <><UserPlus className="w-4 h-4 mr-2" /> Invite</>}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Pending Invitations</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Sent At</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="text-right">Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell>{inv.email}</TableCell>
                                        <TableCell>{inv.role}</TableCell>
                                        <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(inv.expiresAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const link = `${window.location.origin}/invite/${inv.token}`;
                                                    navigator.clipboard.writeText(link);
                                                    alert("Invitation link copied to clipboard!");
                                                }}
                                            >
                                                Copy Link
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Project Members</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Access Source</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {u.user.image && (
                                                <img src={u.user.image} alt="" className="w-6 h-6 rounded-full" />
                                            )}
                                            {u.user.name || "Unknown"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{u.user.email}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded-full ${u.source === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            u.source === 'workspace' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {u.source === 'owner' ? 'Owner' :
                                                u.source === 'workspace' ? 'Workspace' : 'Project'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {u.source === 'owner' ? (
                                            <span className="font-semibold text-slate-700">Admin</span>
                                        ) : (
                                            <Select
                                                value={u.role}
                                                onValueChange={(val) => handleRoleChange(u.user.id, val)}
                                                disabled={u.user.id === session?.user?.id} // Prevent changing own role
                                            >
                                                <SelectTrigger className="w-32 h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                                                    <SelectItem value={ROLES.PROJECT_MANAGER}>Manager</SelectItem>
                                                    <SelectItem value={ROLES.ARTIST}>Artist</SelectItem>
                                                    <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {u.source === 'project' && u.user.id !== session?.user?.id && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveUser(u.user.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
