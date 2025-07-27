import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			role?: string;
		} & DefaultSession["user"];
		accessToken?: string;
	}

	interface User extends DefaultUser {
		id: string;
		role?: string;
		accessToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		role?: string;
		accessToken?: string;
	}
}
