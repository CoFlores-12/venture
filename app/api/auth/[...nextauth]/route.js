import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Simple admin users storage (in production, use a database)
const adminUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@venture.com",
    password: "admin123", // In production, use hashed passwords
    adminCode: "VENTURE2024",
    role: "admin"
  }
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

        const admin = adminUsers.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password &&
            user.adminCode === credentials.adminCode
        );

        if (admin) {
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
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
    signIn: '/register', // Default sign in page
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
      // Check if the user is an admin and redirect accordingly
      if (url.includes('/admin/login') && url.includes('callback')) {
        return `${baseUrl}/admin/dashboard`;
      }
      return `${baseUrl}/home`; // Default redirect
    },
  },
});

export { handler as GET, handler as POST };
