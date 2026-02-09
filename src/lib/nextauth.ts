import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export const authOptions: NextAuthOptions = {
    providers: [
        ...(googleClientId && googleClientSecret && !isBuildPhase ? [
            GoogleProvider({
                clientId: googleClientId,
                clientSecret: googleClientSecret,
            })
        ] : []),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
};
