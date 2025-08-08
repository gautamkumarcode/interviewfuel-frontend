"use client";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Code, Building, Lightbulb } from "lucide-react";
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
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    Question Title
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a clear, concise question title"
                      {...field}
                      className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ title: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                  Make it specific and searchable (e.g., &quot;Two Sum Algorithm Implementation&quot;)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    Question Content
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed context, requirements, and any constraints. Include examples if helpful."
                      {...field}
                      className="min-h-[140px] text-base border-2 focus:border-primary/50 transition-colors resize-none"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ content: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Be comprehensive but concise. Include input/output examples where applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    Category
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onFormDataChange({ category: value });
                    }}
                    value={field.value}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 text-base border-2 focus:border-primary/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id} className="text-base">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm text-muted-foreground">
                    Choose the most relevant category for better discoverability
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        );

      case 2:
        return (
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      Difficulty Level
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        onFormDataChange({ difficulty: value as "Easy" | "Medium" | "Hard" });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base border-2 focus:border-primary/50">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy" className="text-base">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Easy
                          </div>
                        </SelectItem>
                        <SelectItem value="Medium" className="text-base">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="Hard" className="text-base">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            Hard
                          </div>
                        </SelectItem>
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
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      Time Limit (minutes)
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(value);
                          onFormDataChange({ timeLimit: value });
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      Recommended time for solving this question
                    </FormDescription>
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
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    URL Slug
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="question-slug-url-friendly"
                      {...field}
                      className="h-11 text-base border-2 focus:border-primary/50 transition-colors font-mono"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ slug: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    URL-friendly identifier for this question (lowercase, hyphens only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                Tags
                <span className="text-red-500">*</span>
              </FormLabel>
              <div className="space-y-3">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                        {tag}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <Input
                    placeholder="Add relevant tags (e.g., javascript, algorithms, data-structures)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="lg"
                    variant="outline"
                    className="px-6 whitespace-nowrap"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Tag
                  </Button>
                </div>
                <FormDescription className="text-sm text-muted-foreground">
                  Press Enter or click &quot;Add Tag&quot; to add tags. At least one tag is required for better categorization.
                </FormDescription>
                {form.formState.errors.tags && (
                  <p className="text-sm text-red-500">{form.formState.errors.tags.message}</p>
                )}
              </div>
            </FormItem>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">


            <FormField
              control={form.control}
              name="richAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    Detailed Answer
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a comprehensive answer with step-by-step explanation, key concepts, and examples. Include:&#10;• Problem analysis&#10;• Solution approach&#10;• Key algorithms or data structures used&#10;• Time and space complexity discussion&#10;• Edge cases to consider&#10;• Alternative approaches (if any)"
                      {...field}
                      className="min-h-[400px] text-base border-2 focus:border-primary/50 transition-colors resize-none leading-relaxed"
                      onChange={(e) => {
                        field.onChange(e);
                        onFormDataChange({ richAnswer: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Write a detailed explanation that helps users understand the solution approach, key concepts, and reasoning. Use clear formatting and examples.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
           

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Code Solutions</h3>
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
                size="lg"
                variant="outline"
                className="px-6"
              >
                <Plus size={16} className="mr-2" />
                Add Solution
              </Button>
            </div>

            <div className="space-y-6">
              {solutionFields.map((field, index) => (
                <Card key={field.id} className="border-2 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        Solution {index + 1}
                      </CardTitle>
                      {solutionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            removeSolution(index);
                            onFormDataChange({ solutions: form.getValues("solutions") });
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`solutions.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              Solution Title
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Two Pointer Approach, Optimized Solution"
                                {...field}
                                className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
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
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              Programming Language
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 text-base border-2 focus:border-primary/50">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="javascript" className="text-base">JavaScript</SelectItem>
                                <SelectItem value="python" className="text-base">Python</SelectItem>
                                <SelectItem value="java" className="text-base">Java</SelectItem>
                                <SelectItem value="cpp" className="text-base">C++</SelectItem>
                                <SelectItem value="csharp" className="text-base">C#</SelectItem>
                                <SelectItem value="go" className="text-base">Go</SelectItem>
                                <SelectItem value="rust" className="text-base">Rust</SelectItem>
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
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            Code
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your solution code here..."
                              {...field}
                              className="font-mono min-h-[250px] text-sm border-2 focus:border-primary/50 transition-colors resize-none leading-relaxed bg-gray-50 dark:bg-gray-900/50"
                              onChange={(e) => {
                                field.onChange(e);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-muted-foreground">
                            Provide clean, well-commented code that solves the problem
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`solutions.${index}.explanation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            Solution Explanation
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain how this solution works, the algorithm used, and why it's effective..."
                              {...field}
                              className="min-h-[140px] text-base border-2 focus:border-primary/50 transition-colors resize-none leading-relaxed"
                              onChange={(e) => {
                                field.onChange(e);
                                onFormDataChange({ solutions: form.getValues("solutions") });
                              }}
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-muted-foreground">
                            Describe the approach, key insights, and step-by-step logic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`solutions.${index}.timeComplexity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Time Complexity</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., O(n), O(log n)"
                                {...field}
                                className="h-11 text-base border-2 focus:border-primary/50 transition-colors font-mono"
                                onChange={(e) => {
                                  field.onChange(e);
                                  onFormDataChange({ solutions: form.getValues("solutions") });
                                }}
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-muted-foreground">
                              Big O notation for time complexity
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`solutions.${index}.spaceComplexity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Space Complexity</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., O(1), O(n)"
                                {...field}
                                className="h-11 text-base border-2 focus:border-primary/50 transition-colors font-mono"
                                onChange={(e) => {
                                  field.onChange(e);
                                  onFormDataChange({ solutions: form.getValues("solutions") });
                                }}
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-muted-foreground">
                              Big O notation for space complexity
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">


            {/* Companies Section */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Companies (Optional)
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => {
                      appendCompany({ name: "", frequency: 1 });
                      onFormDataChange({ companies: form.getValues("companies") });
                    }}
                    size="lg"
                    variant="outline"
                    className="px-6"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Company
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Specify companies that frequently ask this question in interviews
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No companies added yet. Click &quot;Add Company&quot; to get started.</p>
                  </div>
                ) : (
                  companyFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                      <div className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`companies.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-base font-medium">Company Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Google, Microsoft, Amazon"
                                  {...field}
                                  className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
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
                            <FormItem className="w-32">
                              <FormLabel className="text-base font-medium">Frequency</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  {...field}
                                  className="h-11 text-base border-2 focus:border-primary/50 transition-colors"
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    field.onChange(value);
                                    onFormDataChange({ companies: form.getValues("companies") });
                                  }}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">1-10 scale</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="lg"
                          onClick={() => {
                            removeCompany(index);
                            onFormDataChange({ companies: form.getValues("companies") });
                          }}
                          className="h-11 w-11 p-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Hints Section */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Hints (Optional)
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => {
                      appendHint({ order: hintFields.length + 1, content: "" });
                      onFormDataChange({ hints: form.getValues("hints") });
                    }}
                    size="lg"
                    variant="outline"
                    className="px-6"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Hint
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Provide progressive hints to help users solve the problem step by step
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {hintFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hints added yet. Click &quot;Add Hint&quot; to provide helpful guidance.</p>
                  </div>
                ) : (
                  hintFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mt-2">
                          <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                        </div>

                        <FormField
                          control={form.control}
                          name={`hints.${index}.content`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-base font-medium">Hint Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Provide a helpful hint that guides users toward the solution without giving it away..."
                                  {...field}
                                  className="min-h-[100px] text-base border-2 focus:border-primary/50 transition-colors resize-none leading-relaxed"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    onFormDataChange({ hints: form.getValues("hints") });
                                  }}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-muted-foreground">
                                Make hints progressive - each should reveal a little more without spoiling the solution
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="lg"
                          onClick={() => {
                            removeHint(index);
                            onFormDataChange({ hints: form.getValues("hints") });
                          }}
                          className="h-11 w-11 p-0 mt-8"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {renderStepContent()}
    </div>
  );
}
