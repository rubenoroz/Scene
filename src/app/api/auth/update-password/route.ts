import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: "Missing current or new password" },
                { status: 400 }
            );
        }

        // Fetch user to get current hashed password
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.hashedPassword) {
            return NextResponse.json(
                { message: "User not found or password not set" },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Incorrect current password" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        await prisma.user.update({
            where: { email: session.user.email },
            data: { hashedPassword: hashedNewPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("UPDATE_PASSWORD_ERROR", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
