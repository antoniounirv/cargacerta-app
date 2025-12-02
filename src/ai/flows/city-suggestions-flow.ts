'use server';
/**
 * @fileOverview Provides city suggestions for autocomplete fields.
 *
 * - getCitySuggestions - A function that returns a list of city suggestions based on a query.
 * - CitySuggestionsInput - The input type for the underlying flow.
 * - CitySuggestionsOutput - The return type for the underlying flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CitySuggestionsInputSchema = z.object({
  query: z.string().describe('The partial city name to search for.'),
});
export type CitySuggestionsInput = z.infer<typeof CitySuggestionsInputSchema>;

const CitySuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of city suggestions in the format "City, State Abbreviation", e.g., "São Paulo, SP".'),
});
export type CitySuggestionsOutput = z.infer<typeof CitySuggestionsOutputSchema>;

export async function getCitySuggestions(query: string): Promise<CitySuggestionsOutput> {
    return citySuggestionsFlow({ query });
}

const prompt = ai.definePrompt({
  name: 'citySuggestionsPrompt',
  input: {schema: CitySuggestionsInputSchema},
  output: {schema: CitySuggestionsOutputSchema},
  prompt: `You are a Brazilian geolocation expert. Given a search query, provide a list of up to 5 matching Brazilian city names.
  
  The user is typing in a search field and wants relevant suggestions.
  
  Return the suggestions as a list of strings, with each string formatted as "City Name, State Abbreviation". For example: "São Paulo, SP".

  Query: {{{query}}}`,
});

const citySuggestionsFlow = ai.defineFlow(
  {
    name: 'citySuggestionsFlow',
    inputSchema: CitySuggestionsInputSchema,
    outputSchema: CitySuggestionsOutputSchema,
  },
  async input => {
    if (!input.query) {
      return { suggestions: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
