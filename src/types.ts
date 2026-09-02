export type TabType = 'ankitprep' | 'pareeksha' | 'books_practice';

export interface WebViewConfig {
  url: string;
  title: string;
  subtitle: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  questionHi?: string;
  options: string[];
  optionsHi?: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  explanationHi?: string;
  examTag?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  hindiMeaning: string;
  englishMeaning: string;
  exampleSentence?: string;
  synonyms?: string[];
  antonyms?: string[];
  originOrHint?: string;
  frequencyScore?: number;
  examTag?: string;
}

export interface OneLinerItem {
  id: string;
  category?: string;
  topic?: string;
  statementEn: string;
  statementHi: string;
  highlightKey?: string;
  examAppearance?: string;
}

export interface StudyModule {
  id: string;
  title: string;
  titleHindi?: string;
  authorOrCurator?: string;
  category?: string;
  badge?: string;
  description?: string;
  totalItemsCount?: number;
  readTimeEstimate?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  coverGradient?: string;
  iconName?: string;
  subSetsCount?: number;
  url?: string;
  link?: string;
  pdfUrl?: string;
  htmlContent?: string;
  rawHtmlContent?: string;
  vocabItems?: VocabularyItem[];
  practiceQuestions?: PracticeQuestion[];
  oneLiners?: OneLinerItem[];
}

