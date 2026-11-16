export type SecurityLevel = 
  | 'muito_fraca' 
  | 'fraca' 
  | 'razoavel' 
  | 'forte' 
  | 'muito_forte';

export type CriterionStatus = 'success' | 'warning' | 'danger';

export interface SecurityCriterion {
  id: string;
  label: string;
  status: CriterionStatus;
  statusLabel: string;
  details: string;
  category: 'length' | 'variety' | 'predictability' | 'patterns' | 'personal';
}

export interface CrackTimeEstimate {
  display: string;
  onlineDisplay: string;
  category: 
    | 'Instantaneamente'
    | 'Segundos'
    | 'Minutos'
    | 'Horas'
    | 'Dias'
    | 'Meses'
    | 'Anos'
    | 'Centenas de anos'
    | 'Milhares de anos'
    | 'Milhões de anos'
    | 'Bilhões de anos';
  entropyBits: number;
  guessesPerSecond: string;
  details: string;
  relativeScore: number; // 0 to 100
}

export interface PasswordAnalysisResult {
  passwordLength: number;
  score: number; // 0 to 100
  level: SecurityLevel;
  levelTitle: string;
  levelColor: string; // Tailwind color class
  levelBg: string;
  levelDescription: string;
  criteria: SecurityCriterion[];
  whatYouDidWell: string[];
  whatToImprove: string[];
  crackTime: CrackTimeEstimate;
  detectedFlaws: string[];
  isPassphrase: boolean;
}

export interface PasswordComparisonOption {
  id: string;
  password: string;
  label: string;
  type: string;
  entropyBits: number;
  crackTime: string;
  isBest: boolean;
  explanation: string;
  points: string[];
}

export interface ComparisonScenario {
  id: string;
  title: string;
  subtitle: string;
  options: PasswordComparisonOption[];
  educationalTakeaway: string;
}

export interface QuizChallenge {
  id: string;
  question: string;
  type: 'choice' | 'flaw-hunter';
  targetPassword?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  tips: string;
}
