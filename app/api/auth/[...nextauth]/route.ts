// /app/api/auth/[...nextauth]/route.ts
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
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "user@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) {
						console.error("Missing credentials");
						throw new Error("Email and password are required");
					}


					const response = await loginUser({
						email: credentials.email,
						password: credentials.password,
					});


					if (!response?.data?.user || !response?.data?.token) {
						console.error("Invalid response structure:", {
							hasUser: !!response?.data?.user,
							hasToken: !!response?.data?.token,
						});
						throw new Error("Invalid credentials");
					}


					return {
						id: response.data.user._id,
						name: response.data.user.name,
						email: response.data.user.email,
						role: response.data.user.role,
						accessToken: response.data.token,
						refreshToken: response.data.refreshToken,
					};
				} catch (error: any) {
					console.error("Authorization error:", {
						message: error?.message,
						response: error?.response?.data,
						status: error?.response?.status,
					});

					// Return null to indicate authentication failure
					// NextAuth will handle showing the error
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60, // 24 hours for better UX
	},
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			// Initial sign in
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.role = user.role;
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
			}

			// Handle session updates (if needed)
			if (trigger === "update" && session?.accessToken) {
				token.accessToken = session.accessToken;
			}

			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.role = token.role;
				session.accessToken = token.accessToken;
				session.refreshToken = token.refreshToken;
				session.error = token.error; // For handling token refresh errors
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login", // Error code passed in query string as ?error=
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };

