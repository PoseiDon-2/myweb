// src/lib/auth.ts
import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                }

                if (!user.isVerified) {
                    throw new Error("กรุณายืนยัน OTP ก่อนล็อกอิน");
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    role: user.role,
                    name: `${user.fname} ${user.lname}`.trim() || "Unknown", // ป้องกัน string ว่าง
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.name = user.name;
            }
            console.log("JWT Callback - Token:", token);
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                id: token.id || token.sub || "unknown",
                email: token.email as string,
                role: token.role as string,
                name: token.name || "Unknown",
            };
            console.log("Session Callback - Session:", session);
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },
    debug: process.env.NODE_ENV === "development",
};