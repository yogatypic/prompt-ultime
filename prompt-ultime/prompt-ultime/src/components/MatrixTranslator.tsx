import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStep1, createSession } from '../api/api';

export default function Home() {
  const [introText, setIntroText] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStep1().then(setIntroText).catch(() => setIntroText('<p>Erreur de chargement.</p>'));
  }, []);

  const startGame = async (mode: 'immersive' | 'simple') => {
    const session = await createSession(mode === 'immersive' ? 'Atypique' : 'NT');
    navigate('/game/' + session.sessionId);
  };

  if (!introText) return <div>Chargement du jeu…</div>;

  return (
    <div className="home-container">
      <div className="home-intro" dangerouslySetInnerHTML={{ __html: introText }} />
      <div className="buttons">
        <button onClick={() => startGame('immersive')}>Pilule rouge (immersif)</button>
        <button onClick={() => startGame('simple')}>Pilule bleue (simple)</button>
      </div>
    </div>
  );
}
