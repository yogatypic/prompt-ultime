import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/MatrixTranslator';
import Game from './components/Game';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:sessionId" element={<Game />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
