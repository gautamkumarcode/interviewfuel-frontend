import { CustomButton } from "@/components/custom/CustomButton/CustomButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme.context";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminSchema } from "./validation/adminSchema";

type adminQuestionsData = z.infer<typeof adminSchema>;

const AdminQuestions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useTheme();

  const form = useForm<adminQuestionsData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      category: "",
      description: "",
      tag: "",
      parentCategory: "",
      order: "",
    },
  });

  const onSubmit = async (data: adminQuestionsData) => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        console.log("Admin questions data : ", data);
        toast.success("Submit sucessfully");
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Enter Question category"
                      type="text"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discription</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Enter your discription"
                      type="text"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tag"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Enter your Tags"
                      type="text"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="parentCategory"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ParentCategory</FormLabel>
                <FormControl>
                  <div>
                    <select
                      {...field}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="">Select a parent category</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="order"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Questions order</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Enter a number for question order"
                      type="string"
                      {...field}
                      min={1}
                      max={10}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomButton
            content="Add question"
            isLoading={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          />
        </form>
      </Form>
    </div>
  );
};

export default AdminQuestions;
