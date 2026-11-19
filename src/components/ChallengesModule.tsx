import { Fragment, useState } from 'react';
import {
  BookCheck,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { CHALLENGES } from '../data/learningContent';
import { FillBlankChallenge, MultipleChoiceChallenge } from '../types/lab';

interface ChallengesModuleProps {
  solvedIds: string[];
  onMarkSolved: (challengeId: string, isSolved: boolean) => void;
}

interface ChallengeResultState {
  checked: boolean;
  isCorrect: boolean;
  blankResults?: Record<string, boolean>;
}

export default function ChallengesModule({
  solvedIds,
  onMarkSolved,
}: ChallengesModuleProps) {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);

  // Answers state per challenge ID
  const [mcSelections, setMcSelections] = useState<Record<string, string>>({});
  const [blankInputs, setBlankInputs] = useState<
    Record<string, Record<string, string>>
  >({});
  const [focusedBlank, setFocusedBlank] = useState<string>('b1');
  const [results, setResults] = useState<Record<string, ChallengeResultState>>(
    {}
  );
  const [openTips, setOpenTips] = useState<Record<string, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>(
    {}
  );

  const challenge = CHALLENGES[activeChallengeIdx];
  const currentResult = results[challenge.id];
  const isTipOpen = openTips[challenge.id] ?? false;
  const isSolutionOpen = openSolutions[challenge.id] ?? false;

  const handleSelectChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    const next = CHALLENGES[idx];
    if (next.type === 'fill-blank' && next.blanks.length > 0) {
      setFocusedBlank(next.blanks[0].id);
    }
  };

  const handleMcSelect = (challengeId: string, optionId: string) => {
    setMcSelections((prev) => ({ ...prev, [challengeId]: optionId }));
    if (results[challengeId]?.checked) {
      setResults((prev) => ({
        ...prev,
        [challengeId]: { checked: false, isCorrect: false },
      }));
    }
  };

  const handleBlankChange = (
    challengeId: string,
    blankId: string,
    value: string
  ) => {
    setBlankInputs((prev) => ({
      ...prev,
      [challengeId]: {
        ...(prev[challengeId] ?? {}),
        [blankId]: value,
      },
    }));
    if (results[challengeId]?.checked) {
      setResults((prev) => ({
        ...prev,
        [challengeId]: { checked: false, isCorrect: false },
      }));
    }
  };

  const handleQuickFill = (
    ch: FillBlankChallenge,
    value: string
  ) => {
    const targetBlankId =
      ch.blanks.find((b) => b.id === focusedBlank)?.id ?? ch.blanks[0].id;
    handleBlankChange(ch.id, targetBlankId, value);

    // Advance focus to next empty blank for convenience
    const currentInputs = {
      ...(blankInputs[ch.id] ?? {}),
      [targetBlankId]: value,
    };
    const nextEmpty = ch.blanks.find(
      (b) => b.id !== targetBlankId && !(currentInputs[b.id] ?? '').trim()
    );
    if (nextEmpty) {
      setFocusedBlank(nextEmpty.id);
    }
  };

  const handleVerify = () => {
    if (challenge.type === 'multiple-choice') {
      const selected = mcSelections[challenge.id];
      if (!selected) return;
      const isCorrect = selected === challenge.correctOptionId;
      setResults((prev) => ({
        ...prev,
        [challenge.id]: { checked: true, isCorrect },
      }));
      onMarkSolved(challenge.id, isCorrect);
      if (isCorrect) {
        setOpenSolutions((prev) => ({ ...prev, [challenge.id]: true }));
      }
    } else {
      const inputs = blankInputs[challenge.id] ?? {};
      const blankResults: Record<string, boolean> = {};
      let allCorrect = true;

      for (const blank of challenge.blanks) {
        const userVal = (inputs[blank.id] ?? '').trim().replace(/\s+/g, ' ');
        const matched = blank.correctAnswers.some(
          (ans) => ans.toLowerCase() === userVal.toLowerCase()
        );
        blankResults[blank.id] = matched;
        if (!matched) {
          allCorrect = false;
        }
      }

      setResults((prev) => ({
        ...prev,
        [challenge.id]: {
          checked: true,
          isCorrect: allCorrect,
          blankResults,
        },
      }));
      onMarkSolved(challenge.id, allCorrect);
      if (allCorrect) {
        setOpenSolutions((prev) => ({ ...prev, [challenge.id]: true }));
      }
    }
  };

  const handleResetChallenge = () => {
    if (challenge.type === 'multiple-choice') {
      setMcSelections((prev) => {
        const next = { ...prev };
        delete next[challenge.id];
        return next;
      });
    } else {
      setBlankInputs((prev) => ({ ...prev, [challenge.id]: {} }));
      setFocusedBlank(challenge.blanks[0].id);
    }
    setResults((prev) => {
      const next = { ...prev };
      delete next[challenge.id];
      return next;
    });
    setOpenSolutions((prev) => ({ ...prev, [challenge.id]: false }));
    onMarkSolved(challenge.id, false);
  };

  const canVerify =
    challenge.type === 'multiple-choice'
      ? Boolean(mcSelections[challenge.id])
      : challenge.blanks.every(
          (b) => ((blankInputs[challenge.id] ?? {})[b.id] ?? '').trim().length > 0
        );

  const allSolved = solvedIds.length === CHALLENGES.length;

  return (
    <div className="space-y-6">
      {/* Header + Progress Bar */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Módulo 4 · Hora de Praticar
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50">
              Desafios Interativos com Gabarito
            </h1>
            <p className="text-sm text-slate-300">
              Resolva os 3 desafios abaixo para testar seu domínio sobre índices,{' '}
              <code className="text-amber-300">for</code> e{' '}
              <code className="text-violet-300">while</code>.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B1120] px-4 py-3 flex items-center gap-3 shrink-0">
            <Trophy
              className={`h-5 w-5 ${
                allSolved ? 'text-emerald-400' : 'text-amber-400'
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-slate-400">Seu progresso</p>
              <p className="font-mono text-sm font-bold text-slate-100">
                {solvedIds.length} de {CHALLENGES.length} concluídos
              </p>
            </div>
          </div>
        </div>

        {/* 3 Challenge Tabs */}
        <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
          {CHALLENGES.map((ch, idx) => {
            const isActive = idx === activeChallengeIdx;
            const isSolved = solvedIds.includes(ch.id);
            const res = results[ch.id];

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectChallenge(idx)}
                className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'border-sky-400 bg-sky-500/15 text-slate-100'
                    : 'border-slate-800 bg-[#0B1120] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">
                    Desafio {ch.number} · {ch.difficulty}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold truncate">
                    {ch.title}
                  </p>
                </div>
                {isSolved ? (
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-400 shrink-0"
                    aria-label="Concluído"
                  />
                ) : res?.checked && !res.isCorrect ? (
                  <XCircle
                    className="h-4 w-4 text-rose-400 shrink-0"
                    aria-label="Incorreto"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {/* Completion Banner when all 3 are solved */}
      {allSolved && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <Sparkles
              className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-base font-bold text-emerald-200">
                Parabéns! Você completou todos os desafios!
              </p>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                Você já domina os fundamentos de Arrays, índices, for e while
                para o 4º bimestre.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Challenge Card */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">
              Desafio {challenge.number} de {CHALLENGES.length} ·{' '}
              {challenge.type === 'multiple-choice'
                ? 'Múltipla Escolha'
                : 'Preencher Lacunas'}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-50">
              {challenge.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setOpenTips((prev) => ({
                ...prev,
                [challenge.id]: !isTipOpen,
              }))
            }
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isTipOpen ? 'Ocultar Dica' : 'Preciso de uma Dica'}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {challenge.prompt}
        </p>

        {isTipOpen && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs sm:text-sm text-amber-100">
            <strong className="text-amber-300">Dica da professora: </strong>
            {challenge.tip}
          </div>
        )}

        {/* Challenge Body: Multiple Choice vs Fill in the Blanks */}
        {challenge.type === 'multiple-choice' ? (
          <MultipleChoiceView
            challenge={challenge}
            selectedOption={mcSelections[challenge.id]}
            result={currentResult}
            onSelect={(optId) => handleMcSelect(challenge.id, optId)}
          />
        ) : (
          <FillBlankView
            challenge={challenge}
            inputs={blankInputs[challenge.id] ?? {}}
            focusedBlank={focusedBlank}
            result={currentResult}
            onFocusBlank={setFocusedBlank}
            onChangeBlank={(bId, val) =>
              handleBlankChange(challenge.id, bId, val)
            }
            onQuickFill={(val) => handleQuickFill(challenge, val)}
          />
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Verificar Resposta</span>
            </button>

            <button
              type="button"
              onClick={handleResetChallenge}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Limpar</span>
            </button>
          </div>

          {currentResult?.checked && (
            <button
              type="button"
              onClick={() =>
                setOpenSolutions((prev) => ({
                  ...prev,
                  [challenge.id]: !isSolutionOpen,
                }))
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-violet-200 hover:bg-violet-500/25 transition-colors cursor-pointer"
            >
              <BookCheck className="h-4 w-4" aria-hidden="true" />
              <span>
                {isSolutionOpen ? 'Ocultar Gabarito' : 'Ver Gabarito Comentado'}
              </span>
            </button>
          )}
        </div>

        {/* Immediate Verification Feedback Banner */}
        {currentResult?.checked && (
          <div
            role="status"
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              currentResult.isCorrect
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
            }`}
          >
            {currentResult.isCorrect ? (
              <CheckCircle2
                className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <XCircle
                className="h-5 w-5 text-rose-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            )}
            <div className="space-y-1">
              <p className="text-sm font-bold">
                {currentResult.isCorrect
                  ? 'Excelente! Resposta correta!'
                  : 'Quase lá! Revise os detalhes destacados em vermelho.'}
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                {currentResult.isCorrect
                  ? 'Confira abaixo o gabarito comentado para consolidar o porquê da resposta.'
                  : 'Você pode ajustar sua resposta e verificar novamente ou abrir o Gabarito Comentado.'}
              </p>
            </div>
          </div>
        )}

        {/* Gabarito Comentado */}
        {isSolutionOpen && (
          <div className="rounded-xl border border-violet-500/30 bg-[#0B1120] p-5 space-y-2">
            <p className="text-xs font-bold text-violet-300 flex items-center gap-2">
              <BookCheck className="h-4 w-4" aria-hidden="true" />
              Gabarito Comentado
            </p>
            <p className="text-sm leading-relaxed text-slate-200">
              {challenge.commentedAnswer}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function MultipleChoiceView({
  challenge,
  selectedOption,
  result,
  onSelect,
}: {
  challenge: MultipleChoiceChallenge;
  selectedOption?: string;
  result?: ChallengeResultState;
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0B1120] p-4 font-mono text-xs sm:text-sm text-slate-200">
        {challenge.codeSnippet.join('\n')}
      </pre>

      <div className="grid gap-3 sm:grid-cols-2">
        {challenge.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isChecked = result?.checked ?? false;
          const isRightOption = opt.id === challenge.correctOptionId;

          let cardClass =
            'border-slate-800 bg-[#0B1120] hover:border-slate-600';
          if (isChecked && isSelected && isRightOption) {
            cardClass = 'border-emerald-400 bg-emerald-500/15';
          } else if (isChecked && isSelected && !isRightOption) {
            cardClass = 'border-rose-400 bg-rose-500/15';
          } else if (isSelected) {
            cardClass = 'border-sky-400 bg-sky-500/15';
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`rounded-xl border p-4 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${cardClass}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  {opt.label}
                </span>
                {isChecked && isSelected && (
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      isRightOption ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {isRightOption ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Correta
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Incorreta
                      </>
                    )}
                  </span>
                )}
              </div>
              <code className="font-mono text-xs sm:text-sm text-slate-100">
                {opt.code}
              </code>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlankView({
  challenge,
  inputs,
  focusedBlank,
  result,
  onFocusBlank,
  onChangeBlank,
  onQuickFill,
}: {
  challenge: FillBlankChallenge;
  inputs: Record<string, string>;
  focusedBlank: string;
  result?: ChallengeResultState;
  onFocusBlank: (id: string) => void;
  onChangeBlank: (blankId: string, val: string) => void;
  onQuickFill: (val: string) => void;
}) {
  const activeSlot =
    challenge.blanks.find((b) => b.id === focusedBlank) ?? challenge.blanks[0];

  return (
    <div className="space-y-4">
      {/* Interactive Code with Embedded Inputs */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0B1120] p-4 sm:p-5 font-mono text-xs sm:text-sm leading-loose text-slate-200">
        <pre className="whitespace-pre-wrap break-words font-mono">
          {challenge.codeSegments.map((segment, idx) => {
            if (typeof segment === 'string') {
              return <Fragment key={idx}>{segment}</Fragment>;
            }

            const slot = challenge.blanks.find((b) => b.id === segment.blankId);
            if (!slot) return null;

            const value = inputs[slot.id] ?? '';
            const isFocused = focusedBlank === slot.id;
            const checked = result?.checked ?? false;
            const isBlankOk = result?.blankResults?.[slot.id];

            let inputBorder = isFocused
              ? 'border-sky-400 bg-sky-500/15 text-sky-100'
              : 'border-slate-600 bg-slate-900 text-amber-200';

            if (checked && isBlankOk === true) {
              inputBorder =
                'border-emerald-400 bg-emerald-500/20 text-emerald-200';
            } else if (checked && isBlankOk === false) {
              inputBorder = 'border-rose-400 bg-rose-500/20 text-rose-200';
            }

            return (
              <input
                key={slot.id}
                type="text"
                value={value}
                onFocus={() => onFocusBlank(slot.id)}
                onChange={(e) => onChangeBlank(slot.id, e.target.value)}
                placeholder={slot.placeholder}
                aria-label={`Lacuna ${slot.id}: ${slot.placeholder}`}
                className={`mx-0.5 inline-block w-28 rounded-md border px-2 py-0.5 text-center font-mono text-xs sm:text-sm font-semibold outline-none transition-colors ${inputBorder}`}
              />
            );
          })}
        </pre>
      </div>

      {/* Quick-Fill Suggestions for Currently Focused Blank */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-[#0B1120] p-4">
        <div className="space-y-1.5">
          <p className="text-xs text-slate-400">
            Clique para preencher a lacuna selecionada (
            <span className="text-sky-300 font-medium">
              {activeSlot.placeholder}
            </span>
            ) ou digite direto no código:
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSlot.quickChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => onQuickFill(choice)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-semibold text-sky-200 hover:border-sky-400 hover:bg-sky-500/15 transition-colors cursor-pointer"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 shrink-0">
          <p className="text-[11px] text-slate-400 mb-1">
            Saída esperada no console:
          </p>
          <pre className="font-mono text-xs text-emerald-300">
            {challenge.expectedOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
