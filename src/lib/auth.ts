import { connectDB } from "@/lib/mongodb";
import userModel from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { zUser } from "@/zod/User";
import { SessionUser } from "@/types/Session";




export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: zUser.shape.email._type },
                password: { label: "Password", type: zUser.shape.password._type}
            },
            async authorize(credentials) {
                await connectDB();
                const user = await userModel.findOne({
                    email: credentials?.email,
                }).select("+password");
                if (!user) throw new Error("Wrong Email")
                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );
                if (!passwordMatch) throw new Error("Wrong Password");
                const userWithId = { id: user._id.toString(), role: user.access, ...user };
                return userWithId;
            },
        }),
    ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = (user as SessionUser).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.id as string
        (session.user as SessionUser).name = token.name as string
        (session.user as SessionUser).email = token.email as string
        (session.user as SessionUser).role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
