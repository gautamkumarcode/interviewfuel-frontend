import { practiceServices } from "@/services/practiceservices/practice-services";
import { useEffect, useState } from "react";
import { PracticeSession } from "../types";

interface UsePracticeHistoryProps {
	autoLoad?: boolean;
	pageSize?: number;
}

export function usePracticeHistory({
	autoLoad = true,
	pageSize = 10,
}: UsePracticeHistoryProps = {}) {
	const [sessions, setSessions] = useState<PracticeSession[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
	});

	const loadSessions = async (page = 1, limit = pageSize) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await practiceServices.getUserSessions(page, limit);

			if (response.success && response.data) {
				const sessionData = response.data.data;
				if (sessionData) {
					setSessions(sessionData.sessions);
					setPagination(
						sessionData.pagination || {
							page,
							limit,
							total: sessionData.sessions.length,
							totalPages: Math.ceil(sessionData.sessions.length / limit),
						}
					);
				}
			} else {
				throw new Error(response.message || "Failed to load sessions");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load sessions");
			console.error("Failed to load practice sessions:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const loadNextPage = () => {
		if (pagination.page < pagination.totalPages) {
			loadSessions(pagination.page + 1, pagination.limit);
		}
	};

	const loadPrevPage = () => {
		if (pagination.page > 1) {
			loadSessions(pagination.page - 1, pagination.limit);
		}
	};

	const refreshSessions = () => {
		loadSessions(1, pagination.limit);
	};

	useEffect(() => {
		if (autoLoad) {
			loadSessions();
		}
	}, [autoLoad, pageSize]);

	return {
		sessions,
		isLoading,
		error,
		pagination,
		loadSessions,
		loadNextPage,
		loadPrevPage,
		refreshSessions,
	};
}
