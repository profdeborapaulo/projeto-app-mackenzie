import { useState } from 'react';
import {
  ArrowRight,
  Box,
  Layers,
  Minus,
  Plus,
  RefreshCw,
  Repeat,
} from 'lucide-react';

interface ConceptModuleProps {
  onGoToSimulator: () => void;
}

const EXTRA_ITEMS = ['Caderno', 'Caneta', 'Lápis', 'Borracha', 'Régua'];

type LoopKind = 'for' | 'while';
type ForPart = 'init' | 'cond' | 'step' | 'body';

export default function ConceptModule({ onGoToSimulator }: ConceptModuleProps) {
  const [items, setItems] = useState<string[]>([
    'Caderno',
    'Caneta',
    'Lápis',
    'Borracha',
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [activeLoop, setActiveLoop] = useState<LoopKind>('for');
  const [activeForPart, setActiveForPart] = useState<ForPart>('cond');

  const handleAddItem = () => {
    if (items.length >= 5) return;
    const nextItem = EXTRA_ITEMS[items.length] ?? `Item ${items.length + 1}`;
    setItems([...items, nextItem]);
  };

  const handleRemoveItem = () => {
    if (items.length <= 2) return;
    const next = items.slice(0, -1);
    setItems(next);
    if (selectedIndex >= next.length) {
      setSelectedIndex(next.length - 1);
    }
  };

  const forPartDetails: Record<
    ForPart,
    { title: string; code: string; desc: string; color: string }
  > = {
    init: {
      title: '1. Início (let i = 0)',
      code: 'let i = 0',
      desc: 'Executa apenas uma vez antes do loop começar. Cria o contador i começando no índice 0 (primeira gaveta).',
      color: 'text-sky-300',
    },
    cond: {
      title: '2. Condição (i < mochila.length)',
      code: 'i < mochila.length',
      desc: 'Pergunta feita ANTES de cada volta: "Ainda existem gavetas para ler?" Se for verdadeiro, o código roda. Se falso, o loop para.',
      color: 'text-amber-300',
    },
    body: {
      title: '3. Bloco de Ação { ... }',
      code: 'console.log(mochila[i])',
      desc: 'O código que fica dentro das chaves é repetido a cada volta usando o valor atual de i.',
      color: 'text-emerald-300',
    },
    step: {
      title: '4. Passo / Incremento (i++)',
      code: 'i++',
      desc: 'Roda ao FINAL de cada volta, somando +1 ao contador (i = i + 1) para avançar para a próxima gaveta.',
      color: 'text-violet-300',
    },
  };

  return (
    <div className="space-y-10">
      {/* Intro Hero Header */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Módulo 1 · Fundamentos Visuais
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50 text-balance">
              Como guardar listas na memória e percorrê-las sem repetir código
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              Até agora, você guardava um dado por variável. Com{' '}
              <strong className="text-sky-300 font-semibold">Arrays</strong>,
              guardamos vários valores em sequência. Com{' '}
              <strong className="text-violet-300 font-semibold">Loops</strong>{' '}
              (<code className="text-amber-300">for</code> e{' '}
              <code className="text-amber-300">while</code>), o computador lê
              cada posição automaticamente.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToSimulator}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Testar no Simulador</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Part 1: Interactive Array Memory Visualizer */}
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400">
              <Layers className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-xl font-bold text-slate-100">
                1. O que é um Array (Vetor)?
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Pense em um array como um{' '}
              <strong className="text-slate-100">armário numerado</strong>.
              Cada gaveta guarda um valor e possui um número de endereço chamado{' '}
              <strong className="text-sky-300">índice</strong>, que sempre
              começa no <code className="text-amber-300 font-semibold">0</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRemoveItem}
              disabled={items.length <= 2}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Remover</span>
            </button>
            <button
              type="button"
              onClick={handleAddItem}
              disabled={items.length >= 5}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Adicionar item</span>
            </button>
          </div>
        </div>

        {/* Interactive Code & Memory Split */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Left: Memory Diagram + Interactive Slots */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B1120] p-5 flex flex-col justify-between gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
              <span>Clique em uma gaveta para inspecionar o índice</span>
              <span className="font-mono text-slate-300">
                mochila.length ={' '}
                <strong className="text-amber-300">{items.length}</strong>
              </span>
            </div>

            {/* SVG Diagram showing Array Pointer -> Memory Cells */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 font-mono text-xs sm:text-sm text-sky-300 shrink-0">
                  const mochila
                </div>
                <svg
                  viewBox="0 0 60 20"
                  className="h-5 w-12 shrink-0 text-sky-400"
                  aria-hidden="true"
                >
                  <line
                    x1="2"
                    y1="10"
                    x2="50"
                    y2="10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="43,4 52,10 43,16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs text-slate-400">
                  Aponta para {items.length} posições seguidas na memória:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {items.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={`${item}-${idx}`}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`group relative flex flex-col items-center rounded-xl border p-3 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 -translate-y-0.5'
                          : 'border-slate-700/80 bg-slate-900/90 hover:border-slate-500'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-semibold mb-1.5 ${
                          isSelected ? 'text-amber-300' : 'text-slate-400'
                        }`}
                      >
                        Índice [{idx}]
                      </span>
                      <Box
                        className={`h-5 w-5 mb-1.5 ${
                          isSelected ? 'text-amber-400' : 'text-sky-400/70'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs sm:text-sm font-medium text-slate-100 truncate max-w-full">
                        "{item}"
                      </span>
                      <span className="mt-1.5 text-[11px] text-slate-500 font-mono">
                        {idx === 0
                          ? '1º item'
                          : idx === items.length - 1
                            ? 'Último'
                            : `${idx + 1}º item`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inspector Readout */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="font-mono text-xs sm:text-sm text-slate-200">
                <span className="text-slate-400">Acesso: </span>
                <span className="text-sky-300">mochila</span>
                <span className="text-amber-300">[{selectedIndex}]</span>
                <span className="text-slate-400"> → </span>
                <span className="text-emerald-300 font-semibold">
                  "{items[selectedIndex]}"
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Último índice válido:{' '}
                <code className="text-amber-300 font-mono">
                  {items.length - 1}
                </code>
              </span>
            </div>
          </div>

          {/* Right: Code Translation & Golden Rule */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-5 space-y-3">
              <p className="text-xs font-medium text-slate-400">
                Como isso aparece no código JavaScript
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 border border-slate-800/80">
                <code>
                  <span className="text-violet-400">const</span>{' '}
                  <span className="text-sky-300">mochila</span> = [
                  {items.map((it, i) => (
                    <span key={it}>
                      <span
                        className={
                          i === selectedIndex
                            ? 'text-amber-300 font-semibold underline decoration-amber-400/60 underline-offset-4'
                            : 'text-emerald-300'
                        }
                      >
                        "{it}"
                      </span>
                      {i < items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  ];{'\n\n'}
                  <span className="text-slate-500">
                    // Lendo a gaveta selecionada:
                  </span>
                  {'\n'}
                  console.<span className="text-sky-300">log</span>(mochila[
                  <span className="text-amber-300">{selectedIndex}</span>]);{' '}
                  <span className="text-slate-500">
                    // "{items[selectedIndex]}"
                  </span>
                  {'\n'}
                  console.<span className="text-sky-300">log</span>(mochila.
                  <span className="text-amber-300">length</span>);{' '}
                  <span className="text-slate-500">// {items.length}</span>
                </code>
              </pre>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-amber-300">
                Regra de ouro: Tamanho vs. Último Índice
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                O array tem{' '}
                <strong className="text-slate-100">{items.length} itens</strong>{' '}
                (<code>length</code> = {items.length}), mas como começamos no{' '}
                <code>0</code>, o último índice é sempre{' '}
                <code className="text-amber-300 font-semibold">
                  length - 1
                </code>{' '}
                (ou seja, <code>{items.length - 1}</code>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Loops (for & while) with Interactive SVG Flowcharts */}
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-violet-400">
              <Repeat className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-xl font-bold text-slate-100">
                2. Estruturas de Repetição (Loops)
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Em vez de escrever{' '}
              <code className="text-slate-200">console.log</code> quatro vezes,
              usamos um loop para repetir a mesma ação mudando apenas o índice{' '}
              <code className="text-amber-300">i</code>.
            </p>
          </div>

          {/* Segmented Toggle: for vs while */}
          <div
            role="tablist"
            aria-label="Escolher estrutura de repetição"
            className="inline-flex rounded-xl border border-slate-800 bg-[#0B1120] p-1 shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeLoop === 'for'}
              onClick={() => setActiveLoop('for')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeLoop === 'for'
                  ? 'bg-violet-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Loop for
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLoop === 'while'}
              onClick={() => setActiveLoop('while')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeLoop === 'while'
                  ? 'bg-violet-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Loop while
            </button>
          </div>
        </div>

        {activeLoop === 'for' ? (
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left: Interactive Anatomy of FOR */}
            <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
              <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-5 space-y-4">
                <p className="text-xs text-slate-400">
                  Clique em cada bloco colorido da linha do{' '}
                  <code className="text-violet-300">for</code> para destacar no
                  fluxograma:
                </p>

                <div className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs sm:text-sm border border-slate-800 leading-loose">
                  <span className="text-violet-400 font-semibold">for</span> (
                  <button
                    type="button"
                    onClick={() => setActiveForPart('init')}
                    className={`rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                      activeForPart === 'init'
                        ? 'bg-sky-500/25 text-sky-200 ring-1 ring-sky-400'
                        : 'text-sky-300 hover:bg-sky-500/10'
                    }`}
                  >
                    let i = 0
                  </button>
                  ;{' '}
                  <button
                    type="button"
                    onClick={() => setActiveForPart('cond')}
                    className={`rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                      activeForPart === 'cond'
                        ? 'bg-amber-500/25 text-amber-200 ring-1 ring-amber-400'
                        : 'text-amber-300 hover:bg-amber-500/10'
                    }`}
                  >
                    i &lt; mochila.length
                  </button>
                  ;{' '}
                  <button
                    type="button"
                    onClick={() => setActiveForPart('step')}
                    className={`rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                      activeForPart === 'step'
                        ? 'bg-violet-500/25 text-violet-200 ring-1 ring-violet-400'
                        : 'text-violet-300 hover:bg-violet-500/10'
                    }`}
                  >
                    i++
                  </button>
                  ) {'{\n'}
                  {'  '}
                  <button
                    type="button"
                    onClick={() => setActiveForPart('body')}
                    className={`rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                      activeForPart === 'body'
                        ? 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400'
                        : 'text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    console.log(mochila[i]);
                  </button>
                  {'\n}'}
                </div>

                {/* Part Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['init', '1. Início'],
                      ['cond', '2. Condição'],
                      ['body', '3. Bloco'],
                      ['step', '4. Passo'],
                    ] as [ForPart, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveForPart(key)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                        activeForPart === key
                          ? 'border-sky-400/60 bg-slate-800 text-slate-100'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation card for selected part */}
              <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-5 space-y-1.5">
                <p
                  className={`text-sm font-bold ${forPartDetails[activeForPart].color}`}
                >
                  {forPartDetails[activeForPart].title}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {forPartDetails[activeForPart].desc}
                </p>
              </div>
            </div>

            {/* Right: Native SVG Flowchart for FOR */}
            <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0B1120] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
                <span>Fluxograma do Loop for</span>
                <span>Quando usar: quando sabemos quantas voltas dar</span>
              </div>

              <svg
                viewBox="0 0 460 340"
                className="w-full h-auto max-h-[340px]"
                role="img"
                aria-label="Fluxograma do loop for mostrando início, condição, bloco, incremento e saída"
              >
                <defs>
                  <marker
                    id="arrow-slate"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                  </marker>
                  <marker
                    id="arrow-emerald"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
                  </marker>
                  <marker
                    id="arrow-rose"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB7185" />
                  </marker>
                </defs>

                {/* Step 1: Init */}
                <g
                  onClick={() => setActiveForPart('init')}
                  className="cursor-pointer"
                >
                  <rect
                    x="135"
                    y="14"
                    width="150"
                    height="44"
                    rx="10"
                    fill={activeForPart === 'init' ? '#0C4A6E' : '#0F172A'}
                    stroke={activeForPart === 'init' ? '#38BDF8' : '#334155'}
                    strokeWidth={activeForPart === 'init' ? '2.5' : '1.5'}
                  />
                  <text
                    x="210"
                    y="33"
                    textAnchor="middle"
                    fill="#7DD3FC"
                    fontSize="11"
                    fontWeight="600"
                  >
                    1. Início (1 vez)
                  </text>
                  <text
                    x="210"
                    y="49"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    let i = 0
                  </text>
                </g>

                {/* Arrow Init -> Cond */}
                <line
                  x1="210"
                  y1="58"
                  x2="210"
                  y2="86"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#arrow-slate)"
                />

                {/* Step 2: Condition Diamond */}
                <g
                  onClick={() => setActiveForPart('cond')}
                  className="cursor-pointer"
                >
                  <polygon
                    points="210,90 315,134 210,178 105,134"
                    fill={activeForPart === 'cond' ? '#451A03' : '#0F172A'}
                    stroke={activeForPart === 'cond' ? '#FBBF24' : '#334155'}
                    strokeWidth={activeForPart === 'cond' ? '2.5' : '1.5'}
                  />
                  <text
                    x="210"
                    y="129"
                    textAnchor="middle"
                    fill="#FCD34D"
                    fontSize="11"
                    fontWeight="600"
                  >
                    2. Condição
                  </text>
                  <text
                    x="210"
                    y="146"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    i &lt; lista.length?
                  </text>
                </g>

                {/* Arrow Cond (True) -> Body */}
                <line
                  x1="210"
                  y1="178"
                  x2="210"
                  y2="208"
                  stroke="#34D399"
                  strokeWidth="2"
                  markerEnd="url(#arrow-emerald)"
                />
                <text
                  x="222"
                  y="198"
                  fill="#34D399"
                  fontSize="11"
                  fontWeight="600"
                >
                  Verdadeiro
                </text>

                {/* Step 3: Body */}
                <g
                  onClick={() => setActiveForPart('body')}
                  className="cursor-pointer"
                >
                  <rect
                    x="115"
                    y="212"
                    width="190"
                    height="48"
                    rx="10"
                    fill={activeForPart === 'body' ? '#064E3B' : '#0F172A'}
                    stroke={activeForPart === 'body' ? '#34D399' : '#334155'}
                    strokeWidth={activeForPart === 'body' ? '2.5' : '1.5'}
                  />
                  <text
                    x="210"
                    y="232"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontSize="11"
                    fontWeight="600"
                  >
                    3. Executa o bloco
                  </text>
                  <text
                    x="210"
                    y="249"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    console.log(mochila[i])
                  </text>
                </g>

                {/* Arrow Body -> Increment */}
                <path
                  d="M 210 260 L 210 284 L 82 284 L 82 204"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#arrow-slate)"
                />

                {/* Step 4: Increment */}
                <g
                  onClick={() => setActiveForPart('step')}
                  className="cursor-pointer"
                >
                  <rect
                    x="22"
                    y="156"
                    width="120"
                    height="44"
                    rx="10"
                    fill={activeForPart === 'step' ? '#2E1065' : '#0F172A'}
                    stroke={activeForPart === 'step' ? '#A78BFA' : '#334155'}
                    strokeWidth={activeForPart === 'step' ? '2.5' : '1.5'}
                  />
                  <text
                    x="82"
                    y="174"
                    textAnchor="middle"
                    fill="#C4B5FD"
                    fontSize="11"
                    fontWeight="600"
                  >
                    4. Passo
                  </text>
                  <text
                    x="82"
                    y="191"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    i++ (soma 1)
                  </text>
                </g>

                {/* Arrow Increment -> Cond */}
                <path
                  d="M 82 156 L 82 134 L 101 134"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#arrow-slate)"
                />

                {/* Arrow Cond (False) -> Exit */}
                <line
                  x1="315"
                  y1="134"
                  x2="368"
                  y2="134"
                  stroke="#FB7185"
                  strokeWidth="2"
                  markerEnd="url(#arrow-rose)"
                />
                <text
                  x="342"
                  y="124"
                  textAnchor="middle"
                  fill="#FB7185"
                  fontSize="11"
                  fontWeight="600"
                >
                  Falso
                </text>

                <rect
                  x="372"
                  y="112"
                  width="76"
                  height="44"
                  rx="22"
                  fill="#4C0519"
                  stroke="#FB7185"
                  strokeWidth="1.5"
                />
                <text
                  x="410"
                  y="138"
                  textAnchor="middle"
                  fill="#FECDD3"
                  fontSize="12"
                  fontWeight="600"
                >
                  Fim!
                </text>
              </svg>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left: While explanation + syntax */}
            <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
              <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-5 space-y-4">
                <p className="text-xs text-slate-400">
                  O <code className="text-violet-300">while</code> significa
                  "enquanto". Ele testa uma condição e repete o bloco até que a
                  condição se torne falsa.
                </p>

                <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs sm:text-sm border border-slate-800 leading-relaxed text-slate-200">
                  <code>
                    <span className="text-sky-300">let i = 0;</span>{' '}
                    <span className="text-slate-500">
                      // 1. Início vem ANTES
                    </span>
                    {'\n\n'}
                    <span className="text-violet-400 font-semibold">
                      while
                    </span>{' '}
                    (<span className="text-amber-300">i &lt; mochila.length</span>) {'{\n'}
                    {'  '}
                    <span className="text-emerald-300">
                      console.log(mochila[i]);
                    </span>
                    {'\n  '}
                    <span className="text-violet-300 font-semibold">i++;</span>{' '}
                    <span className="text-slate-500">
                      // 2. Nunca esqueça de atualizar!
                    </span>
                    {'\n}'}
                  </code>
                </pre>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-1.5">
                <p className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Cuidado com o Loop Infinito!
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Diferente do <code>for</code>, o <code>while</code> não
                  aumenta o <code>i</code> sozinho. Se você esquecer o{' '}
                  <code className="text-violet-300">i++</code> dentro das
                  chaves, a condição será sempre verdadeira e o programa trava!
                </p>
              </div>
            </div>

            {/* Right: Native SVG Flowchart for WHILE */}
            <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0B1120] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
                <span>Fluxograma do Loop while</span>
                <span>Quando usar: quando depende de uma condição</span>
              </div>

              <svg
                viewBox="0 0 460 320"
                className="w-full h-auto max-h-[320px]"
                role="img"
                aria-label="Fluxograma do loop while mostrando condição testada antes de cada repetição"
              >
                <defs>
                  <marker
                    id="w-arrow-slate"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                  </marker>
                  <marker
                    id="w-arrow-emerald"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
                  </marker>
                  <marker
                    id="w-arrow-rose"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB7185" />
                  </marker>
                </defs>

                {/* Before loop */}
                <rect
                  x="130"
                  y="14"
                  width="160"
                  height="42"
                  rx="10"
                  fill="#0C4A6E"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
                <text
                  x="210"
                  y="32"
                  textAnchor="middle"
                  fill="#7DD3FC"
                  fontSize="11"
                  fontWeight="600"
                >
                  Antes do while
                </text>
                <text
                  x="210"
                  y="47"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                >
                  let i = 0
                </text>

                <line
                  x1="210"
                  y1="56"
                  x2="210"
                  y2="84"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#w-arrow-slate)"
                />

                {/* Condition */}
                <polygon
                  points="210,88 320,134 210,180 100,134"
                  fill="#451A03"
                  stroke="#FBBF24"
                  strokeWidth="2"
                />
                <text
                  x="210"
                  y="129"
                  textAnchor="middle"
                  fill="#FCD34D"
                  fontSize="11"
                  fontWeight="600"
                >
                  Enquanto for verdade
                </text>
                <text
                  x="210"
                  y="146"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="11.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  i &lt; lista.length?
                </text>

                {/* True path */}
                <line
                  x1="210"
                  y1="180"
                  x2="210"
                  y2="212"
                  stroke="#34D399"
                  strokeWidth="2"
                  markerEnd="url(#w-arrow-emerald)"
                />
                <text
                  x="222"
                  y="200"
                  fill="#34D399"
                  fontSize="11"
                  fontWeight="600"
                >
                  Verdadeiro
                </text>

                <rect
                  x="105"
                  y="216"
                  width="210"
                  height="64"
                  rx="10"
                  fill="#064E3B"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
                <text
                  x="210"
                  y="236"
                  textAnchor="middle"
                  fill="#6EE7B7"
                  fontSize="11"
                  fontWeight="600"
                >
                  Executa e atualiza contador
                </text>
                <text
                  x="210"
                  y="254"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="11.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  console.log(mochila[i]);
                </text>
                <text
                  x="210"
                  y="270"
                  textAnchor="middle"
                  fill="#DDD6FE"
                  fontSize="11.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  i++;
                </text>

                {/* Loop back arrow */}
                <path
                  d="M 105 248 L 54 248 L 54 134 L 96 134"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#w-arrow-slate)"
                />
                <text
                  x="44"
                  y="194"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10.5"
                  transform="rotate(-90 44 194)"
                >
                  Volta e testa de novo
                </text>

                {/* False exit */}
                <line
                  x1="320"
                  y1="134"
                  x2="370"
                  y2="134"
                  stroke="#FB7185"
                  strokeWidth="2"
                  markerEnd="url(#w-arrow-rose)"
                />
                <text
                  x="345"
                  y="124"
                  textAnchor="middle"
                  fill="#FB7185"
                  fontSize="11"
                  fontWeight="600"
                >
                  Falso
                </text>

                <rect
                  x="374"
                  y="112"
                  width="74"
                  height="44"
                  rx="22"
                  fill="#4C0519"
                  stroke="#FB7185"
                  strokeWidth="1.5"
                />
                <text
                  x="411"
                  y="138"
                  textAnchor="middle"
                  fill="#FECDD3"
                  fontSize="12"
                  fontWeight="600"
                >
                  Sai!
                </text>
              </svg>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
