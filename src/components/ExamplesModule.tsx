import { useMemo, useState } from 'react';
import { BookOpen, Play, Terminal } from 'lucide-react';
import { PRACTICAL_EXAMPLES } from '../data/learningContent';

export default function ExamplesModule() {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(
    PRACTICAL_EXAMPLES[0].id
  );
  const [selectedLine, setSelectedLine] = useState<number>(1);
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [runCounter, setRunCounter] = useState<number>(1);

  const example =
    PRACTICAL_EXAMPLES.find((ex) => ex.id === selectedExampleId) ??
    PRACTICAL_EXAMPLES[0];
  const preset = example.presets[presetIndex] ?? example.presets[0];

  const handleSelectExample = (id: string) => {
    setSelectedExampleId(id);
    setSelectedLine(1);
    setPresetIndex(0);
    setRunCounter((c) => c + 1);
  };

  // Real ES6 execution of the active example with the selected preset data
  const executionOutput = useMemo(() => {
    const logs: string[] = [];

    if (example.id === 'somar-notas') {
      const notas = preset.inputArray as number[];
      let soma = 0;
      for (let i = 0; i < notas.length; i++) {
        soma = soma + notas[i];
      }
      const media = soma / notas.length;
      logs.push(`Array usado: [${notas.join(', ')}]`);
      logs.push(`Soma total: ${soma}`);
      logs.push(`Média final: ${media}`);
    } else if (example.id === 'filtrar-pares') {
      const numeros = preset.inputArray as number[];
      const pares: number[] = [];
      for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] % 2 === 0) {
          pares.push(numeros[i]);
        }
      }
      logs.push(`Lista original: [${numeros.join(', ')}]`);
      logs.push(`Pares encontrados: [${pares.join(', ')}]`);
    } else if (example.id === 'buscar-item') {
      const carrinho = preset.inputArray as string[];
      const procurado = preset.searchTarget ?? 'Monitor';
      let posicao = -1;
      for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i] === procurado) {
          posicao = i;
        }
      }
      logs.push(`Procurando "${procurado}" em [${carrinho.join(', ')}]`);
      if (posicao !== -1) {
        logs.push(`Encontrado no índice: ${posicao}`);
      } else {
        logs.push('Item não está no carrinho.');
      }
    }

    return logs;
  }, [example.id, preset, runCounter]);

  // Dynamically reflect chosen preset values in line 1 & line 2 preview
  const getDisplayCode = (lineNum: number, rawCode: string) => {
    if (lineNum === 1) {
      if (example.id === 'somar-notas') {
        return `const notas = [${preset.inputArray.join(', ')}];`;
      }
      if (example.id === 'filtrar-pares') {
        return `const numeros = [${preset.inputArray.join(', ')}];`;
      }
      if (example.id === 'buscar-item') {
        return `const carrinho = [${(preset.inputArray as string[])
          .map((s) => `"${s}"`)
          .join(', ')}];`;
      }
    }
    if (lineNum === 2 && example.id === 'buscar-item' && preset.searchTarget) {
      return `const procurado = "${preset.searchTarget}";`;
    }
    return rawCode;
  };

  const activeLineObj =
    example.lines.find((l) => l.lineNumber === selectedLine) ?? example.lines[0];

  return (
    <div className="space-y-6">
      {/* Module Header + Example Selector */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Módulo 3 · Padrões Essenciais
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50">
              Exemplos Práticos Comentados Linha a Linha
            </h1>
            <p className="text-sm text-slate-300">
              Clique em qualquer linha de código para ler a explicação detalhada
              e teste o algoritmo rodando com diferentes listas.
            </p>
          </div>
        </div>

        {/* 3 Example Switcher Cards */}
        <div className="grid gap-3 md:grid-cols-3 pt-1">
          {PRACTICAL_EXAMPLES.map((ex) => {
            const isSelected = ex.id === example.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelectExample(ex.id)}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isSelected
                    ? 'border-sky-400 bg-sky-500/10'
                    : 'border-slate-800 bg-[#0B1120] hover:border-slate-600'
                }`}
              >
                <p className="text-xs font-medium text-sky-400 mb-1">
                  {ex.tag}
                </p>
                <p className="font-display text-base font-bold text-slate-100 mb-1">
                  {ex.title}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ex.summary}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Line-by-Line Code + Explanation & Live Output */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left: Interactive Line-by-Line Code */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0B1120] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-xs">
            <span className="font-medium text-slate-200">
              Clique em uma linha para inspecionar
            </span>
            <span className="text-slate-400">
              Objetivo: <span className="text-slate-200">{example.goal}</span>
            </span>
          </div>

          <div className="divide-y divide-slate-800/40 p-2 sm:p-3">
            {example.lines.map((line) => {
              const isSelected = line.lineNumber === selectedLine;
              const displayCode = getDisplayCode(line.lineNumber, line.code);

              return (
                <button
                  key={line.lineNumber}
                  type="button"
                  onClick={() => setSelectedLine(line.lineNumber)}
                  onMouseEnter={() => setSelectedLine(line.lineNumber)}
                  className={`w-full flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 text-slate-50 ring-1 ring-sky-400/40'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-slate-500 pt-0.5 select-none">
                    {line.lineNumber}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <pre className="overflow-x-auto font-mono text-xs sm:text-sm whitespace-pre">
                      {displayCode}
                    </pre>
                    <p
                      className={`text-xs leading-snug ${
                        isSelected ? 'text-sky-200' : 'text-slate-500'
                      }`}
                    >
                      // {line.comment}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Line Detail + Interactive Runner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Line Explanation Box */}
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Explicação da Linha {activeLineObj.lineNumber}
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950/90 border border-slate-800 px-3 py-2 font-mono text-xs text-amber-200">
              {getDisplayCode(activeLineObj.lineNumber, activeLineObj.code)}
            </pre>
            <p className="text-sm leading-relaxed text-slate-100">
              {activeLineObj.comment}
            </p>
          </div>

          {/* Interactive Playground / Preset Runner */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-300">
                Teste com outros dados:
              </p>
              <button
                type="button"
                onClick={() => setRunCounter((c) => c + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Executar</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {example.presets.map((pr, idx) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => {
                    setPresetIndex(idx);
                    setRunCounter((c) => c + 1);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    presetIndex === idx
                      ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                      : 'border-slate-700 bg-[#0B1120] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>

            {/* Output Terminal */}
            <div className="rounded-xl border border-slate-800 bg-[#070B14] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Terminal
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  />
                  Saída no Console
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Execução #{runCounter}
                </span>
              </div>
              <div className="p-3.5 font-mono text-xs sm:text-sm space-y-1.5">
                {executionOutput.map((line, i) => (
                  <div
                    key={`${line}-${i}`}
                    className="flex items-start gap-2 text-emerald-300"
                  >
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
