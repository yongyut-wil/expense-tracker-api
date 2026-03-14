import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as https from 'https';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not found in .env');
    return;
  }

  const versions = ['v1', 'v1beta'];
  
  for (const v of versions) {
    console.log(`\n--- Fetching models for ${v} ---`);
    await new Promise((resolve, reject) => {
      https.get(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.models) {
              parsed.models.forEach((m: any) => {
                console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
              });
            } else {
              console.log(`No models found for ${v} or error:`, data);
            }
            resolve(null);
          } catch (e) {
            console.log('Error parsing response:', data);
            resolve(null);
          }
        });
      }).on('error', (err) => {
        console.error('Error:', err);
        resolve(null);
      });
    });
  }
}

listModels();
