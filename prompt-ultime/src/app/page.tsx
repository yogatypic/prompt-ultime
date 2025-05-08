"use client";

import { useState } from "react";
import MatrixTranslator from "@/components/MatrixTranslator";

export default function Home() {
  // 1️⃣ On démarre sur l'écran de choix
  const [modePage, setModePage] = useState<"choose" | "translate">("choose");
  // 2️⃣ On stocke la pilule choisie
  const [initialMode, setInitialMode] = useState<"immersive" | "simple">("simple");

  // 3️⃣ Si on est dans le mode “choose”, on affiche les deux boutons
  if (modePage === "choose") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl mb-6">Quelle pilule prends-tu ?</h1>
        <button
          className="m-2 px-6 py-3 bg-red-600 text-white rounded"
          onClick={() => {
            setInitialMode("immersive");   // Pilule rouge → mode immersif
            setModePage("translate");      // on passe à l'écran traducteur
          }}
        >
          Pilule rouge (Immersive)
        </button>
        <button
          className="m-2 px-6 py-3 bg-blue-600 text-white rounded"
          onClick={() => {
            setInitialMode("simple");      // Pilule bleue → mode simple
            setModePage("translate");
          }}
        >
          Pilule bleue (Simple)
        </button>
      </div>
    );
  }

  // 4️⃣ Sinon, on affiche le traducteur en lui passant initialMode
  return <MatrixTranslator initialMode={initialMode} />;
}

