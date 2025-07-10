import {config} from 'dotenv';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Load environment variables from .env file
config();

let googleAiPlugin;

try {
  // Pass the API key directly to the plugin constructor
  // It will be undefined if not set, and the plugin will handle it gracefully.
  googleAiPlugin = googleAI({apiKey: process.env.GOOGLE_API_KEY});
} catch (e) {
  // This catch block might be redundant now but is kept for safety.
  console.error('An unexpected error occurred during Google AI plugin initialization:', e);
  throw new Error('Failed to initialize Google AI services.');
}

export const ai = genkit({
  plugins: [googleAiPlugin],
});

// Add a check to ensure the API key is present, providing a clear developer message if not.
if (!process.env.GOOGLE_API_KEY) {
  console.error(
    'GOOGLE_API_KEY is not set in environment variables. Please add it to your .env file or hosting provider (e.g., Vercel) environment variables.'
  );
}
