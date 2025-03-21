import { staffAuthOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = async (req: any, res: any) => {
  try {
    return await NextAuth(req, res, staffAuthOptions);
  } catch (error) {
    console.error("NextAuth Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { handler as GET, handler as POST };
