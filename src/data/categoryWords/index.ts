import rawWords from "an-array-of-spanish-words";
import { Category, CATEGORIES } from "./types";
import { PAIS_WORDS } from "./pais";
import { COLOR_WORDS } from "./color";
import { FRUTA_WORDS } from "./fruta";
import { ANIMAL_WORDS } from "./animal";
import { NOMBRE_WORDS } from "./nombre";
import { PROFESION_WORDS } from "./profesion";

export type { Category } from "./types";
export { CATEGORIES } from "./types";

// "Cosa" es una categoría abierta (cualquier objeto vale) para la que una
// lista curada a mano nunca alcanza — casi cualquier sustantivo real es una
// respuesta válida. Por eso se valida contra el mismo diccionario genérico
// de español que usa enganchadoReact, en vez de con una lista por letra.
const CATEGORY_WORDS: Partial<Record<Category, Record<string, string[]>>> = {
  pais: PAIS_WORDS,
  color: COLOR_WORDS,
  fruta: FRUTA_WORDS,
  animal: ANIMAL_WORDS,
  nombre: NOMBRE_WORDS,
  profesion: PROFESION_WORDS,
};

// Mapa explícito en vez de NFD + strip de diacríticos: la Ñ no es una "N con
// tilde" que haya que aplanar, es una letra propia del español (mismo criterio
// que sopaloReact/src/utils/wordSearchGrid.ts).
const ACCENT_FOLD: Record<string, string> = {
  Á: "A", À: "A", Â: "A", Ä: "A",
  É: "E", È: "E", Ê: "E", Ë: "E",
  Í: "I", Ì: "I", Î: "I", Ï: "I",
  Ó: "O", Ò: "O", Ô: "O", Ö: "O",
  Ú: "U", Ù: "U", Û: "U", Ü: "U",
};

export function normalizeAnswer(word: string): string {
  const upper = word.toUpperCase().trim().replace(/\s+/g, " ");
  return [...upper].map((ch) => ACCENT_FOLD[ch] ?? ch).join("");
}

const VALIDATION_INDEX = new Map<string, Set<string>>();

for (const category of CATEGORIES) {
  const words = CATEGORY_WORDS[category];
  if (!words) continue;
  for (const [letter, entries] of Object.entries(words)) {
    VALIDATION_INDEX.set(`${category}:${letter}`, new Set(entries.map(normalizeAnswer)));
  }
}

// Palabras comunes que faltan en an-array-of-spanish-words (mismo criterio
// que enganchadoReact/letrisReact/viborealoReact para su propio diccionario).
const EXTRA_GENERIC_WORDS = ["wifi"];

const GENERIC_WORDS_BY_LETTER = new Map<string, Set<string>>();
for (const word of [...(rawWords as unknown as string[]), ...EXTRA_GENERIC_WORDS]) {
  const normalized = normalizeAnswer(word);
  if (normalized.length < 3) continue;
  const letter = normalized[0];
  if (!GENERIC_WORDS_BY_LETTER.has(letter)) GENERIC_WORDS_BY_LETTER.set(letter, new Set());
  GENERIC_WORDS_BY_LETTER.get(letter)!.add(normalized);
}

export function isValidAnswer(category: Category, letter: string, answer: string): boolean {
  if (!answer.trim()) return false;
  const normalizedLetter = letter.toUpperCase();
  const normalizedAnswer = normalizeAnswer(answer);
  if (category === "cosa") {
    return GENERIC_WORDS_BY_LETTER.get(normalizedLetter)?.has(normalizedAnswer) ?? false;
  }
  const set = VALIDATION_INDEX.get(`${category}:${normalizedLetter}`);
  if (!set) return false;
  return set.has(normalizedAnswer);
}

export function countAlternatives(category: Category, letter: string): number {
  const normalizedLetter = letter.toUpperCase();
  if (category === "cosa") {
    return GENERIC_WORDS_BY_LETTER.get(normalizedLetter)?.size ?? 0;
  }
  return VALIDATION_INDEX.get(`${category}:${normalizedLetter}`)?.size ?? 0;
}

export function getRandomAlternatives(category: Category, letter: string, count: number): string[] {
  const normalizedLetter = letter.toUpperCase();
  const set = category === "cosa"
    ? GENERIC_WORDS_BY_LETTER.get(normalizedLetter)
    : VALIDATION_INDEX.get(`${category}:${normalizedLetter}`);
  if (!set) return [];

  const shuffled = [...set];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
