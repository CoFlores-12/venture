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
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Evita redirigir a /home después del logout
      if (url.startsWith(baseUrl + "/register")) {
        return url;
      }
      return `${baseUrl}/home`; // redirige siempre a /home después de login
    },
  },
});

export { handler as GET, handler as POST };
