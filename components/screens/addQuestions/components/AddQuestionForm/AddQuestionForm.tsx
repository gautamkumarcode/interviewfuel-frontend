"use client";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { categoryService } from "@/services/category/categories-services";
import { useQuery } from "react-query";
import { questionSchema } from "../validation/StepsFormSchema";

export type QuestionFormData = z.infer<typeof questionSchema>;

interface AddQuestionFormProps {
  form: any;
  currentStep: number;
  onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function AddQuestionForm({ form, currentStep, onFormDataChange }: AddQuestionFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    ["allcategories"],
    () => categoryService.getAllCategories()
  );

  const categories = categoriesData?.data?.results || [];
  const allCategories = categories.flatMap(cat => [
    { _id: cat._id, name: cat.name },
    ...(cat.subcategories || []).map(sub => ({ _id: sub._id, name: sub.name }))
  ]);

  const { fields: solutionFields, append: appendSolution, remove: removeSolution } = useFieldArray({
    control: form.control,
    name: "solutions",
  });

  const { fields: companyFields, append: appendCompany, remove: removeCompany } = useFieldArray({
    control: form.control,
    name: "companies",
  });

  const { fields: hintFields, append: appendHint, remove: removeHint } = useFieldArray({
    control: form.control,
    name: "hints",
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
      onFormDataChange({ tags: newTags });
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
    onFormDataChange({ tags: newTags });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a clear, concise question title" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ title: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Content *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed context, requirements, and any constraints" 
                      {...field} 
                      className="min-h-[120px]"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ content: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onFormDataChange({ category: value });
                    }}
                    value={field.value}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        onFormDataChange({ difficulty: value as "Easy" | "Medium" | "Hard" });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="30" 
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(value);
                          onFormDataChange({ timeLimit: value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="question-slug-url-friendly" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ slug: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier for this question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Tags *</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      size={14} 
                      className="cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add relevant tags (e.g., javascript, algorithms)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  Add
                </Button>
              </div>
              <FormDescription>
                Press Enter or click Add to add tags. At least one tag is required.
              </FormDescription>
              {form.formState.errors.tags && (
                <p className="text-sm text-red-500">{form.formState.errors.tags.message}</p>
              )}
            </FormItem>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="richAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Answer *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a comprehensive answer with step-by-step explanation, key concepts, and examples" 
                      {...field} 
                      className="min-h-[300px]"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ richAnswer: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a detailed explanation that helps users understand the solution approach, key concepts, and reasoning.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Code Solutions *</h3>
              <Button
                type="button"
                onClick={() => {
                  appendSolution({
                    title: "",
                    language: "javascript",
                    code: "",
                    explanation: "",
                    timeComplexity: "",
                    spaceComplexity: "",
                  });
                  onFormDataChange({ solutions: form.getValues("solutions") });
                }}
                size="sm"
                variant="outline"
              >
                <Plus size={16} className="mr-1" />
                Add Solution
              </Button>
            </div>

            {solutionFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Solution {index + 1}</h4>
                  {solutionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        removeSolution(index);
                        onFormDataChange({ solutions: form.getValues("solutions") });
                      }}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`solutions.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solution Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Two Pointer Approach" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`solutions.${index}.language`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Programming Language *</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              onFormDataChange({ solutions: form.getValues("solutions") });
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="csharp">C#</SelectItem>
                              <SelectItem value="go">Go</SelectItem>
                              <SelectItem value="rust">Rust</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`solutions.${index}.code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your solution code here..." 
                            {...field} 
                            className="font-mono min-h-[200px]"
                            onChange={(e) => {
                              field.onChange(e);
                              onFormDataChange({ solutions: form.getValues("solutions") });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`solutions.${index}.explanation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explanation *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explain how this solution works, the algorithm used, and why it's effective..." 
                            {...field} 
                            className="min-h-[120px]"
                            onChange={(e) => {
                              field.onChange(e);
                              onFormDataChange({ solutions: form.getValues("solutions") });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`solutions.${index}.timeComplexity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Complexity</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., O(n)" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`solutions.${index}.spaceComplexity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Space Complexity</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., O(1)" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Companies */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Companies (Optional)</h3>
                <Button
                  type="button"
                  onClick={() => {
                    appendCompany({ name: "", frequency: 1 });
                    onFormDataChange({ companies: form.getValues("companies") });
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Company
                </Button>
              </div>

              {companyFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end mb-4">
                  <FormField
                    control={form.control}
                    name={`companies.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Google, Microsoft" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onFormDataChange({ companies: form.getValues("companies") });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`companies.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10" 
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange(value);
                              onFormDataChange({ companies: form.getValues("companies") });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeCompany(index);
                      onFormDataChange({ companies: form.getValues("companies") });
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Hints */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Hints (Optional)</h3>
                <Button
                  type="button"
                  onClick={() => {
                    appendHint({ order: hintFields.length + 1, content: "" });
                    onFormDataChange({ hints: form.getValues("hints") });
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Hint
                </Button>
              </div>

              {hintFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start mb-4">
                  <div className="w-16 pt-8">
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`hints.${index}.content`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Hint Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a helpful hint that guides users toward the solution..." 
                            {...field} 
                            className="min-h-[80px]"
                            onChange={(e) => {
                              field.onChange(e);
                              onFormDataChange({ hints: form.getValues("hints") });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeHint(index);
                      onFormDataChange({ hints: form.getValues("hints") });
                    }}
                    className="mt-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CardContent className="pt-6">
      {renderStepContent()}
    </CardContent>
  );
}
