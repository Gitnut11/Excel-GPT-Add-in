const key = YOUR_GEMINI_KEY;

/**
 * @customfunction
 * @param {string} text Text to summarize.
 * @param {string} [format] Optional format prompt, e.g., "bullet points"
 * @param {number} [temperature] Optional temperature between 0 and 1
 * @param {string} [model] Optional model name, e.g., "gemini-2.0-flash"
 * @returns {Promise<string>}
 */
async function GPT_SUMMARIZE(text, format, temperature, model) {
  try {
    const defaultModel = "gemini-2.0-flash-lite";
    const defaultFormat = "a single paragraph";
    const defaultTemp = 0.7;

    const modelList = [
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemma-3-27b-it",
      "gemma-2-27b-it",
    ];

    const safeModel = modelList.includes(model) ? model : defaultModel;
    const safeFormat = format?.trim() || defaultFormat;
    const safeTemp = typeof temperature === "number" ? temperature : defaultTemp;

    if (!text || text.toString().trim() === "") return "";

    const prompt = `
Instruction: Be brief, no intro or explanation.
Format: ${safeFormat}
Text: ${text}
    `;

    const result = await callGemini(prompt, safeModel, safeTemp);
    return result || "No response";
  } catch (e) {
    console.error("GPT_SUMMARIZE error", e);
    return "Error: " + e.message;
  }
}
CustomFunctions.associate("GPT_SUMMARIZE", GPT_SUMMARIZE);

async function callGemini(prompt, model, temperature) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature },
      }),
    }
  );

  const data = await response.json();
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    console.error("Bad response:", data);
    return "No valid output";
  }
}
