"use client";

import { AuthModal } from "@/components/custom/modal/AuthModal";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { ClusterDataProvider } from "@/context/clusterData-context";
import { ModalProvider } from "@/context/modal-context";
import { ThemeProvider as CustomThemeProvider } from "@/context/theme.context";
import { SessionProvider } from "next-auth/react";
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
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ClusterDataProvider>
					<CustomThemeProvider>
						<ModalProvider>
							<AuthModalProvider>
								<NextTopLoader showSpinner={false} color="#0CAF60" />
								{children}
								<AuthModal />
							</AuthModalProvider>
						</ModalProvider>
					</CustomThemeProvider>
				</ClusterDataProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
};