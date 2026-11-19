/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ChallengesModule from './components/ChallengesModule';
import ConceptModule from './components/ConceptModule';
import ExamplesModule from './components/ExamplesModule';
import Navbar from './components/Navbar';
import SimulatorModule from './components/SimulatorModule';
import { CHALLENGES } from './data/learningContent';
import { ModuleTab } from './types/lab';

export default function App() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('conceito');
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const handleMarkSolved = (challengeId: string, isSolved: boolean) => {
    setSolvedIds((prev) => {
      if (isSolved) {
        return prev.includes(challengeId) ? prev : [...prev, challengeId];
      }
      return prev.filter((id) => id !== challengeId);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        solvedCount={solvedIds.length}
        totalChallenges={CHALLENGES.length}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {activeTab === 'conceito' && (
          <ConceptModule onGoToSimulator={() => setActiveTab('simulador')} />
        )}
        {activeTab === 'simulador' && <SimulatorModule />}
        {activeTab === 'exemplos' && <ExamplesModule />}
        {activeTab === 'desafios' && (
          <ChallengesModule
            solvedIds={solvedIds}
            onMarkSolved={handleMarkSolved}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-5 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            JS Lab: Loops &amp; Arrays · Programação e Algoritmos (4º Bimestre)
          </span>
          <span>JavaScript ES6+ · Modo Console</span>
        </div>
      </footer>
    </div>
  );
}
