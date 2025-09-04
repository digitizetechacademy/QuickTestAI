// src/ai/flows/generate-mcq-quiz.ts
'use server';

/**
 * @fileOverview Generates a multiple-choice quiz on a given topic.
 *
 * - generateMCQQuiz - A function that generates a multiple-choice quiz.
 * - GenerateMCQQuizInput - The input type for the generateMCQQuiz function.
 * - GenerateMCQQuizOutput - The return type for the generateMCQQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMCQQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty of the quiz.'),
});
export type GenerateMCQQuizInput = z.infer<typeof GenerateMCQQuizInputSchema>;

const GenerateMCQQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('The multiple-choice options.'),
      correctAnswerIndex: z
        .number()
        .int()
        .min(0)
        .max(3)
        .describe('The index of the correct answer in the options array.'),
      explanation: z.string().describe('Explanation of the correct answer.'),
    })
  ).describe('An array of multiple-choice questions.'),
});
export type GenerateMCQQuizOutput = z.infer<typeof GenerateMCQQuizOutputSchema>;

export async function generateMCQQuiz(input: GenerateMCQQuizInput): Promise<GenerateMCQQuizOutput> {
  return generateMCQQuizFlow(input);
}

const generateMCQQuizPrompt = ai.definePrompt({
  name: 'generateMCQQuizPrompt',
  input: {schema: GenerateMCQQuizInputSchema},
  output: {schema: GenerateMCQQuizOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with 5 multiple-choice questions on the topic: {{{topic}}}.

The difficulty of the quiz should be {{{difficulty}}}.

Each question should have four options, and you should indicate the index of the correct answer (0, 1, 2, or 3).
Also, provide a brief explanation for each correct answer.

Your output should be a JSON object with a "questions" array. Each object in the array must have "question", "options" (an array of four strings), "correctAnswerIndex", and "explanation" keys.
`,
});

const generateMCQQuizFlow = ai.defineFlow(
  {
    name: 'generateMCQQuizFlow',
    inputSchema: GenerateMCQQuizInputSchema,
    outputSchema: GenerateMCQQuizOutputSchema,
  },
  async input => {
    const {output} = await generateMCQQuizPrompt(input);
    return output!;
  }
);
