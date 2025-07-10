
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
  text: z.string().describe('The text extracted from the captcha image. Should contain only digits and be between 4 to 6 characters long.'),
});
export type ReadCaptchaOutput = z.infer<typeof ReadCaptchaOutputSchema>;

export async function readCaptcha(input: ReadCaptchaInput): Promise<ReadCaptchaOutput> {
  return readCaptchaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'readCaptchaPrompt',
  input: {schema: ReadCaptchaInputSchema},
  output: {schema: ReadCaptchaOutputSchema},
  prompt: `You are an expert OCR (Optical Character Recognition) tool specializing in reading distorted captcha images. Your primary task is to extract the numerical digits from the provided image, ignoring all background noise, distortions, and other non-numeric elements.

The image is a heavily distorted captcha, often at an angle. Focus exclusively on identifying the core sequence of numbers, which are typically between 4 and 6 digits long. Do your absolute best to decipher the correct numbers, even if they are skewed, blurry, or partially obscured.

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
    // Clean up the output to ensure only digits are returned and it's within a reasonable length.
    const cleanedText = output.text.replace(/\D/g, '');

    if (!cleanedText || cleanedText.length < 4 || cleanedText.length > 6) {
      console.warn(`AI returned an unlikely captcha result: "${cleanedText}". The image might be too complex.`);
      // Return a plausible but likely incorrect value to avoid crashing, but the server will reject it.
      // This allows the user to see the incorrect value and refresh.
      return { text: cleanedText || "0000" }
    }

    return { text: cleanedText };
  }
);
