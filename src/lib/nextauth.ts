import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
        }),
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
