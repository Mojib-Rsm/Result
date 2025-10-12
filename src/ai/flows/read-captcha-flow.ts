
'use server';
/**
 * @fileOverview A flow for reading CAPTCHA images using AI.
 *
 * - readCaptcha - A function that reads the text from a CAPTCHA image.
 * - ReadCaptchaInput - The input type for the readCaptcha function.
 * - ReadCaptchaOutput - The return type for the readCaptcha function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReadCaptchaInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a CAPTCHA, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReadCaptchaInput = z.infer<typeof ReadCaptchaInputSchema>;

const ReadCaptchaOutputSchema = z.object({
    captchaText: z.string().describe('The numbers read from the CAPTCHA image.'),
});
export type ReadCaptchaOutput = z.infer<typeof ReadCaptchaOutputSchema>;


export async function readCaptcha(input: ReadCaptchaInput): Promise<ReadCaptchaOutput> {
  return readCaptchaFlow(input);
}


const prompt = ai.definePrompt({
  name: 'readCaptchaPrompt',
  model: 'googleai/gemini-2.5-pro-preview',
  input: { schema: ReadCaptchaInputSchema },
  output: { schema: ReadCaptchaOutputSchema },
  prompt: `You are an expert at reading CAPTCHAs. Extract the numbers from the provided image. Only return the numbers.

  Photo: {{media url=photoDataUri}}`,
});

const readCaptchaFlow = ai.defineFlow(
  {
    name: 'readCaptchaFlow',
    inputSchema: ReadCaptchaInputSchema,
    outputSchema: ReadCaptchaOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
