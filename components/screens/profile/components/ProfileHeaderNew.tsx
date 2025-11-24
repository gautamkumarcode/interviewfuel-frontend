"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClusterData } from "@/context/clusterData-context";
import { userServices } from "@/services/userservices/user-services";
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
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileHeaderNewProps {
	user: User;
}

export default function ProfileHeaderNew({ user }: ProfileHeaderNewProps) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [avatarKey, setAvatarKey] = useState(Date.now());
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { refetchUser } = useClusterData();
	const queryClient = useQueryClient();
	const router = useRouter();

	// Helper function to get avatar URL with cache busting
	const getAvatarUrl = () => {
		if (!user?.avatar) return undefined;
		// Add timestamp to bust browser cache
		return `${user.avatar}?t=${avatarKey}`;
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("Image size should be less than 5MB");
			return;
		}

		setIsUploadingAvatar(true);
		try {
			const response = await userServices.uploadAvatar(file);
			console.log("Avatar uploaded successfully:", response);

			// Update avatar key to bust cache
			setAvatarKey(Date.now());

			// Invalidate React Query cache
			await queryClient.invalidateQueries(["userProfile"]);

			// Refresh server-side data
			router.refresh();

			// Also refetch client-side data
			await refetchUser();

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error: any) {
			console.error("Failed to upload avatar:", error);
			const errorMessage =
				error?.response?.data?.message ||
				"Failed to upload avatar. Please try again.";
			alert(errorMessage);
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const handleDeleteAvatar = async () => {
		if (!confirm("Are you sure you want to remove your profile picture?"))
			return;

		setIsUploadingAvatar(true);
		try {
			await userServices.deleteAvatar();

			// Update avatar key to bust cache
			setAvatarKey(Date.now());

			// Invalidate React Query cache
			await queryClient.invalidateQueries(["userProfile"]);

			// Refresh server-side data
			router.refresh();

			// Also refetch client-side data
			await refetchUser();
		} catch (error: any) {
			console.error("Failed to delete avatar:", error);
			const errorMessage =
				error?.response?.data?.message ||
				"Failed to delete avatar. Please try again.";
			alert(errorMessage);
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const handleSaveProfile = async (data: Partial<User>) => {
		try {
			await userServices.updateProfile(data);

			// Invalidate React Query cache
			await queryClient.invalidateQueries(["userProfile"]);

			// Refresh server-side data
			router.refresh();

			// Also refetch client-side data
			await refetchUser();
		} catch (error: any) {
			console.error("Failed to update profile:", error);
			throw error;
		}
	};

	const handleShare = async () => {
		const profileUrl = `${window.location.origin}/users/${user.userName}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: `${user.name}'s Profile`,
					text: `Check out ${user.name}'s profile!`,
					url: profileUrl,
				});
			} catch (error) {
				console.log("Share cancelled");
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(profileUrl);
			alert("Profile link copied to clipboard!");
		}
	};

	return (
		<>
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Avatar and Basic Info */}
						<div className="flex flex-col items-center md:items-start">
							<div className="relative group">
								<Avatar className="h-24 w-24 md:h-32 md:w-32" key={avatarKey}>
									<AvatarImage
										src={getAvatarUrl()}
										alt={user?.name || "User"}
									/>
									<AvatarFallback className="text-2xl">
										{user?.name
											? user.name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase()
											: "U"}
									</AvatarFallback>
								</Avatar>

								{/* Loading Overlay */}
								{isUploadingAvatar && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
										<div className="flex flex-col items-center gap-2">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
											<span className="text-xs text-white">Uploading...</span>
										</div>
									</div>
								)}

								{/* Avatar Actions */}
								{!isUploadingAvatar && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="ghost"
												className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
												onClick={handleAvatarClick}
												disabled={isUploadingAvatar}>
												<Camera className="h-4 w-4" />
											</Button>
											{user?.avatar && (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
													onClick={handleDeleteAvatar}
													disabled={isUploadingAvatar}>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									</div>
								)}

								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleAvatarChange}
								/>
							</div>

							<div className="mt-4 text-center md:text-left">
								<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{user?.name || "Unknown User"}
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									@{user?.userName || "unknown"}
								</p>
								<div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
									<Calendar className="h-4 w-4" />
									<span>
										Joined{" "}
										{user?.createdAt ? formatDate(user.createdAt) : "N/A"}
									</span>
								</div>
							</div>
						</div>

						{/* Profile Details */}
						<div className="flex-1">
							<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
								<div className="space-y-3 flex-1">
									<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
										{user?.bio || "No bio available"}
									</p>

									<div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
										{user?.email && (
											<div className="flex items-center gap-1">
												<Mail className="h-4 w-4" />
												<span>{user.email}</span>
											</div>
										)}
										{user?.location && (
											<div className="flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												<span>{user.location}</span>
											</div>
										)}
										{user?.website && (
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
													{user.website.replace(/^https?:\/\//, "")}
												</a>
											</div>
										)}
									</div>

									{/* Social Links */}
									{(user?.social?.github ||
										user?.social?.linkedin ||
										user?.social?.twitter) && (
										<div className="flex gap-2">
											{user.social.github && (
												<Button
													variant="outline"
													size="sm"
													className="gap-2"
													asChild>
													<a
														href={
															user.social.github.startsWith("http")
																? user.social.github
																: `https://github.com/${user.social.github}`
														}
														target="_blank"
														rel="noopener noreferrer">
														<Github className="h-4 w-4" />
														GitHub
													</a>
												</Button>
											)}
											{user.social.linkedin && (
												<Button
													variant="outline"
													size="sm"
													className="gap-2"
													asChild>
													<a
														href={
															user.social.linkedin.startsWith("http")
																? user.social.linkedin
																: `https://linkedin.com/in/${user.social.linkedin}`
														}
														target="_blank"
														rel="noopener noreferrer">
														<Linkedin className="h-4 w-4" />
														LinkedIn
													</a>
												</Button>
											)}
											{user.social.twitter && (
												<Button
													variant="outline"
													size="sm"
													className="gap-2"
													asChild>
													<a
														href={
															user.social.twitter.startsWith("http")
																? user.social.twitter
																: `https://twitter.com/${user.social.twitter}`
														}
														target="_blank"
														rel="noopener noreferrer">
														<Twitter className="h-4 w-4" />
														Twitter
													</a>
												</Button>
											)}
										</div>
									)}
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="gap-2"
										onClick={() => setIsEditModalOpen(true)}>
										<Edit className="h-4 w-4" />
										Edit Profile
									</Button>

									<Button
										variant="outline"
										className="gap-2"
										onClick={handleShare}>
										<Share2 className="h-4 w-4" />
										Share
									</Button>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<EditProfileModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				user={user}
				onSave={handleSaveProfile}
			/>
		</>
	);
}
