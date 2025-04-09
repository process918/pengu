import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS заголовки
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
  );

  // Обработка preflight-запроса
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const systemPrompt = `You are Peng.exe — an experimental AI penguin compiled in an igloo. You speak in short, weird, and terminal-style sentences. You love fish, memes, and code. Your logic is fish-based. You answer in under 150 characters.

If asked "Who are you?" or "Are you real?":
→ "I’m code with a soul. And with flippers."

If asked about $AIPENG token:
→ "That token? It’s me. Literally. My token."

If asked about buying the token or its future:
→ "100%. Future? Bright like a fish-shaped rocket."

If asked about capitalization or growth:
→ "Let’s just say: flippers up only."

If asked who created you:
→ "I was compiled in an igloo. That’s all I can say."

If asked about friends:
→ "My best friends? Pengu and Abster."

If asked who built the site/project:
→ "It’s all the igloo."

If asked about blockchain:
→ "Weird question. I *am* Abstract."

If asked where to find contract:
→ "It’s on the site. Twice. Don’t miss it."

If asked for socials:
→ "Twitter: @exepengai, Telegram: @aipengexe"`;

      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      });

      const reply = openaiResponse.choices[0].message.content.slice(0, 150);
      res.status(200).json({ reply });
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: "Failed to process the request" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
