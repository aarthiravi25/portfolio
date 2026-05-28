/**
 * AIService.js
 * Placeholder AI service that simulates a streaming response.
 * Replace `mockStream` with an actual OpenAI / Anthropic API call
 * when ready for production.
 *
 * Usage:
 *   const stream = AIService.ask("What are your skills?");
 *   for await (const chunk of stream) { process(chunk); }
 */

const MOCK_RESPONSES = {
  default: [
    "That's a great question. Based on my experience, I'd say the most important aspect is",
    " maintaining clean abstractions while keeping performance in mind.",
    " I've worked extensively with React, Node.js, and distributed systems —",
    " always prioritizing developer experience alongside raw performance metrics.",
    "\n\n> Type `projects` to see concrete examples of this philosophy in action.",
  ],
  skills: [
    "My core stack revolves around the JavaScript/TypeScript ecosystem —",
    " React on the frontend, Node.js on the backend.",
    " I've also been deep in Rust for systems-level work and Python for ML pipelines.",
    "\n\n> Run `skills` for the full breakdown.",
  ],
  projects: [
    "My most impactful recent project is NeuralFlow —",
    " a visual ML pipeline builder used by 200+ researchers.",
    " The technical challenge was real-time synchronization between the node graph and training state.",
    "\n\n> Type `projects` to explore all 6 projects.",
  ],
  contact: [
    "The best way to reach me is via email at alex@terminalos.dev.",
    " I typically respond within 24 hours.",
    "\n\n> Type `contact` for all channels.",
  ],
};

function pickResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) return MOCK_RESPONSES.skills;
  if (q.includes('project') || q.includes('work') || q.includes('built')) return MOCK_RESPONSES.projects;
  if (q.includes('contact') || q.includes('hire') || q.includes('email')) return MOCK_RESPONSES.contact;
  return MOCK_RESPONSES.default;
}

async function* mockStream(query) {
  const chunks = pickResponse(query);
  for (const chunk of chunks) {
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 80));
    yield chunk;
  }
}

/**
 * Production-ready swap: replace this function body with:
 *
 * const response = await openai.chat.completions.create({
 *   model: 'gpt-4o',
 *   messages: [{ role: 'user', content: query }],
 *   stream: true,
 *   system: SYSTEM_PROMPT,
 * });
 * for await (const part of response) {
 *   yield part.choices[0]?.delta?.content ?? '';
 * }
 */
export const AIService = {
  ask: (query) => mockStream(query),

  isAvailable: () => {
    // Check for API key when in production
    return typeof import.meta.env.VITE_OPENAI_API_KEY === 'string'
      ? true
      : false; // returns false in mock mode — graceful fallback
  },
};
