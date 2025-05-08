// src/api/api.ts

export async function fetchStep1(): Promise<string> {
  const res = await fetch('/prompts/step1');
  const { prompt } = await res.json();
  return prompt;
}

export async function createSession(role: 'NT' | 'Atypique') {
  const res = await fetch('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export async function getCurrentStep(sessionId: string) {
  // concaténation classique, pas de template literal
  const res = await fetch('/sessions/' + sessionId + '/current-step');
  return res.json();
}

export async function postAnswer(sessionId: string, choiceId: string) {
  const res = await fetch('/sessions/' + sessionId + '/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId }),
  });
  return res.json();
}

