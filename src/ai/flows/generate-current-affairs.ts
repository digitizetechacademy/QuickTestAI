
'use server';

/**
 * @fileOverview Generates a summary of current affairs for a given month and year.
 *
 * - generateCurrentAffairs - A function that generates current affairs summaries.
 * - GenerateCurrentAffairsInput - The input type for the function.
 * - GenerateCurrentAffairsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCurrentAffairsInputSchema = z.object({
  month: z.string().describe('The month for which to generate current affairs (e.g., "August").'),
  year: z.number().describe('The year for which to generate current affairs (e.g., 2024).'),
});
export type GenerateCurrentAffairsInput = z.infer<typeof GenerateCurrentAffairsInputSchema>;

const GenerateCurrentAffairsOutputSchema = z.object({
  summaries: z.array(
    z.object({
      title: z.string().describe('The headline of the event.'),
      details: z.string().describe('A brief summary of the event.'),
      category: z.string().describe('The category of the event (e.g., Politics, Technology, Sports).'),
    })
  ).describe('An array of 5 major current affairs summaries for the given month and year, covering national and international events relevant to India.'),
});
export type GenerateCurrentAffairsOutput = z.infer<typeof GenerateCurrentAffairsOutputSchema>;

export async function generateCurrentAffairs(input: GenerateCurrentAffairsInput): Promise<GenerateCurrentAffairsOutput> {
  return generateCurrentAffairsFlow(input);
}

const generateCurrentAffairsPrompt = ai.definePrompt({
  name: 'generateCurrentAffairsPrompt',
  input: {schema: GenerateCurrentAffairsInputSchema},
  output: {schema: GenerateCurrentAffairsOutputSchema},
  prompt: `You are a world-class news analyst. Generate a summary of the top 5 most significant national and international current events for {{{month}}} {{{year}}}.

Focus on events that are most relevant to a general audience in India. For each event, provide a concise title, a brief summary (details), and a category.
`,
});

const generateCurrentAffairsFlow = ai.defineFlow(
  {
    name: 'generateCurrentAffairsFlow',
    inputSchema: GenerateCurrentAffairsInputSchema,
    outputSchema: GenerateCurrentAffairsOutputSchema,
  },
  async input => {
    const {output} = await generateCurrentAffairsPrompt(input);
    return output!;
  }
);
