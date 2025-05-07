import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export default function MatrixTranslator() {
  const [input, setInput] = useState("");
  const [stream, setStream] = useState("");

  async function handleAsk(direction: "NT2A" | "A2NT") {
    setStream("");
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, direction, mode: "immersive" }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setStream((prev) => prev + decoder.decode(value));
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-3xl font-mono">Matrix Translator</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full max-w-xl h-32 p-2 border rounded bg-black/60 text-green-400 font-mono"
        placeholder="Tape ton message ici…"
      />

      <div className="flex gap-4">
        <Button onClick={() => handleAsk("NT2A")} variant="secondary">
          💊 Pilule rouge (NT ➜ Atypique)
        </Button>
        <Button onClick={() => handleAsk("A2NT")} variant="outline">
          💊 Pilule bleue (Atypique ➜ NT)
        </Button>
      </div>

      <pre className="w-full max-w-xl h-60 overflow-auto bg-black/90 text-green-400 p-3 rounded font-mono">
        {stream || "<…la réponse s’affichera en direct…>"}
      </pre>
    </div>
  );
}

