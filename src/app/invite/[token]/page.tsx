"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [invitation, setInvitation] = useState<any>(null);
    const [existingUser, setExistingUser] = useState<any>(null);

    // Form state for new users
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (token) {
            validateToken();
        }
    }, [token]);

    const validateToken = async () => {
        try {
            const res = await fetch(`/api/invitations/${token}`);
            if (res.ok) {
                const data = await res.json();
                setInvitation(data.invitation);
                setExistingUser(data.existingUser);
            } else {
                const err = await res.json();
                setError(err.message || "Invalid invitation");
            }
        } catch (error) {
            setError("Failed to validate invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/invitations/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    name: existingUser ? undefined : name,
                    password: existingUser ? undefined : password
                }),
            });

            if (res.ok) {
                // If new user, sign them in automatically? 
                // Or redirect to login.
                // For existing users, they might be already logged in.

                if (session) {
                    router.push(`/projects/${invitation.projectId}`);
                } else {
                    // Redirect to login
                    router.push("/login?message=Invitation accepted. Please login.");
                }
            } else {
                const err = await res.json();
                alert(err.message || "Failed to accept invitation");
            }
        } catch (error) {
            console.error("Error accepting:", error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <AlertCircle /> Error
                        </CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                            Go Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>You're invited!</CardTitle>
                    <CardDescription>
                        You have been invited to join <strong>{invitation.project.name}</strong> as a <strong>{invitation.role}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                            Invited Email: <strong>{invitation.email}</strong>
                        </div>

                        {existingUser ? (
                            <div className="text-center py-4">
                                <p className="mb-4 text-sm text-gray-600">
                                    We found an existing account for this email.
                                </p>
                                <Button onClick={handleAccept} disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? "Joining..." : "Join Project"}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Create your account to join:</p>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <Button
                                    onClick={handleAccept}
                                    disabled={isSubmitting || !name || !password}
                                    className="w-full"
                                >
                                    {isSubmitting ? "Creating Account..." : "Create Account & Join"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
