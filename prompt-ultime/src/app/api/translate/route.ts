// src/app/api/translate/route.ts
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function buildPrompt({ text, direction, mode }: any) {
  const header =
    mode === "immersive"
      ? `Tu es le Traducteur Inversé. Quand direction=NT2A, tu traduis le message en dialecte Atypique
         (humour, hyper-précision sensorielle). Quand direction=A2NT, tu simplifies et normativises.
         Garde la structure conversationnelle.`
      : "";
  return `${header}\n\nMessage: «${text}»\nDirection: ${direction}\nRéponse:`;
}

export async function POST(req: NextRequest) {
  const { text, direction, mode } = await req.json();
  const prompt = buildPrompt({ text, direction, mode });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [{ role: "user", content: prompt }],
  });

  // renvoi en stream SSE
  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of completion) {
        controller.enqueue(
          `data: ${part.choices[0]?.delta?.content || ""}\n\n`
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

