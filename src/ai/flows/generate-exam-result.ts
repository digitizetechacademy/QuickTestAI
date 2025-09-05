'use server';

/**
 * @fileOverview Generates exam results and cut-off marks for a given exam.
 *
 * - generateExamResult - A function that fetches exam result details.
 * - GenerateExamResultInput - The input type for the function.
 * - GenerateExamResultOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExamResultInputSchema = z.object({
  examName: z.string().describe('The full name of the examination, including year and tier if applicable (e.g., "UPSC Civil Services 2023 Final Result", "SSC CGL 2024 Tier 1").'),
});
export type GenerateExamResultInput = z.infer<typeof GenerateExamResultInputSchema>;

const GenerateExamResultOutputSchema = z.object({
  resultSummary: z.string().describe('A summary of the result status (e.g., "Declared on 15th August 2024", "Not yet declared", "Expected in October 2024").'),
  cutoffMarks: z.array(z.object({
    category: z.string().describe('The category for the cutoff mark (e.g., "General", "OBC", "SC", "ST", "EWS").'),
    marks: z.string().describe('The cutoff marks for that category.'),
  })).describe('An array of cutoff marks for different categories.'),
  officialLink: z.string().describe('A direct URL to the official website or PDF where the result can be found. Provide a google.com search link if the direct link is not available.'),
});
export type GenerateExamResultOutput = z.infer<typeof GenerateExamResultOutputSchema>;

export async function generateExamResult(input: GenerateExamResultInput): Promise<GenerateExamResultOutput> {
  return generateExamResultFlow(input);
}

const generateExamResultPrompt = ai.definePrompt({
  name: 'generateExamResultPrompt',
  input: {schema: GenerateExamResultInputSchema},
  output: {schema: GenerateExamResultOutputSchema},
  prompt: `You are an expert assistant for government job aspirants in India. Your task is to find the latest and most accurate information about exam results and cutoff marks.

For the exam: {{{examName}}}

1.  Search the web to find the most recent result status.
2.  Find the official category-wise cutoff marks (General, OBC, SC, ST, EWS, etc.). If marks vary by post, provide the range or a summary.
3.  Provide a direct URL to the official results page or PDF. If a direct link isn't available, provide a Google search URL that will lead the user to the right page.

Provide a concise and accurate summary.
`,
});

const generateExamResultFlow = ai.defineFlow(
  {
    name: 'generateExamResultFlow',
    inputSchema: GenerateExamResultInputSchema,
    outputSchema: GenerateExamResultOutputSchema,
  },
  async input => {
    const {output} = await generateExamResultPrompt(input);
    return output!;
  }
);
