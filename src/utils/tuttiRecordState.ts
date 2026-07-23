import { SupportedLanguage } from "../i18n/translations";

const STORE_KEY = "tuttifrutalo_best_score_v1";

function storeKey(lang: SupportedLanguage): string {
  return `${STORE_KEY}_${lang}`;
}

export interface BestScore {
  score: number;
  letter: string;
  date: string;
  words: string[];
}

function load(lang: SupportedLanguage): BestScore | null {
  try {
    const raw = localStorage.getItem(storeKey(lang));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BestScore;
    // Compatibilidad con récords guardados antes de sumar "words" al store.
    return { ...parsed, words: parsed.words ?? [] };
  } catch {
    return null;
  }
}

export function getBestScore(lang: SupportedLanguage): BestScore | null {
  return load(lang);
}

export function maybeSaveBestScore(lang: SupportedLanguage, score: number, letter: string, words: string[]): BestScore | null {
  const current = load(lang);
  if (current && score <= current.score) return null;

  const isoDate = new Date().toISOString().slice(0, 10);
  const next: BestScore = { score, letter, date: isoDate, words };
  localStorage.setItem(storeKey(lang), JSON.stringify(next));
  return next;
}
