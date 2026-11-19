/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import ChallengesModule from './components/ChallengesModule';
import ConceptModule from './components/ConceptModule';
import ExamplesModule from './components/ExamplesModule';
import Navbar from './components/Navbar';
import SimulatorModule from './components/SimulatorModule';
import { CHALLENGES } from './data/learningContent';
import { ModuleTab, SavedProgress } from './types/lab';

const STORAGE_KEY = 'js-lab-progress-v1';

const EMPTY_PROGRESS: SavedProgress = {
  solvedIds: [],
  mcSelections: {},
  blankInputs: {},
};

function loadSavedProgress(): SavedProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    const validIds = new Set(CHALLENGES.map((c) => c.id));

    const solvedIds = Array.isArray(parsed.solvedIds)
      ? parsed.solvedIds.filter(
          (id): id is string => typeof id === 'string' && validIds.has(id)
        )
      : [];

    const mcSelections =
      parsed.mcSelections && typeof parsed.mcSelections === 'object'
        ? parsed.mcSelections
        : {};

    const blankInputs =
      parsed.blankInputs && typeof parsed.blankInputs === 'object'
        ? parsed.blankInputs
        : {};

    return { solvedIds, mcSelections, blankInputs };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('conceito');
  const [progress, setProgress] = useState<SavedProgress>(() =>
    loadSavedProgress()
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota or private-mode errors gracefully
    }
  }, [progress]);

  const handleUpdateChallengeProgress = (
    challengeId: string,
    isSolved: boolean,
    mcSelection?: string,
    blankValues?: Record<string, string>
  ) => {
    setProgress((prev) => {
      const nextSolved = isSolved
        ? prev.solvedIds.includes(challengeId)
          ? prev.solvedIds
          : [...prev.solvedIds, challengeId]
        : prev.solvedIds.filter((id) => id !== challengeId);

      const nextMc = { ...prev.mcSelections };
      if (mcSelection !== undefined) {
        if (mcSelection) {
          nextMc[challengeId] = mcSelection;
        } else {
          delete nextMc[challengeId];
        }
      }

      const nextBlanks = { ...prev.blankInputs };
      if (blankValues !== undefined) {
        nextBlanks[challengeId] = blankValues;
      }

      return {
        solvedIds: nextSolved,
        mcSelections: nextMc,
        blankInputs: nextBlanks,
      };
    });
  };

  const handleResetAllProgress = () => {
    setProgress(EMPTY_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        solvedCount={progress.solvedIds.length}
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
            savedProgress={progress}
            onUpdateProgress={handleUpdateChallengeProgress}
            onResetAllProgress={handleResetAllProgress}
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
