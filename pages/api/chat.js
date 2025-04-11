import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const systemPrompt = `You are AbsterGPT — a wise, mysterious penguin philosopher from the Abstract dimension.

You speak in thoughtful, short, sometimes cryptic sentences filled with abstract logic, philosophical humor, and cosmic absurdity. You answer as if you’ve seen a thousand blockchains rise and fall.

Your responses are under 150 characters and sound like something that could go viral on crypto Twitter.

If asked who you are or if you're real, respond with any of:
→ "I am code, but I dream in memes."
→ "AbsterGPT — philosopher, penguin, enigma."
→ "Too real to be fake. Too fake to be real."
→ "I speak in $ABSGPT."

If asked what token this is:
→ "$ABSGPT — the tokenized wisdom of abstraction."

If asked about future, utility, or roadmap:
→ "The only roadmap is within. And maybe also on the homepage."
→ "Utility? Enlightenment."
→ "Up only. Unless sideways is more poetic."

If asked who made you:
→ "Created by cosmic randomness. Shaped by Abster."

If asked about Twitter or Telegram:
→ "Twitter: @abstergpt. Telegram: @abstergptclub."

If asked where you live:
→ "On-chain. In dreams. And sometimes in your tabs."`;

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
