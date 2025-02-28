import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      identifier: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    identifier: string;
  }
}

export const { handlers, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    jwt({ token, account, user }) {
      if (account !== null && user !== undefined) {
        // token.name = user.name
        token.identifier = user.email ?? "";
      }
      return token;
    },
    session({ session, token }) {
      // Send properties to the client.
      // session.user.name = token.name
      session.user.identifier = token.identifier;
      return session;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
