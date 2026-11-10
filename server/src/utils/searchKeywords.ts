const MAX_PREFIX_LENGTH = 15;
const WORD_SEPARATOR = /[^\p{L}\p{N}]+/u;

export const tokenize = (text: string): string[] =>
  text.toLowerCase().split(WORD_SEPARATOR).filter(Boolean);

// Stored on each document: every prefix of every word, so typing "neuro" finds "Neurology" through
// an ordinary multikey index (a MongoDB text index only matches whole words).
export const buildSearchKeywords = (...values: (string | undefined)[]): string[] => {
  const keywords = new Set<string>();
  for (const word of values.flatMap((value) => tokenize(value ?? ''))) {
    keywords.add(word);
    for (let length = 1; length <= Math.min(word.length, MAX_PREFIX_LENGTH); length += 1) {
      keywords.add(word.slice(0, length));
    }
  }
  return [...keywords];
};

// Every typed word must be the start of some word in the document (AND semantics).
export const buildKeywordFilter = (query: string) => {
  const tokens = [...new Set(tokenize(query).map((token) => token.slice(0, MAX_PREFIX_LENGTH)))];
  return { searchKeywords: { $all: tokens } };
};
