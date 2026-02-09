import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        {
            id: "google",
            name: "Google",
            type: "oauth",
            wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
            authorization: { params: { scope: "openid email profile" } },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
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
    secret: process.env.NEXTAUTH_SECRET,
};
