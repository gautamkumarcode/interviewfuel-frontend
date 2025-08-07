import { z } from "zod";

export const adminSchema = z.object({
    category: z.string().min(4, { message: "Name must be atleast 6 characters" }),
    description: z.string().min(20, { message: "Discription must be at least 20 characters" }),
    tag: z.string().min(3, { message: "must be 3 characters" }),
    parentCategory: z.string().min(1, { message: "must be select a category" }),
    order: z.string().min(1, { message: "must be a order" })
});
export type adminQuestionsData = z.infer<typeof adminSchema>