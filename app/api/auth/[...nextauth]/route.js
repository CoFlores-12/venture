import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findAdminByCredentials } from "@/src/lib/admin-config";
import { findUserByCredentials } from "@/src/lib/user-config";

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
          role: user.rol || "user",
        };
      }
    }),


    //Admin Login
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        adminCode: { label: "Admin Code", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.adminCode) {
          return null;
        }

        const admin =await findAdminByCredentials(
          credentials.email, 
          credentials.password, 
          credentials.adminCode
        );
        
        
        
        if (admin) {
          return {
            id: admin._id,
            name: admin.nombre,
            email: admin.correo,
            role: admin.rol
          };
        }

        return null;
      }
    })
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/admin/login') && url.includes('callback')) {
        return `${baseUrl}/admin/dashboard`;
      }
      return `${baseUrl}/home`; // Default redirect

    },
  },
});

export { handler as GET, handler as POST };
