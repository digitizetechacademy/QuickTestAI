
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mcq-quiz.ts';
import '@/ai/flows/generate-explanation.ts';
import '@/ai/flows/generate-current-affairs.ts';
import '@/ai/flows/generate-exam-result.ts';
