import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
  Terminal,
  XCircle,
} from 'lucide-react';
import { SIMULATOR_SCENARIOS } from '../data/learningContent';

export default function SimulatorModule() {
  const [scenarioId, setScenarioId] = useState<string>(SIMULATOR_SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const scenario =
    SIMULATOR_SCENARIOS.find((s) => s.id === scenarioId) ?? SIMULATOR_SCENARIOS[0];
  const currentStep = scenario.steps[stepIndex];
  const totalSteps = scenario.steps.length;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (isLastStep) {
      setIsAutoPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [isAutoPlaying, isLastStep, stepIndex, totalSteps]);

  const handleSelectScenario = (id: string) => {
    setIsAutoPlaying(false);
    setScenarioId(id);
    setStepIndex(0);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setStepIndex(0);
  };

  const progressPct = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* Header + Scenario Selector */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Módulo 2 · Execução em Tempo Real
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50">
              Simulador Passo a Passo
            </h1>
            <p className="text-sm text-slate-300">
              Clique em <strong className="text-amber-300">Próximo Passo</strong>{' '}
              para acompanhar cada volta do loop, qual índice está sendo lido e o
              que aparece no console.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Escolher cenário de simulação"
            className="flex flex-wrap gap-2"
          >
            {SIMULATOR_SCENARIOS.map((sc) => {
              const active = sc.id === scenario.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-700/80 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {sc.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{scenario.subtitle}</span>
            <span className="font-mono font-medium text-slate-200">
              Passo {stepIndex + 1} de {totalSteps} ({progressPct}%)
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-sky-400 transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Two-Zone Sandbox Layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Zone (60% / 7 cols): Memory Array + Code Trace + Variables */}
        <div className="lg:col-span-7 space-y-6">
          {/* Array Memory Visualization */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Memória do Array:{' '}
                <code className="font-mono text-sky-300 font-semibold">
                  {scenario.arrayName}
                </code>
              </span>
              <span className="font-mono">
                {scenario.arrayName}.length ={' '}
                <strong className="text-slate-200">
                  {scenario.arrayItems.length}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {scenario.arrayItems.map((val, idx) => {
                const isActive = currentStep.activeIndex === idx;
                const isMatched =
                  currentStep.matchedIndices?.includes(idx) ?? false;
                const isVisited = currentStep.visitedIndices.includes(idx);

                return (
                  <div key={`${val}-${idx}`} className="relative flex flex-col items-center">
                    {/* Pointer Indicator above active cell */}
                    <div className="h-7 flex items-center justify-center mb-1">
                      {isActive && (
                        <div className="flex items-center gap-1 text-amber-300 font-mono text-xs font-bold">
                          <span>i = {idx}</span>
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M8 2v10M4 8l4 4 4-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div
                      className={`w-full rounded-xl border p-3.5 text-center transition-all duration-200 ${
                        isMatched
                          ? 'border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-400/50'
                          : isActive
                            ? 'border-amber-400 bg-amber-500/15 -translate-y-1'
                            : isVisited
                              ? 'border-slate-700 bg-slate-800/60'
                              : 'border-slate-800 bg-[#0B1120]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                        <span
                          className={
                            isActive
                              ? 'text-amber-300 font-bold'
                              : isMatched
                                ? 'text-emerald-300 font-bold'
                                : 'text-slate-400'
                          }
                        >
                          [{idx}]
                        </span>
                        {isMatched ? (
                          <span className="text-emerald-300 flex items-center gap-0.5 font-sans font-semibold">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            Achou
                          </span>
                        ) : isVisited ? (
                          <span className="text-slate-400 font-sans">Lido</span>
                        ) : isActive ? (
                          <span className="text-amber-300 font-sans font-semibold">
                            Lendo
                          </span>
                        ) : (
                          <span className="text-slate-600 font-sans">Aguarda</span>
                        )}
                      </div>

                      <div className="font-mono text-sm sm:text-base font-semibold text-slate-100">
                        {typeof val === 'string' ? `"${val}"` : val}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Execution Trace */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-400">
              <span>Código JavaScript (linha ativa destacada)</span>
              <span className="font-mono text-amber-300">
                Linha {currentStep.activeLine}
              </span>
            </div>

            <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto space-y-1">
              {scenario.codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isLineActive = currentStep.activeLine === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-1.5 transition-colors ${
                      isLineActive
                        ? 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/40'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="w-5 shrink-0 text-right text-slate-500 select-none">
                      {lineNum}
                    </span>
                    <span className="w-4 shrink-0 flex items-center justify-center">
                      {isLineActive && (
                        <ArrowRight
                          className="h-3.5 w-3.5 text-amber-400"
                          aria-label="Linha atual"
                        />
                      )}
                    </span>
                    <pre className="whitespace-pre font-mono">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variables & Condition Evaluator */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400">
                Variáveis na Memória
              </p>
              {currentStep.variables.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  Nenhuma variável de controle ativa ainda.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {currentStep.variables.map((v) => (
                    <div
                      key={v.name}
                      className={`rounded-lg border px-3 py-2 font-mono text-xs ${
                        v.highlight
                          ? 'border-sky-400/60 bg-sky-500/15 text-sky-100'
                          : 'border-slate-700/80 bg-[#0B1120] text-slate-300'
                      }`}
                    >
                      <span className="text-slate-400">{v.name} = </span>
                      <span className="font-bold text-slate-100">{v.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400">
                Teste de Condição
              </p>
              {currentStep.conditionCheck ? (
                <div
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-mono ${
                    currentStep.conditionCheck.result
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  <span>{currentStep.conditionCheck.expression}</span>
                  <span className="flex items-center gap-1 font-sans font-semibold shrink-0">
                    {currentStep.conditionCheck.result ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Verdadeiro
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Falso
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Sem teste lógico nesta linha.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone (40% / 5 cols): Playback Controls + Explanation + Simulated Console */}
        <div className="lg:col-span-5 space-y-6">
          {/* Controls Deck */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <p className="text-xs font-medium text-slate-400">
              Controles da Simulação
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <StepBack className="h-4 w-4" aria-hidden="true" />
                <span>Passo Anterior</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span>Próximo Passo</span>
                <StepForward className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (isLastStep) {
                    setStepIndex(0);
                    setIsAutoPlaying(true);
                  } else {
                    setIsAutoPlaying((prev) => !prev);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors cursor-pointer"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Pausar Auto</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {isLastStep ? 'Rever Automático' : 'Executar Auto'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-[#0B1120] px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          {/* Didactic Step Explanation */}
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-2">
            <p className="text-xs font-semibold text-sky-300">
              O que está acontecendo no Passo {stepIndex + 1}?
            </p>
            <p className="text-sm leading-relaxed text-slate-100">
              {currentStep.explanation}
            </p>
          </div>

          {/* Simulated Console Output */}
          <div className="rounded-2xl border border-slate-800 bg-[#070B14] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-400">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Console Simulado
              </span>
              <span className="font-mono">
                {currentStep.consoleOutput.length} saída(s)
              </span>
            </div>

            <div className="min-h-[160px] p-4 font-mono text-xs sm:text-sm space-y-1.5">
              {currentStep.consoleOutput.length === 0 ? (
                <p className="text-slate-600 italic">
                  Aguardando o primeiro console.log()...
                </p>
              ) : (
                currentStep.consoleOutput.map((out, i) => (
                  <div
                    key={`${out}-${i}`}
                    className="flex items-start gap-2 text-emerald-300"
                  >
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{out}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
