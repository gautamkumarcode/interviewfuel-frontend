"use client";

import { ModalProvider } from "@/context/modal-context";
import { ThemeProvider } from "@/context/theme.context";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { QueryClient, QueryClientProvider } from "react-query";

export const Provider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 0,
				refetchOnReconnect: false,
			},
		},
	});
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<ModalProvider>
						<NextTopLoader showSpinner={false} color="#0CAF60" />
						{children}
					</ModalProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</NextThemesProvider>
	);
};
