// src/services/aiService.js
import { fallbackMessages } from './fallbackMessages.js';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY


export async function getAiMessage(prompt) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are a supportive mental health companion." },
            { role: "user", content: prompt }
          ]
        })
      }
    );

    // 🔍 DEBUG: check HTTP status
    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP Error:", response.status, errorText);
      throw new Error("API request failed");
    }

    const result = await response.json();
    console.log("RAW AI RESPONSE:", result); // 🔍 DEBUG

    if (result.choices?.[0]?.message?.content) {
      return result.choices[0].message.content;
    }

    throw new Error("Invalid AI response format");

  } catch (error) {
    console.warn("AI API failed, using fallback:", error.message);

    return fallbackMessages[
      Math.floor(Math.random() * fallbackMessages.length)
    ];
  }
}
