import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByCredentials, RegisterUser } from "@/src/lib/user-config";
import { connectToMongoose } from "@/src/lib/db";
import Users from "@/src/models/Users";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

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
          rol: user.rol || "default",
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
    signIn: '/register',
    error: "/register",
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account.provider === "google") {
        await connectToMongoose();
        const existingUser = await Users.findOne({ correo: profile.email });

        if (!existingUser) {
          throw new Error("Usuario no registrado");
        }

        return {
          id: existingUser._id,
          name: existingUser.nombre,
          email: existingUser.correo,
          rol: existingUser.rol || "default",
        };
      }

      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.rol = user.rol || 'default';
        token.id = user.id; // asegúrate que esté
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.rol = token.rol;
      session.user.id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/home`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
