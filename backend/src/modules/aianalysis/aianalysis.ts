import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function runCompetitiveAnalysis(idea: string): Promise<string> {
  const prompt = `
You are FounderOS — an advanced startup analysis engine.

Perform a detailed competitive analysis for this startup idea:
"${idea}"

Include:

1. Competitor count & saturation score  
2. Top competitors (3–7)  
3. Market landscape overview  
4. Strengths & weaknesses  
5. Opportunity score (0–100)  
6. Recommended positioning & differentiation  
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.6,
    max_tokens: 1300,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content || "No output generated.";
}
