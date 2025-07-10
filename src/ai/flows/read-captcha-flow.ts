
'use server';
/**
 * @fileOverview An AI flow to read text from a captcha image.
 *
 * - readCaptcha - A function that handles reading text from an image.
 * - ReadCaptchaInput - The input type for the readCaptcha function.
 * - ReadCaptchaOutput - The return type for the readCaptcha function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReadCaptchaInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a captcha, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReadCaptchaInput = z.infer<typeof ReadCaptchaInputSchema>;

const ReadCaptchaOutputSchema = z.object({
  text: z.string().describe('The text extracted from the captcha image. Should contain only digits.'),
});
export type ReadCaptchaOutput = z.infer<typeof ReadCaptchaOutputSchema>;

export async function readCaptcha(input: ReadCaptchaInput): Promise<ReadCaptchaOutput> {
  return readCaptchaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'readCaptchaPrompt',
  input: {schema: ReadCaptchaInputSchema},
  output: {schema: ReadCaptchaOutputSchema},
  prompt: `You are an expert OCR (Optical Character Recognition) tool. Your task is to extract the numerical digits from the provided image. The image is a captcha. Read the numbers from the image and provide them as plain text.

The image might be noisy or distorted. Do your best to identify the numbers correctly. The output should only contain the digits you see in the image.

Image: {{media url=photoDataUri}}`,
});

const readCaptchaFlow = ai.defineFlow(
  {
    name: 'readCaptchaFlow',
    inputSchema: ReadCaptchaInputSchema,
    outputSchema: ReadCaptchaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.text) {
      throw new Error("AI could not read the security code from the image.");
    }
    // Clean up the output to ensure only digits are returned
    const cleanedText = output.text.replace(/\D/g, '');

    if (!cleanedText) {
      throw new Error("AI failed to extract any digits from the security code image.");
    }

    return { text: cleanedText };
  }
);
