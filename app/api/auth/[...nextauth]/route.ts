import { loginUser } from "@/services/authservices";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				try {
					const response = await loginUser({
						email: credentials.email,
						password: credentials.password,
					});

					const user = response?.data?.user;

					if (user) {
						return {
							id: user._id,
							name: user.name,
							email: user.email,
						};
					}

					return null;
				} catch (error) {
					console.error("Login error in authorize():", error);
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt", // still fine; just won't store backend token here
	},
	callbacks: {
		async jwt({ token, user }) {
			// No backend token available here; just return token
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user!.id = token.id as string;
				session.user.email = token.email as string;
			}
			return session;
		},
	},
});

export { handler as GET, handler as POST };
