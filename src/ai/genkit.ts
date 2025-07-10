import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let googleAiPlugin;

try {
  googleAiPlugin = googleAI();
} catch (e) {
  if (e instanceof Error && e.message.includes('GOOGLE_API_KEY')) {
    console.error(
      'GOOGLE_API_KEY is not set in environment variables. Please add it to your .env file or Vercel environment variables.'
    );
    // Provide a more user-friendly error for the developer
    throw new Error(
      'Google AI API key is missing. Please ensure GOOGLE_API_KEY is set in your environment variables.'
    );
  }
  // Re-throw other errors
  throw e;
}


export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-2.0-flash',
});
