import { Category, CATEGORIES, isValidAnswer, countAlternatives, getRandomAlternatives } from "../data/categoryWords";

// Letras que se excluyen del sorteo (muy pocas o ninguna palabra común por
// categoría): igual que se juega habitualmente al Basta en la mesa.
const EXCLUDED_LETTERS = new Set(["Ñ", "K", "Q", "W", "X"]);

const FULL_ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

export const PLAYABLE_LETTERS = FULL_ALPHABET.filter((letter) => !EXCLUDED_LETTERS.has(letter));

export function drawRandomLetter(): string {
  return PLAYABLE_LETTERS[Math.floor(Math.random() * PLAYABLE_LETTERS.length)];
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
  category: Category,
  letter: string,
  answer: string,
  alternativesCount: number,
  sampleAlternatives: string[]
): CategoryResult {
  if (!answer) {
    return { category, answer, status: "empty", points: POINTS_INVALID_OR_EMPTY, alternativesCount, sampleAlternatives };
  }
  const valid = isValidAnswer(category, letter, answer);
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
  letter: string,
  answers: Record<Category, string>,
  timeLeft: number,
  duration: number
): RoundResult {
  // "Cosa" valida contra el diccionario genérico (miles de alternativas
  // reales), pero mostrar ese número al lado de las 2-20 alternativas de
  // las otras categorías queda raro. Se limita al máximo real de las demás
  // categorías de la ronda, solo para el número que se muestra.
  const otherAlternatives = CATEGORIES.filter((c) => c !== "cosa").map((c) => countAlternatives(c, letter));
  const capForCosa = Math.max(...otherAlternatives);

  const results: CategoryResult[] = CATEGORIES.map((category) => {
    const answer = (answers[category] ?? "").trim();
    const alternativesCount = category === "cosa" ? capForCosa : countAlternatives(category, letter);
    const sampleAlternatives = getRandomAlternatives(category, letter, SAMPLE_ALTERNATIVES_COUNT);
    return buildResult(category, letter, answer, alternativesCount, sampleAlternatives);
  });

  // El bonus premia terminar rápido y bien: si alguna respuesta es inválida
  // (no vacía, pero incorrecta) no corresponde premiar la velocidad.
  const hasInvalidAnswer = results.some((r) => r.status === "invalid");
  const timeBonus = hasInvalidAnswer ? 0 : calculateTimeBonus(timeLeft, duration);
  const totalScore = results.reduce((sum, r) => sum + r.points, 0) + timeBonus;

  return { letter, results, timeBonus, totalScore };
}
