export type ModuleTab = 'conceito' | 'simulador' | 'exemplos' | 'desafios';

export interface SimulatorVariable {
  name: string;
  value: string;
  highlight?: boolean;
  type: 'number' | 'string' | 'boolean';
}

export interface SimulatorStep {
  stepNumber: number;
  activeLine: number;
  activeIndex: number | null;
  visitedIndices: number[];
  matchedIndices?: number[];
  variables: SimulatorVariable[];
  conditionCheck?: {
    expression: string;
    result: boolean;
  };
  consoleOutput: string[];
  explanation: string;
}

export interface SimulatorScenario {
  id: string;
  title: string;
  subtitle: string;
  loopType: 'for' | 'while';
  arrayName: string;
  arrayItems: (string | number)[];
  codeLines: string[];
  steps: SimulatorStep[];
}

export interface CodeLineAnnotated {
  lineNumber: number;
  code: string;
  comment: string;
}

export interface PracticalExample {
  id: string;
  title: string;
  summary: string;
  tag: string;
  goal: string;
  lines: CodeLineAnnotated[];
  presets: {
    id: string;
    label: string;
    inputArray: (string | number)[];
    searchTarget?: string;
  }[];
}

export interface MultipleChoiceChallenge {
  id: string;
  type: 'multiple-choice';
  number: number;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário';
  prompt: string;
  codeSnippet: string[];
  options: {
    id: string;
    label: string;
    code: string;
  }[];
  correctOptionId: string;
  commentedAnswer: string;
  tip: string;
}

export interface FillBlankSlot {
  id: string;
  placeholder: string;
  correctAnswers: string[];
  quickChoices: string[];
}

export interface FillBlankChallenge {
  id: string;
  type: 'fill-blank';
  number: number;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário';
  prompt: string;
  codeSegments: (string | { blankId: string })[];
  blanks: FillBlankSlot[];
  expectedOutput: string;
  commentedAnswer: string;
  tip: string;
}

export type ChallengeItem = MultipleChoiceChallenge | FillBlankChallenge;

export interface SavedProgress {
  solvedIds: string[];
  mcSelections: Record<string, string>;
  blankInputs: Record<string, Record<string, string>>;
}

