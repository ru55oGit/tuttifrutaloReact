import rawWordsEs from "an-array-of-spanish-words";
import rawWordsEn from "an-array-of-english-words";
import { PT_WORDS_FILTERED } from "./ptWordsFiltered";
import { Category, CATEGORIES } from "./types";
import { SupportedLanguage } from "../../i18n/translations";
import { PAIS_WORDS } from "./pais";
import { COLOR_WORDS } from "./color";
import { FRUTA_WORDS } from "./fruta";
import { ANIMAL_WORDS } from "./animal";
import { NOMBRE_WORDS } from "./nombre";
import { PROFESION_WORDS } from "./profesion";
import { PAIS_WORDS_EN } from "./pais.en";
import { COLOR_WORDS_EN } from "./color.en";
import { FRUTA_WORDS_EN } from "./fruta.en";
import { ANIMAL_WORDS_EN } from "./animal.en";
import { NOMBRE_WORDS_EN } from "./nombre.en";
import { PROFESION_WORDS_EN } from "./profesion.en";
import { PAIS_WORDS_PT } from "./pais.pt";
import { COLOR_WORDS_PT } from "./color.pt";
import { FRUTA_WORDS_PT } from "./fruta.pt";
import { ANIMAL_WORDS_PT } from "./animal.pt";
import { NOMBRE_WORDS_PT } from "./nombre.pt";
import { PROFESION_WORDS_PT } from "./profesion.pt";

export type { Category } from "./types";
export { CATEGORIES } from "./types";

// "Cosa" es una categoría abierta (cualquier objeto vale) para la que una
// lista curada a mano nunca alcanza — casi cualquier sustantivo real es una
// respuesta válida. Por eso se valida contra el diccionario genérico del
// idioma activo, en vez de con una lista por letra.
const CATEGORY_WORDS_BY_LANG: Record<SupportedLanguage, Partial<Record<Category, Record<string, string[]>>>> = {
  es: {
    pais: PAIS_WORDS,
    color: COLOR_WORDS,
    fruta: FRUTA_WORDS,
    animal: ANIMAL_WORDS,
    nombre: NOMBRE_WORDS,
    profesion: PROFESION_WORDS,
  },
  en: {
    pais: PAIS_WORDS_EN,
    color: COLOR_WORDS_EN,
    fruta: FRUTA_WORDS_EN,
    animal: ANIMAL_WORDS_EN,
    nombre: NOMBRE_WORDS_EN,
    profesion: PROFESION_WORDS_EN,
  },
  pt: {
    pais: PAIS_WORDS_PT,
    color: COLOR_WORDS_PT,
    fruta: FRUTA_WORDS_PT,
    animal: ANIMAL_WORDS_PT,
    nombre: NOMBRE_WORDS_PT,
    profesion: PROFESION_WORDS_PT,
  },
};

// Mapa explícito en vez de NFD + strip de diacríticos: la Ñ no es una "N con
// tilde" que haya que aplanar, es una letra propia del español (mismo criterio
// que sopaloReact/src/utils/wordSearchGrid.ts).
const ACCENT_FOLD: Record<string, string> = {
  Á: "A", À: "A", Â: "A", Ä: "A", Ã: "A",
  É: "E", È: "E", Ê: "E", Ë: "E",
  Í: "I", Ì: "I", Î: "I", Ï: "I",
  Ó: "O", Ò: "O", Ô: "O", Ö: "O", Õ: "O",
  Ú: "U", Ù: "U", Û: "U", Ü: "U",
  // Ç no es una letra propia en portugués (a diferencia de la Ñ en español,
  // ver comentario arriba) — es una variante de C que sí hay que aplanar.
  Ç: "C",
};

export function normalizeAnswer(word: string): string {
  const upper = word.toUpperCase().trim().replace(/\s+/g, " ");
  return [...upper].map((ch) => ACCENT_FOLD[ch] ?? ch).join("");
}

const VALIDATION_INDEX_BY_LANG: Record<SupportedLanguage, Map<string, Set<string>>> = {
  es: new Map(),
  en: new Map(),
  pt: new Map(),
};

for (const lang of Object.keys(CATEGORY_WORDS_BY_LANG) as SupportedLanguage[]) {
  const categoryWords = CATEGORY_WORDS_BY_LANG[lang];
  const index = VALIDATION_INDEX_BY_LANG[lang];
  for (const category of CATEGORIES) {
    const words = categoryWords[category];
    if (!words) continue;
    for (const [letter, entries] of Object.entries(words)) {
      index.set(`${category}:${letter}`, new Set(entries.map(normalizeAnswer)));
    }
  }
}

// Palabras comunes que faltan en an-array-of-spanish-words/an-array-of-
// english-words (mismo criterio que enganchadoReact/letrisReact/
// viborealoReact para su propio diccionario).
const EXTRA_GENERIC_WORDS: Record<SupportedLanguage, string[]> = {
  es: ["wifi", "kiwi"],
  en: [],
  pt: [],
};

function buildGenericWordsByLetter(rawWords: string[], extra: string[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const word of [...rawWords, ...extra]) {
    const normalized = normalizeAnswer(word);
    if (normalized.length < 3) continue;
    const letter = normalized[0];
    if (!map.has(letter)) map.set(letter, new Set());
    map.get(letter)!.add(normalized);
  }
  return map;
}

const GENERIC_WORDS_BY_LANG: Record<SupportedLanguage, Map<string, Set<string>>> = {
  es: buildGenericWordsByLetter(rawWordsEs as unknown as string[], EXTRA_GENERIC_WORDS.es),
  en: buildGenericWordsByLetter(rawWordsEn as unknown as string[], EXTRA_GENERIC_WORDS.en),
  // PT_WORDS_FILTERED ya es la lista curada contra Hunspell pt-BR (ver su
  // propio header) — no usamos el paquete npm an-array-of-portuguese-words
  // crudo acá a propósito, resultó tener muchísimo ruido (ver commit que
  // reemplazó el diccionario de Viborealo/Letris/Enganchalo en portugués).
  pt: buildGenericWordsByLetter(PT_WORDS_FILTERED, EXTRA_GENERIC_WORDS.pt),
};

export function isValidAnswer(lang: SupportedLanguage, category: Category, letter: string, answer: string): boolean {
  if (!answer.trim()) return false;
  const normalizedLetter = letter.toUpperCase();
  const normalizedAnswer = normalizeAnswer(answer);
  if (category === "cosa") {
    return GENERIC_WORDS_BY_LANG[lang].get(normalizedLetter)?.has(normalizedAnswer) ?? false;
  }
  const set = VALIDATION_INDEX_BY_LANG[lang].get(`${category}:${normalizedLetter}`);
  if (!set) return false;
  return set.has(normalizedAnswer);
}

export function countAlternatives(lang: SupportedLanguage, category: Category, letter: string): number {
  const normalizedLetter = letter.toUpperCase();
  if (category === "cosa") {
    return GENERIC_WORDS_BY_LANG[lang].get(normalizedLetter)?.size ?? 0;
  }
  return VALIDATION_INDEX_BY_LANG[lang].get(`${category}:${normalizedLetter}`)?.size ?? 0;
}

export function getRandomAlternatives(lang: SupportedLanguage, category: Category, letter: string, count: number): string[] {
  const normalizedLetter = letter.toUpperCase();
  const set = category === "cosa"
    ? GENERIC_WORDS_BY_LANG[lang].get(normalizedLetter)
    : VALIDATION_INDEX_BY_LANG[lang].get(`${category}:${normalizedLetter}`);
  if (!set) return [];

  const shuffled = [...set];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
