import dynamic from "next/dynamic";

const AdminReviewDashboardPage = dynamic(
	() => import("./AdminReviewDashboardServer"),
	{
		ssr: true,
	}
);

export const AdminReviewDashboardHOC = () => {
	return <AdminReviewDashboardPage />;
};
