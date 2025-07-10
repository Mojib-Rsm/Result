
import {config} from 'dotenv';
import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Load environment variables from .env file
config();

const plugins: GenkitPlugin[] = [];

// Only add the Google AI plugin if the API key is available.
// This prevents the app from crashing on startup if the key is not configured,
// for example, in a Vercel deployment without the environment variable set.
if (process.env.GOOGLE_API_KEY) {
  try {
    const googleAiPlugin = googleAI({apiKey: process.env.GOOGLE_API_KEY});
    plugins.push(googleAiPlugin);
  } catch (e) {
    console.error('An unexpected error occurred during Google AI plugin initialization:', e);
    // We don't throw an error here to allow the app to run without AI features.
  }
} else {
    console.warn(
      'GOOGLE_API_KEY is not set. AI-powered features will be disabled. Please add the key to your .env file or hosting provider (e.g., Vercel) environment variables.'
    );
}

export const ai = genkit({
  plugins: plugins,
});
