# Authentication Guards Implementation

## Overview

This document describes the authentication guard system implemented to protect pages that require user authentication or specific roles.

## Components

### 1. AuthGuard (Client-Side)

**Location:** `frontend/components/common/AuthGuard.tsx`

Protects pages that require any authenticated user. Shows a sign-in prompt if the user is not logged in.

**Usage:**

```tsx
import { AuthGuard } from "@/components/common";

export default function ProtectedPage() {
	return (
		<AuthGuard redirectMessage="Sign in to access this feature">
			<YourComponent />
		</AuthGuard>
	);
}
```

### 2. AdminOnly (Client-Side)

**Location:** `frontend/components/common/AdminOnly.tsx`

Protects pages/components that require admin or moderator access.

**Usage:**

```tsx
import { AdminOnly } from "@/components/common";

export default function AdminPage() {
	return (
		<AdminOnly fallback={<AccessDenied />}>
			<AdminComponent />
		</AdminOnly>
	);
}
```

### 3. Server-Side Auth Check

For server components, check authentication using NextAuth session:

```tsx
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function ServerProtectedPage() {
	const session = await getServerSession(authOptions);

	if (!session?.accessToken) {
		return <SignInPrompt />;
	}

	// Render protected content
}
```

## Protected Pages

### Pages with AuthGuard (Authenticated Users Only)

- `/practice` - Practice mode
- `/practice/history` - Practice history
- `/my-questions` - User's submitted questions
- `/questions/create` - Create new question
- `/questions/edit/[id]` - Edit question

### Pages with Server-Side Auth Check

- `/analytics` - User analytics dashboard
- `/profile` - User profile
- `/liked-questions` - User's liked questions
- `/bookmarks` - User's bookmarked questions

### Pages with AdminOnly Guard

- `/admin-review` - Admin review dashboard
- `/admin-review/[id]` - Question review detail

### Public Pages (No Auth Required)

- `/` - Landing page
- `/questions` - Browse questions
- `/questions/[category]/[slug]` - Question details
- `/search` - Search results
- `/practice/shared/[sessionId]` - Shared practice results

## Hooks

### useIsAuthenticated

Check if user is authenticated:

```tsx
import { useIsAuthenticated } from "@/components/common";

const { isAuthenticated, isLoading, user } = useIsAuthenticated();
```

### useIsAdmin

Check if user is admin:

```tsx
import { useIsAdmin } from "@/components/common";

const isAdmin = useIsAdmin();
```

### useUserRole

Get detailed user role information:

```tsx
import { useUserRole } from "@/components/common";

const { role, isAdmin, isModerator, hasModeratorAccess } = useUserRole();
```

## Implementation Notes

1. **Client-Side Guards** are used for pages that need immediate UI feedback and modal-based authentication
2. **Server-Side Checks** are used for pages that fetch data server-side and need SEO-friendly redirects
3. **AdminOnly** wraps both client and server components for admin-specific features
4. All guards integrate with the `AuthModalContext` to show the login modal when needed
