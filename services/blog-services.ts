import { API_ENDPOINTS } from "@/constants/api";
import {
	AxiosResponseTypeWithoutPagination
} from "@/types/axios-response";
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";

export interface BlogPost {
	_id: string;
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	coverImage?: string;
	author: {
		_id: string;
		username: string;
		fullName: string;
		profilePicture?: string;
		bio?: string;
	};
	category?: {
		_id: string;
		name: string;
		slug: string;
	};
	tags: string[];
	relatedQuestions?: Array<{
		_id: string;
		title: string;
		difficulty: string;
		slug: string;
	}>;
	status: "draft" | "published" | "archived";
	publishedAt?: string;
	views: number;
	readTime: number;
	stats: {
		likes: number;
		comments: number;
		bookmarks: number;
	};
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
		keywords?: string[];
	};
	featured: boolean;
	isPinned: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface BlogListResponse {
	success: boolean;
	data: {
		blogs: BlogPost[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};
}

export interface BlogFilters {
	page?: number;
	limit?: number;
	status?: string;
	category?: string;
	tag?: string;
	author?: string;
	search?: string;
	featured?: boolean;
	sort?: string;
}

export interface CreateBlogData {
	title: string;
	slug?: string;
	excerpt?: string;
	content: string;
	coverImage?: string;
	category?: string;
	tags?: string[];
	relatedQuestions?: string[];
	status?: "draft" | "published";
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
		keywords?: string[];
	};
}

class BlogService {
	// Get all blogs with filters
	public getAllBlogs = async (
		filters: BlogFilters = {}
	): Promise<BlogListResponse> => {
		const { data } = await unauthenticatedInstance.get<BlogListResponse>(
			API_ENDPOINTS.BLOGS,
			{
				params: filters,
			}
		);
		return data;
	};

	// Get a single blog by slug
	public getBlogBySlug = async (
		slug: string
	): Promise<AxiosResponseTypeWithoutPagination<{ blog: BlogPost }>> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{ blog: BlogPost }>
		>(`${API_ENDPOINTS.BLOGS}/slug/${slug}`);
		return data;
	};

	// Get featured blogs
	public getFeaturedBlogs = async (
		limit: number = 5
	): Promise<AxiosResponseTypeWithoutPagination<BlogPost[]>> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<BlogPost[]>
		>(`${API_ENDPOINTS.BLOGS}/featured`, {
			params: { limit },
		});
		return data;
	};

	// Get user's blogs
	public getUserBlogs = async (
		userId: string,
		filters: BlogFilters = {}
	): Promise<BlogListResponse> => {
		const { data } = await unauthenticatedInstance.get<BlogListResponse>(
			`${API_ENDPOINTS.BLOGS}/user/${userId}`,
			{
				params: filters,
			}
		);
		return data;
	};

	// Create a new blog
	public createBlog = async (
		payload: CreateBlogData
	): Promise<AxiosResponseTypeWithoutPagination<BlogPost>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<BlogPost>
		>(API_ENDPOINTS.BLOGS, payload);
		return data;
	};

	// Update a blog
	public updateBlog = async (
		id: string,
		payload: Partial<CreateBlogData>
	): Promise<AxiosResponseTypeWithoutPagination<BlogPost>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<BlogPost>
		>(`${API_ENDPOINTS.BLOGS}/${id}`, payload);
		return data;
	};

	// Delete a blog
	public deleteBlog = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<null>> => {
		const { data } = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<null>
		>(`${API_ENDPOINTS.BLOGS}/${id}`);
		return data;
	};

	// Like/Unlike a blog
	public likeBlog = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<{ liked: boolean }>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ liked: boolean }>
		>(`${API_ENDPOINTS.BLOGS}/${id}/like`);
		return data;
	};

	// Bookmark/Unbookmark a blog
	public bookmarkBlog = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<{ bookmarked: boolean }>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ bookmarked: boolean }>
		>(`${API_ENDPOINTS.BLOGS}/${id}/bookmark`);
		return data;
	};
}

const blogService = new BlogService();
export default blogService;
