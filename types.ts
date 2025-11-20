export enum AgentStatus {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  EXTRACTING = 'EXTRACTING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface InterviewQuestion {
  question: string;
  context: string; // Why this was asked (e.g. "You lack React experience")
  sampleAnswer: string;
}

export interface KeywordRecommendation {
  keyword: string;
  actionType: 'SUMMARY_INJECTION' | 'PROJECT_ADDITION' | 'WORD_REPLACEMENT';
  specificSuggestion: string;
}

export interface AnalysisResult {
  matchScore: number;
  subScores: {
    technical: number;
    softSkills: number;
    experience: number;
  };
  criticalAdjustments: string[];
  shortenRemove: string[];
  technicalGuidance: string[];
  improvedSummary: string;
  interviewPrep: InterviewQuestion[];
  keywordRecommendations: KeywordRecommendation[];
  rawText: string; // Kept for debugging or raw view if needed
}

export interface SavedAnalysis {
  id: string;
  category: string; // The "Folder" name (e.g. Job Title)
  title: string; // The specific version/note
  date: string; // ISO string
  cvText: string;
  jobText: string;
  result: AnalysisResult;
}