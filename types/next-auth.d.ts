// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		name: string;
		email: string;
		role: string;
		accessToken: string;
		refreshToken?: string;
	}

	interface Session {
		user: User;
		accessToken: string;
		refreshToken?: string;
		error?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		name: string;
		role: string;
		accessToken: string;
		refreshToken?: string;
		error?: string;
	}
}
