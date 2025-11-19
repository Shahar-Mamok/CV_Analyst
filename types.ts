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
  rawText: string; // Kept for debugging or raw view if needed
}