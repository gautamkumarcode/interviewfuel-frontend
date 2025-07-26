"use client";

import { Toaster } from "@/components/custom/Toaster/Toaster";
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from "react";

type ToasterState = {
	message: string;
	status: boolean;
	color: string;
	type: string;
};

type Toast = {
	error: (message: string) => void;
	success: (message: string) => void;
};

interface ThemeContextProps {
	setShowToaster: React.Dispatch<React.SetStateAction<ToasterState>>;
	toast: Toast;
	showToaster: ToasterState;
	toggleMode: () => void;
	isDarkMode: boolean;
}

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps>(
	{} as ThemeContextProps
);

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
	children,
}) => {
	const [showToaster, setShowToaster] = useState<ToasterState>({
		status: false,
		message: "",
		color: "",
		type: "",
	});

	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const savedMode = localStorage.getItem("light");

		if (savedMode) {
			setIsDarkMode(savedMode === "dark");
			if (savedMode === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		} else {
			setIsDarkMode(true);
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}
	}, []);

	const toggleMode = () => {
		setIsDarkMode((prev) => !prev);
		const newMode = !isDarkMode ? "dark" : "light";
		localStorage.setItem("theme", newMode);
		if (newMode === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	let toasterTimeout: NodeJS.Timeout;
	const toast = {
		error: (message: string) => {
			setShowToaster({
				...showToaster,
				message: message,
				status: true,
				type: "Error",
			});
			toasterTimeout = setTimeout(() => {
				setShowToaster({
					...showToaster,
					status: false,
				});
			}, 3000);
		},
		success: (message: string) => {
			setShowToaster({
				...showToaster,
				message: message,
				status: true,
				type: "Success",
			});
			toasterTimeout = setTimeout(() => {
				setShowToaster({
					...showToaster,
					status: false,
				});
			}, 3000);
		},
	};

	useEffect(() => {
		return () => {
			clearTimeout(toasterTimeout);
		};
	}, []);

	return (
		<ThemeContext.Provider
			value={{ showToaster, toast, setShowToaster, isDarkMode, toggleMode }}>
			{showToaster.status && <Toaster />}
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
