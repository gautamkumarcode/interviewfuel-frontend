import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, UserCheck, Users, UserX } from "lucide-react";

interface UserStatsProps {
	stats: {
		total: number;
		active: number;
		inactive: number;
		admins: number;
		regular: number;
		newUsersLast30Days: number;
	};
}

export function UserStats({ stats }: UserStatsProps) {
	const statCards = [
		{
			title: "Total Users",
			value: stats.total,
			icon: Users,
			color: "text-blue-600",
			bgColor: "bg-blue-100",
		},
		{
			title: "Active Users",
			value: stats.active,
			icon: UserCheck,
			color: "text-green-600",
			bgColor: "bg-green-100",
		},
		{
			title: "Inactive Users",
			value: stats.inactive,
			icon: UserX,
			color: "text-red-600",
			bgColor: "bg-red-100",
		},
		{
			title: "Admin Users",
			value: stats.admins,
			icon: Shield,
			color: "text-purple-600",
			bgColor: "bg-purple-100",
		},
		{
			title: "New Users (30d)",
			value: stats.newUsersLast30Days,
			icon: TrendingUp,
			color: "text-orange-600",
			bgColor: "bg-orange-100",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
			{statCards.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
						<div className={`p-2 rounded-lg ${stat.bgColor}`}>
							<stat.icon className={`h-4 w-4 ${stat.color}`} />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
