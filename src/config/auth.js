import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "./database";
import User from "../../models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  /** Same as AUTH_SECRET; explicit so config does not rely only on env inference. */
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const rawPassword = credentials?.password;
        if (
          rawEmail == null ||
          rawPassword == null ||
          String(rawEmail).trim() === "" ||
          String(rawPassword) === ""
        ) {
          return null;
        }

        await connectDB();

        const email = String(rawEmail).trim().toLowerCase();
        const plainPassword = String(rawPassword);

        const user = await User.findOne({ email }).select("+password");
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(plainPassword, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username ?? user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
});
