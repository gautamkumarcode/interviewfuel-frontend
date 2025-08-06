import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/user";
import { formatDate } from "@/utils/profileUtils";
import {
	Calendar,
	Camera,
	Edit,
	Github,
	Linkedin,
	LinkIcon,
	Mail,
	MapPin,
	Share2,
	Twitter,
} from "lucide-react";

interface ProfileHeaderProps {
	user: User;
	isEditing: boolean;
	setIsEditing: (value: boolean) => void;
	editedData: Partial<User>;
	setEditedData: (data: Partial<User>) => void;
}

export default function ProfileHeader({
	user,
	isEditing,
	setIsEditing,
	editedData,
	setEditedData,
}: ProfileHeaderProps) {
	const handleSocialChange = (
		platform: keyof User["social"],
		value: string
	) => {
		setEditedData({
			...editedData,
			social: {
				github: editedData.social?.github ?? "",
				linkedin: editedData.social?.linkedin ?? "",
				twitter: editedData.social?.twitter ?? "",
				[platform]: value,
			},
		});
	};

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Avatar and Basic Info */}
					<div className="flex flex-col items-center md:items-start">
						<div className="relative">
							<Avatar className="h-24 w-24 md:h-32 md:w-32">
								<AvatarImage
									src={user?.avatar || "/placeholder.svg"}
									alt={user?.name || "User"}
								/>
								<AvatarFallback className="text-2xl">
									{user?.name
										? user.name
												.split(" ")
												.map((n) => n[0])
												.join("")
										: "U"}
								</AvatarFallback>
							</Avatar>
							<Button
								size="sm"
								variant="outline"
								className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent">
								<Camera className="h-4 w-4" />
							</Button>
						</div>

						<div className="mt-4 text-center md:text-left">
							<h1 className="text-2xl font-bold text-gray-900">
								{user?.name || "Unknown User"}
							</h1>
							<p className="text-gray-600">@{user?.userName || "unknown"}</p>
							<div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
								<Calendar className="h-4 w-4" />
								<span>
									Joined {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
								</span>
							</div>
						</div>
					</div>

					{/* Profile Details */}
					<div className="flex-1">
						<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
							<div className="space-y-3">
								<p className="text-gray-700 leading-relaxed">
									{user?.bio || "No bio available"}
								</p>

								<div className="flex flex-wrap gap-4 text-sm text-gray-600">
									{user?.email ? (
										<div className="flex items-center gap-1">
											<Mail className="h-4 w-4" />
											<span>{user.email}</span>
										</div>
									) : null}
									{user?.location ? (
										<div className="flex items-center gap-1">
											<MapPin className="h-4 w-4" />
											<span>{user.location}</span>
										</div>
									) : null}
									{user?.website ? (
										<div className="flex items-center gap-1">
											<LinkIcon className="h-4 w-4" />
											<a
												href={
													user.website.startsWith("http")
														? user.website
														: `https://${user.website}`
												}
												className="text-blue-600 hover:underline"
												target="_blank"
												rel="noopener noreferrer">
												{user.website}
											</a>
										</div>
									) : null}
								</div>

								{/* Social Links */}
								<div className="flex gap-3">
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-transparent">
										<Github className="h-4 w-4" />
										GitHub
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-transparent">
										<Linkedin className="h-4 w-4" />
										LinkedIn
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-transparent">
										<Twitter className="h-4 w-4" />
										Twitter
									</Button>
								</div>
							</div>

							<div className="flex gap-2">
								<Dialog open={isEditing} onOpenChange={setIsEditing}>
									<DialogTrigger asChild>
										<Button variant="outline" className="gap-2 bg-transparent">
											<Edit className="h-4 w-4" />
											Edit Profile
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-2xl">
										<DialogHeader>
											<DialogTitle>Edit Profile</DialogTitle>
											<DialogDescription>
												Update your profile information and social links.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label htmlFor="name">Full Name</Label>
													<Input
														id="name"
														value={editedData.name || ""}
														onChange={(e) =>
															setEditedData({
																...editedData,
																name: e.target.value,
															})
														}
													/>
												</div>
												<div>
													<Label htmlFor="location">Location</Label>
													<Input
														id="location"
														value={editedData.location || ""}
														onChange={(e) =>
															setEditedData({
																...editedData,
																location: e.target.value,
															})
														}
													/>
												</div>
											</div>

											<div>
												<Label htmlFor="bio">Bio</Label>
												<Textarea
													id="bio"
													value={editedData.bio || ""}
													onChange={(e) =>
														setEditedData({
															...editedData,
															bio: e.target.value,
														})
													}
													rows={3}
												/>
											</div>

											<div>
												<Label htmlFor="website">Website</Label>
												<Input
													id="website"
													value={editedData.website || ""}
													onChange={(e) =>
														setEditedData({
															...editedData,
															website: e.target.value,
														})
													}
												/>
											</div>

											<div className="grid grid-cols-3 gap-4">
												<div>
													<Label htmlFor="github">GitHub Username</Label>
													<Input
														id="github"
														value={editedData.social?.github || ""}
														onChange={(e) =>
															handleSocialChange("github", e.target.value)
														}
													/>
												</div>
												<div>
													<Label htmlFor="linkedin">LinkedIn Username</Label>
													<Input
														id="linkedin"
														value={editedData.social?.linkedin || ""}
														onChange={(e) =>
															handleSocialChange("linkedin", e.target.value)
														}
													/>
												</div>
												<div>
													<Label htmlFor="twitter">Twitter Username</Label>
													<Input
														id="twitter"
														value={editedData.social?.twitter || ""}
														onChange={(e) =>
															handleSocialChange("twitter", e.target.value)
														}
													/>
												</div>
											</div>

											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													onClick={() => setIsEditing(false)}>
													Cancel
												</Button>
												<Button onClick={() => setIsEditing(false)}>
													Save Changes
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>

								<Button variant="outline" className="gap-2 bg-transparent">
									<Share2 className="h-4 w-4" />
									Share
								</Button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
