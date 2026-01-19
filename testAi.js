import { getAiMessage } from './src/services/aiService.js';

async function test() {
  const message = await getAiMessage("I feel tired and stressed");
  console.log("AI Response:", message);
}

test();
