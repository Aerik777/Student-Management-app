import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        
        if (!user) throw new Error("User not found");
        
        const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);
        if (!isPasswordCorrect) throw new Error("Invalid password");

        return { id: user._id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    // This handles the "GET /api/auth/session" logic
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login", // Custom UI for "GET /api/auth/signin"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };