// src/app/api/translate/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Ajustez le chemin d’import si votre buildPrompt est ailleurs
import { buildPrompt } from "@/lib/buildPrompt";

export async function POST(request: NextRequest) {
  // 1. On récupère le body JSON et on renomme la prop initialMode en mode interne
  const { text, direction, initialMode } = await request.json();
  const mode = initialMode; 

  // 2. On construit le prompt selon le mode ("immersive" ou "simple")
  const prompt = buildPrompt(text, direction, mode);

  // 3. On appelle l’API OpenAI en mode streaming SSE
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  // 4. En cas d’erreur réseau / API, on renvoie un statut 500
  if (!aiResponse.ok) {
    return NextResponse.json(
      { error: `OpenAI API error: ${aiResponse.status}` },
      { status: 500 }
    );
  }

  // 5. On renvoie directement le corps du stream SSE au client
  return new NextResponse(aiResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      // facultatif : désactiver le buffering côté client
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

