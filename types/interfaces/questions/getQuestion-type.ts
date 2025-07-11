// export interface GetAllQuestionsResponseType {
// 	questions: Question[];
// }

export interface GetAllQuestionsResponseType {
	stats: Stats;
	title: string;
	content: string;
	category: Category;
	subcategory?: string;
	difficulty: DifficultyEnum;
	tags: string[];
	companies: Company[];
	richAnswer?: string;
	media: any[];
	bestPractices: any[];
	relatedQuestions: any[];
	timeLimit: number;
	author: Author;
	status: Status;
	isVerified: boolean;
	contributors: any[];
	createdAt: Date;
	updatedAt: Date;
	difficultyScore: number;
	id: string;
}

export interface Author {
	name: string;
	username: string;
	profileUrl: string;
	id: string;
}

export interface Category {
	name: FullPath;
	slug: Slug;
	fullPath: FullPath;
	id: string;
}

export enum FullPath {
	SystemDesiddgn = "System Desiddgn",
	SystemDesign = "System Design",
}

export enum Slug {
	SystemDesiddgn = "system-desiddgn",
	SystemDesign = "system-design",
}

export interface Company {
	name: string;
	frequency: number;
	_id: string;
	id: string;
}

export enum DifficultyEnum {
	Easy = "Easy",
	Hard = "Hard",
	Medium = "Medium",
}

export interface Stats {
	views: number;
	likes: number;
	bookmarks: number;
	attempts: number;
	successRate: number;
}

export enum Status {
	Published = "published",
}
