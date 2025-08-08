"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { AddQuestionForm } from "./components/AddQuestionForm/AddQuestionForm";
import { questionSchema } from "./components/validation/StepsFormSchema";
import { questionService } from "@/services/questions/question-services";
import { useMutation } from "react-query";
import { useTheme } from "@/context/theme.context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type QuestionFormData = z.infer<typeof questionSchema>;

const STEPS = [
  { id: 1, title: "Basic Info", description: "Question title, content and category" },
  { id: 2, title: "Details", description: "Tags, difficulty and time limit" },
  { id: 3, title: "Answer", description: "Detailed answer explanation" },
  { id: 4, title: "Solutions", description: "Code solutions and explanations" },
  { id: 5, title: "Additional", description: "Companies, hints and best practices" },
];

const AddQuestion = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionFormData>>({});
  const router = useRouter();
  const { toast } = useTheme();

  const { data: session } = useSession();

  // Create question mutation
  const createQuestionMutation = useMutation(
    (data: QuestionFormData) => {
      console.log('Mutation function called with data:', data);
      return questionService.createQuestion(data);
    },
    {
      onSuccess: (response) => {
        console.log('Mutation success:', response);
        toast.success("Question created successfully!");
        router.push("/questions");
      },
      onError: (error: any) => {
        console.error('Mutation error:', error);
        toast.error(error?.response?.data?.message || "Failed to create question");
      },
    }
  );

  const form = useForm({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      category: "",
      difficulty: "Medium",
      tags: [],
      companies: [],
      richAnswer: "",
      media: [],
      solutions: [
        {
          title: "",
          language: "javascript",
          code: "",
          explanation: "",
          timeComplexity: "",
          spaceComplexity: "",
        },
      ],
      hints: [],
      bestPractices: [],
      relatedQuestions: [],
      timeLimit: 30,
      status: "published",
      isVerified: false,
      slug: "",
      author: "",
    },
  });



  const handleFormDataChange = (data: Partial<QuestionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate: (keyof QuestionFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate.push("title", "content", "category");
        break;
      case 2:
        fieldsToValidate.push("difficulty", "tags", "timeLimit", "slug");
        break;
      case 3:
        fieldsToValidate.push("richAnswer");
        break;
      case 4:
        fieldsToValidate.push("solutions");
        break;
      case 5:
        // Optional fields, no validation needed
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    try {
      console.log('Form data before submission:', data);

      // Add author field from session
      const questionData = {
        ...data,
        author: session?.user?.id || "anonymous",
        status: data.status || "published",
      };

      console.log('Submitting question data:', questionData);

      // Use the mutation to submit data
      createQuestionMutation.mutate(questionData);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit question");
    }
  };

  const onCancel = () => {
    router.push("/questions");
  };

  const progress = (currentStep / STEPS.length) * 100;
  return (
    <div className="max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-950">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add New Question
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create a comprehensive interview question with detailed solutions and explanations
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Progress value={progress} className="h-3 rounded-full" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-fit">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step Content */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <AddQuestionForm
                form={form}
                currentStep={currentStep}
                onFormDataChange={handleFormDataChange}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 -mx-2">
              {/* Left Section - Previous, Cancel, Submit */}
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                    className="flex items-center gap-2 px-6"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  size="lg"
                  className="px-6"
                >
                  Cancel
                </Button>

                {currentStep === STEPS.length && (
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || createQuestionMutation.isLoading}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    onClick={() => {
                      console.log('Submit button clicked');
                      console.log('Form values:', form.getValues());
                      console.log('Form errors:', form.formState.errors);
                    }}
                  >
                    {form.formState.isSubmitting || createQuestionMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Question"
                    )}
                  </Button>
                )}
              </div>

              {/* Right Section - Next */}
              <div className="flex items-center gap-2">
                {currentStep < STEPS.length && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    size="lg"
                    className="flex items-center gap-2 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    Next
                    <ChevronRight size={18} />
                  </Button>
                )}
              </div>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddQuestion
