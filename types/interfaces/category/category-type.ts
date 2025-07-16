
export interface GetCategoriesResponseType {
	_id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	color: string;
	parentCategory: string;
	subcategories: Subcategory[];
	tags: any[];
	stats: Stats;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface Subcategory {
	_id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	color: string;
	parentCategory: string;
	tags: string[];
	stats: Stats;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	subcategories: any[];
}

export interface Stats {
    questionCount:     number;
    totalViews:        number;
    averageDifficulty: number;
}
