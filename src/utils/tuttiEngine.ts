import { Category, CATEGORIES, isValidAnswer, countAlternatives, getRandomAlternatives } from "../data/categoryWords";
import { SupportedLanguage } from "../i18n/translations";

// Letras que se excluyen del sorteo (muy pocas o ninguna palabra común por
// categoría): igual que se juega habitualmente al Basta en la mesa. En
// inglés el reparto de letras débiles es distinto al español (no hay Ñ, y
// K/Q/W sí tienen cobertura razonable en la mayoría de las categorías —
// ver pais.en.ts/color.en.ts/etc. — pero X prácticamente no tiene nada en
// ninguna categoría curada). En portugués tampoco hay Ñ; K/Q/Z tienen
// cobertura real en 3 de las 6 categorías curadas (ver pais.pt.ts/
// fruta.pt.ts/animal.pt.ts/profesion.pt.ts) así que quedan jugables, pero
// W/Y solo aparecen en nombre.pt.ts (3 y 2 palabras respectivamente) y X
// no tiene ninguna palabra real en ninguna categoría.
const EXCLUDED_LETTERS: Record<SupportedLanguage, Set<string>> = {
  es: new Set(["Ñ", "K", "Q", "W", "X"]),
  en: new Set(["X"]),
  pt: new Set(["W", "X", "Y"]),
};

const FULL_ALPHABET_ES = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const FULL_ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FULL_ALPHABET_PT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function getPlayableLetters(lang: SupportedLanguage): string[] {
  const alphabet = lang === "es" ? FULL_ALPHABET_ES : lang === "pt" ? FULL_ALPHABET_PT : FULL_ALPHABET_EN;
  return alphabet.filter((letter) => !EXCLUDED_LETTERS[lang].has(letter));
}

// Mantenido para quien ya lo use asumiendo español (el selector de letra en
// game.tsx pide la lista por idioma con getPlayableLetters).
export const PLAYABLE_LETTERS = getPlayableLetters("es");

export function drawRandomLetter(lang: SupportedLanguage = "es"): string {
  const letters = getPlayableLetters(lang);
  return letters[Math.floor(Math.random() * letters.length)];
}

export type AnswerStatus = "valid" | "invalid" | "empty";

const SAMPLE_ALTERNATIVES_COUNT = 3;

export interface CategoryResult {
  category: Category;
  answer: string;
  status: AnswerStatus;
  points: number;
  alternativesCount: number;
  sampleAlternatives: string[];
}

export interface RoundResult {
  letter: string;
  results: CategoryResult[];
  timeBonus: number;
  totalScore: number;
}

const POINTS_VALID = 10;
const POINTS_INVALID_OR_EMPTY = 0;

// Bonus por terminar antes de tiempo. Se calcula como proporción del tiempo
// restante (no segundos crudos) para que sea igual de "difícil" de lograr
// con cualquiera de las duraciones elegibles (60s o 90s): apretar BASTA a
// mitad de reloj da el mismo bonus con cualquier duración.
export const MAX_TIME_BONUS = 30;

export function calculateTimeBonus(timeLeft: number, duration: number): number {
  if (duration <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, timeLeft / duration));
  return Math.round(ratio * MAX_TIME_BONUS);
}

function buildResult(
  lang: SupportedLanguage,
  category: Category,
  letter: string,
  answer: string,
  alternativesCount: number,
  sampleAlternatives: string[]
): CategoryResult {
  if (!answer) {
    return { category, answer, status: "empty", points: POINTS_INVALID_OR_EMPTY, alternativesCount, sampleAlternatives };
  }
  const valid = isValidAnswer(lang, category, letter, answer);
  // +1 punto extra por cada letra de la palabra usada, además de los puntos base.
  const points = valid ? POINTS_VALID + answer.length : POINTS_INVALID_OR_EMPTY;
  return {
    category,
    answer,
    status: valid ? "valid" : "invalid",
    points,
    alternativesCount,
    sampleAlternatives,
  };
}

export function scoreRound(
  lang: SupportedLanguage,
  letter: string,
  answers: Record<Category, string>,
  timeLeft: number,
  duration: number
): RoundResult {
  // "Cosa" valida contra el diccionario genérico (miles de alternativas
  // reales), pero mostrar ese número al lado de las 2-20 alternativas de
  // las otras categorías queda raro. Se limita al máximo real de las demás
  // categorías de la ronda, solo para el número que se muestra.
  const otherAlternatives = CATEGORIES.filter((c) => c !== "cosa").map((c) => countAlternatives(lang, c, letter));
  const capForCosa = Math.max(...otherAlternatives);

  const results: CategoryResult[] = CATEGORIES.map((category) => {
    const answer = (answers[category] ?? "").trim();
    const alternativesCount = category === "cosa" ? capForCosa : countAlternatives(lang, category, letter);
    const sampleAlternatives = getRandomAlternatives(lang, category, letter, SAMPLE_ALTERNATIVES_COUNT);
    return buildResult(lang, category, letter, answer, alternativesCount, sampleAlternatives);
  });

  // El bonus premia terminar rápido y completo: si alguna respuesta es
  // inválida (no vacía, pero incorrecta) o directamente quedó vacía (BASTA
  // apretado sin completar las 7 categorías), no corresponde premiar la
  // velocidad.
  const hasInvalidAnswer = results.some((r) => r.status === "invalid" || r.status === "empty");
  const timeBonus = hasInvalidAnswer ? 0 : calculateTimeBonus(timeLeft, duration);
  const totalScore = results.reduce((sum, r) => sum + r.points, 0) + timeBonus;

  return { letter, results, timeBonus, totalScore };
}
