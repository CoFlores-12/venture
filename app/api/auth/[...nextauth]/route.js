import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByCredentials, RegisterUser } from "@/src/lib/user-config";

const handler = NextAuth({
  providers: [
    //User Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    //User login
     CredentialsProvider({
      id: "user-login",
      name: "Usuario",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await findUserByCredentials(credentials.email, credentials.password);
        if (!user) return null;

        return {
          id: user._id,
          name: user.nombre,
          email: user.correo,
          role: user.rol || "default",
        };
      }
    }),

    CredentialsProvider({
      id: "user-register",
      name: "Usuario",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "password", type: "password" },
        nombre: { label: "nombre", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials.nombre) return null;

        const user = await RegisterUser(credentials.email, credentials.password, credentials.nombre);
         if (!user) {
          throw new Error("Error al registrar usuario.");
        }

        if (user.error) {
          throw new Error(user.error);
        }

        return {
          id: user._id,
          name: user.nombre,
          email: user.correo,
          role: user.rol || "default",
        };
      }
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

      return `${baseUrl}/home`; // Default redirect
    },
  },
});

export { handler as GET, handler as POST };