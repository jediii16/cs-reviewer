import { createSeededRandom } from '../../lib/seededRandom';
import { createEqualFrequencyBins, decimalScale, minMaxNormalize, smoothByBinBoundaries, smoothByBinMeans, zScore } from './math';

export type ProblemKind = 'equal-frequency' | 'bin-means' | 'bin-boundaries' | 'min-max' | 'z-score' | 'decimal-scaling';
export interface WorkedSolutionStep { label: string; expression: string; result: string }
export interface PreprocessingProblem { id: string; kind: ProblemKind; title: string; prompt: string; points: 5; expected: number[][]; precision: number; solution: WorkedSolutionStep[] }
export interface PracticeSet { id: string; seed: number; problems: PreprocessingProblem[]; totalPoints: 30 }

const shown = (value: number, precision = 3) => Number(value.toFixed(precision));
const binsText = (bins: number[][]) => bins.map((bin) => `[${bin.join(', ')}]`).join(' | ');

export function createPracticeSet(seed: number): PracticeSet {
  const random = createSeededRandom(seed); let value = 5 + Math.floor(random() * 5);
  const data = Array.from({ length: 12 }, () => value += 1 + Math.floor(random() * 7)); const depth = 4;
  const bins = createEqualFrequencyBins(data, depth); const means = smoothByBinMeans(data, depth).map((bin) => bin.map((x) => shown(x, 2))); const boundaries = smoothByBinBoundaries(data, depth);
  const oldMin = data[0]; const oldMax = data[data.length - 1]; const target = data[7]; const minmax = shown(minMaxNormalize(target, oldMin, oldMax, 0, 1));
  const mean = 54; const sd = 16; const zValue = 74; const z = shown(zScore(zValue, mean, sd));
  const decimals = [-986, 547, 917]; const scaled = decimalScale(decimals);
  const problems: PreprocessingProblem[] = [
    { id: 'equal-frequency', kind: 'equal-frequency', title: 'Equal-frequency bins', points: 5, precision: 0, prompt: `Arrange this sorted dataset into bins with depth ${depth}: ${data.join(', ')}. Separate bins with |.`, expected: bins, solution: [{ label: 'Rule', expression: `${data.length} values ÷ ${depth} per bin`, result: `${bins.length} equal-frequency bins` }, { label: 'Group in order', expression: data.join(', '), result: binsText(bins) }, { label: 'Answer', expression: 'Keep every value once', result: binsText(bins) }] },
    { id: 'bin-means', kind: 'bin-means', title: 'Smoothing by bin means', points: 5, precision: 2, prompt: `Using bin depth ${depth}, replace each value with its bin mean: ${data.join(', ')}. Separate bins with |.`, expected: means, solution: [{ label: 'Create bins', expression: data.join(', '), result: binsText(bins) }, { label: 'Find each mean', expression: bins.map((bin) => `(${bin.join('+')})/${bin.length}`).join('; '), result: means.map((bin) => bin[0]).join(', ') }, { label: 'Replace values', expression: 'Repeat each bin mean', result: binsText(means) }] },
    { id: 'bin-boundaries', kind: 'bin-boundaries', title: 'Smoothing by bin boundaries', points: 5, precision: 0, prompt: `Using bin depth ${depth}, replace each value with its nearest bin boundary: ${data.join(', ')}. Ties go to the lower boundary.`, expected: boundaries, solution: [{ label: 'Create bins', expression: data.join(', '), result: binsText(bins) }, { label: 'Compare distances', expression: 'Choose the nearer first or last value in each bin', result: 'Exact ties use the lower boundary' }, { label: 'Replace values', expression: 'Apply the nearest boundary', result: binsText(boundaries) }] },
    { id: 'min-max', kind: 'min-max', title: 'Min-max normalization', points: 5, precision: 3, prompt: `Normalize ${target} from the range [${oldMin}, ${oldMax}] to [0, 1]. Round to 3 decimals.`, expected: [[minmax]], solution: [{ label: 'Formula', expression: `(v − min) / (max − min)`, result: `(${target} − ${oldMin}) / (${oldMax} − ${oldMin})` }, { label: 'Calculate', expression: `${target - oldMin} / ${oldMax - oldMin}`, result: String(minMaxNormalize(target, oldMin, oldMax, 0, 1)) }, { label: 'Round', expression: '3 decimal places', result: String(minmax) }] },
    { id: 'z-score', kind: 'z-score', title: 'Z-score normalization', points: 5, precision: 3, prompt: `Normalize ${zValue} using mean ${mean} and population standard deviation ${sd}. Round to 3 decimals.`, expected: [[z]], solution: [{ label: 'Formula', expression: `(v − mean) / standard deviation`, result: `(${zValue} − ${mean}) / ${sd}` }, { label: 'Subtract', expression: `${zValue} − ${mean}`, result: String(zValue - mean) }, { label: 'Divide', expression: `${zValue - mean} / ${sd}`, result: String(z) }] },
    { id: 'decimal-scaling', kind: 'decimal-scaling', title: 'Decimal scaling', points: 5, precision: 3, prompt: `Normalize every value by decimal scaling: ${decimals.join(', ')}.`, expected: [scaled.values], solution: [{ label: 'Find j', expression: `max |v| = ${Math.max(...decimals.map(Math.abs))}`, result: `j = ${scaled.exponent}` }, { label: 'Scale', expression: `v / 10^${scaled.exponent}`, result: scaled.values.join(', ') }, { label: 'Check', expression: 'Every absolute value must be less than 1', result: 'Condition satisfied' }] },
  ];
  return { id: `practice-${seed}`, seed, problems, totalPoints: 30 };
}

function parseAnswer(input: string): number[][] | null {
  const cleaned = input.replace(/[()[\]]/g, ' ').trim(); if (!cleaned) return null;
  const groups = cleaned.split(/\||;|\n/).map((group) => group.trim()).filter(Boolean);
  const parsed = groups.map((group) => group.split(/[\s,]+/).filter(Boolean).map(Number));
  return parsed.some((group) => group.some((value) => !Number.isFinite(value))) ? null : parsed;
}

export function gradeProblem(problem: PreprocessingProblem, answer: string) {
  const parsed = parseAnswer(answer); if (!parsed) return { correct: false, feedback: 'Enter numbers separated by commas. Use | between bins.' };
  const flatExpected = problem.expected.flat(); const flatActual = parsed.flat(); const groupingMatters = problem.kind.includes('bin') || problem.kind === 'equal-frequency';
  if (groupingMatters && parsed.some((group, index) => group.length !== problem.expected[index]?.length)) return { correct: false, feedback: 'Recheck how many values belong in each bin.' };
  if (flatActual.length !== flatExpected.length) return { correct: false, feedback: `Your answer needs ${flatExpected.length} values.` };
  const tolerance = problem.precision ? 0.5 * 10 ** -problem.precision : 1e-9;
  const wrong = flatActual.findIndex((value, index) => Math.abs(value - flatExpected[index]) > tolerance);
  return wrong < 0 ? { correct: true, feedback: 'Correct — your setup and calculation match.' } : { correct: false, feedback: `Recheck the value in position ${wrong + 1}.` };
}

export const getWorkedSolution = (problem: PreprocessingProblem) => problem.solution;
