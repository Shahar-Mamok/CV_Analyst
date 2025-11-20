import { SavedAnalysis } from '../types';

const STORAGE_KEY = 'agentic_cv_history';

export const saveAnalysisToStorage = (analysis: SavedAnalysis): void => {
  const existing = getSavedAnalyses();
  const updated = [analysis, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getSavedAnalyses = (): SavedAnalysis[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const deleteAnalysisFromStorage = (id: string): SavedAnalysis[] => {
  const existing = getSavedAnalyses();
  const updated = existing.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
