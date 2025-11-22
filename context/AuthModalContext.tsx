"use client";

import { usePathname } from "next/navigation";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type ViewType = "login" | "signup";

interface AuthModalContextType {
	isOpen: boolean;
	view: ViewType;
	callbackUrl: string | null;
	openLogin: (callback?: string) => void;
	openSignup: (callback?: string) => void;
	closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
	undefined
);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [view, setView] = useState<ViewType>("login");
	const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
	const pathname = usePathname();

	// Listen for custom event from axios interceptor
	useEffect(() => {
		const handleOpenAuthModal = (event: CustomEvent) => {
			const { view: modalView, reason } = event.detail || {};

			if (modalView === "login") {
				openLogin(pathname);
			} else if (modalView === "signup") {
				openSignup(pathname);
			}
		};

		window.addEventListener(
			"openAuthModal",
			handleOpenAuthModal as EventListener
		);

		return () => {
			window.removeEventListener(
				"openAuthModal",
				handleOpenAuthModal as EventListener
			);
		};
	}, [pathname]);

	const openLogin = (callback?: string) => {
		setView("login");
		// Use provided callback or current pathname
		setCallbackUrl(callback || pathname);
		setIsOpen(true);
	};

	const openSignup = (callback?: string) => {
		setView("signup");
		// Use provided callback or current pathname
		setCallbackUrl(callback || pathname);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		// Clear callback after closing
		setTimeout(() => setCallbackUrl(null), 300);
	};

	return (
		<AuthModalContext.Provider
			value={{ isOpen, view, callbackUrl, openLogin, openSignup, closeModal }}>
			{children}
		</AuthModalContext.Provider>
	);
};

export const useAuthModal = () => {
	const context = useContext(AuthModalContext);
	if (!context) {
		throw new Error("useAuthModal must be used within an AuthModalProvider");
	}
	return context;
};
