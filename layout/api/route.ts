import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@school.com" },
        rollNumber: { label: "Roll Number", type: "text" },
      },
      async authorize(credentials) {
        await connectDB();

        // 1. Check if user exists
        const user = await Student.findOne({ 
          email: credentials?.email,
          rollNumber: credentials?.rollNumber 
        });

        if (!user) {
          throw new Error("Invalid email or roll number");
        }

        // 2. Return user object to be encrypted in the JWT
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "student", // You can add roles to your schema later
        };
      },
    }),
  ],
  callbacks: {
    // This attaches the user ID to the session so you can use it in your apps
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page if you have one
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };