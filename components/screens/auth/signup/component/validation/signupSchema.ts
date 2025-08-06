import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  username: z.string().min(3, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  // role: z.enum(["user", "admin"]),
});

export type SignupFormData = z.infer<typeof signupSchema>;
