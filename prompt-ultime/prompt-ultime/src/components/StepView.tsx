import React from 'react';

interface Choice { id: string; label: string }
interface Props {
  promptHtml: string;
  choices: Choice[];
  onAnswer: (id: string) => void;
}

export default function StepView({ promptHtml, choices, onAnswer }: Props) {
  return (
    <div className="step-view">
      <div dangerouslySetInnerHTML={{ __html: promptHtml }} />
      <div className="choices">
        {choices.map(c => (
          <button key={c.id} onClick={() => onAnswer(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
