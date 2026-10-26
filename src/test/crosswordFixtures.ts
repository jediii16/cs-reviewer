import type { TheoryTerm } from '../content/types';

// Neutral test data keeps the crossword reusable without shipping old course lessons.
const groups = {
  fruit: ['Apple', 'Banana', 'Orange', 'Pear', 'Grape', 'Melon', 'Peach', 'Lemon'],
  garden: ['Carrot', 'Radish', 'Tomato', 'Pepper', 'Lettuce', 'Spinach', 'Parsley', 'Rosemary'],
  nature: ['River', 'Mountain', 'Forest', 'Ocean', 'Valley', 'Meadow', 'Desert', 'Waterfall'],
};
export const crosswordTerms: TheoryTerm[] = Object.entries(groups).flatMap(([module, words]) => words.map((word) => ({
  id: `fixture-${word.toLowerCase()}`, module, answer: word, displayAnswer: word, clue: `Sample clue for ${word.toLowerCase()}`,
})));
