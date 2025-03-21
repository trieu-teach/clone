import { connectDB } from "@/lib/mongodb";
import customerModel from "@/models/customer";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { CustomerSchema } from "@/schemas/customerSchema";
import { StaffSchema } from "@/schemas/staffSchema";
import StaffModel from "@/models/staff";

export const customerAuthOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Customer Credentials",
      id: "customer-credentials",
      credentials: {
        email: { label: "Email", type: CustomerSchema.shape.email._type },
        password: { label: "Password", type: CustomerSchema.shape.password._type }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await customerModel.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!user) throw new Error("Wrong Email")
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!passwordMatch) throw new Error("Wrong Password");
        const userWithId = { id: user._id.toString(), role: "customer", ...user._doc };
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
        // Spread all user properties into the token
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Spread all token properties into session.user
        session.user = { ...session.user, ...token };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const staffAuthOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Staff Credentials",
      id: "staff-credentials",
      credentials: {
        email: { label: "Email", type: StaffSchema.shape.email._type },
        password: { label: "Password", type: StaffSchema.shape.password._type }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await StaffModel.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!user) throw new Error("Wrong Email")
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!passwordMatch) throw new Error("Wrong Password");
        const userWithId = { id: user._id.toString(), role: user.role, ...user._doc };
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
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = { ...session.user, ...token };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
