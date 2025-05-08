// src/components/Game.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentStep, postAnswer } from '../api/api';
import StepView from './StepView';

export default function Game() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [step, setStep] = useState<{
    prompt: string;
    choices: { id: string; label: string }[];
  }>();

  // Chargement de l'étape courante
  useEffect(() => {
    if (!sessionId) return;                   // ← garde sessionId
    getCurrentStep(sessionId).then(setStep);
  }, [sessionId]);

  // Gestion de la réponse
  const handleAnswer = async (choiceId: string) => {
    if (!sessionId) return;                   // ← garde sessionId AVANT postAnswer
    const next = await postAnswer(sessionId, choiceId);
    setStep(next);
  };

  if (!step) return <p>Chargement de l’étape…</p>;
  return (
    <StepView
      promptHtml={step.prompt}
      choices={step.choices}
      onAnswer={handleAnswer}
    />
  );
}

