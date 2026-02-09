import NextAuth from "next-auth";
import { authOptions } from "@/lib/nextauth";

// Remove edge runtime - NextAuth v4 requires Node.js runtime
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
