"use client";

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useState } from "react";

type ViewType = "login" | "signup";

interface AuthModalContextType {
	isOpen: boolean;
	view: ViewType;
	openLogin: () => void;
	openSignup: () => void;
	closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
	undefined
);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [view, setView] = useState<ViewType>("login");

	const { data: session, status } = useSession();

	const { user } = session || {};

	console.log(user);

	const openLogin = () => {
		setView("login");
		setIsOpen(true);
	};

	const openSignup = () => {
		setView("signup");
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<AuthModalContext.Provider
			value={{ isOpen, view, openLogin, openSignup, closeModal }}>
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
