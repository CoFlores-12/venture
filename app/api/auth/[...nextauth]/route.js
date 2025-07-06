import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 365,
  },
  pages: {
    signIn: '/register', // si usas una página personalizada de login
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        // Set default role for regular users
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role || 'user';
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/home`; // Default redirect for regular users
    },
  },
});

export { handler as GET, handler as POST };
