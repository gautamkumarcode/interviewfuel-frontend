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
  const {toast} = useTheme();

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
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Add New Question</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{STEPS[currentStep - 1].title}</h3>
            <p className="text-gray-600">{STEPS[currentStep - 1].description}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full">
            {/* Step Content */}
            <div>
              <AddQuestionForm 
                form={form}
                currentStep={currentStep}
                onFormDataChange={handleFormDataChange}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>

              <div>
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || createQuestionMutation.isLoading}
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      console.log('Submit button clicked');
                      console.log('Form values:', form.getValues());
                      console.log('Form errors:', form.formState.errors);
                    }}
                  >
                    {form.formState.isSubmitting || createQuestionMutation.isLoading ? "Submitting..." : "Submit Question"}
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
