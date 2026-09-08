import type { TheoryModule } from '../../content/types';

export type CrosswordDirection = 'across' | 'down';
export interface CrosswordEntry { id: string; clue: string; answer: string; displayAnswer: string; module: TheoryModule; row: number; col: number; direction: CrosswordDirection; number: number }
export interface CrosswordCell { row: number; col: number; solution: string; number?: number; entryIds: string[] }
export interface CrosswordPuzzle { id: string; seed: number; title: string; width: number; height: number; entries: CrosswordEntry[]; cells: CrosswordCell[] }
