"use client";

import { ModalProvider } from "@/context/modal-context";
import { ThemeProvider } from "@/context/theme.context";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export const Provider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<ThemeProvider>
				<ModalProvider>
					<NextTopLoader showSpinner={false} color="#0CAF60" />
					{children}
				</ModalProvider>
			</ThemeProvider>
		</NextThemesProvider>
	);
};
