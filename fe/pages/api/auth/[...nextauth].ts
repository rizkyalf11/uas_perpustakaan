import nextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},

      async authorize(credentials): Promise<any> {
        return {
          ...credentials
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return {
        ...token,
        ...user
      }
    },

    async session({ session, token }) {
      session.user.id =   Number(token.id);
      session.user.nama = token.nama; 
      session.user.role = token.role; 
      session.user.accessToken = token.access_token;
      session.user.refreshToken = token.refresh_token;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/error",
  },
}

export default nextAuth(authOption);