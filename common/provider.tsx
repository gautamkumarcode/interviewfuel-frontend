"use client";

import { ClusterDataProvider } from "@/context/clusterData-context";
import { ModalProvider } from "@/context/modal-context";
import { ThemeProvider as CustomThemeProvider } from "@/context/theme.context";
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
		// <NextThemesProvider
		// 	attribute="class"
		// 	defaultTheme="light"
		// 	enableSystem
		// 	disableTransitionOnChange>
		<QueryClientProvider client={queryClient}>
			<ClusterDataProvider>
				<CustomThemeProvider>
					<ModalProvider>
						<NextTopLoader showSpinner={false} color="#0CAF60" />
						{children}
					</ModalProvider>
				</CustomThemeProvider>
			</ClusterDataProvider>
		</QueryClientProvider>
		// </NextThemesProvider>
	);
};