import { createSeededRandom } from '../../lib/seededRandom';
import { createEqualFrequencyBins, decimalScale, minMaxNormalize, smoothByBinBoundaries, smoothByBinMeans, zScore } from './math';

export type ProblemKind = 'equal-frequency' | 'bin-means' | 'bin-boundaries' | 'min-max' | 'z-score' | 'decimal-scaling';
export interface WorkedSolutionStep { label: string; expression: string; result: string }
export interface PreprocessingProblem { id: string; kind: ProblemKind; title: string; prompt: string; points: 5; expected: number[][]; acceptedValues?: number[][][]; precision: number; solution: WorkedSolutionStep[] }
export interface PracticeSet { id: string; seed: number; problems: PreprocessingProblem[]; totalPoints: 30 }

const shown = (value: number, precision = 3) => Number(value.toFixed(precision));
const binsText = (bins: number[][]) => bins.map((bin) => `[${bin.join(', ')}]`).join(' | ');

export function createPracticeSet(seed: number): PracticeSet {
  const random = createSeededRandom(seed); let value = 5 + Math.floor(random() * 5);
  const data = Array.from({ length: 12 }, () => value += 1 + Math.floor(random() * 7)); const depth = 4;
  const bins = createEqualFrequencyBins(data, depth); const means = smoothByBinMeans(data, depth).map((bin) => bin.map((x) => shown(x, 2))); const boundaries = smoothByBinBoundaries(data, depth);
  const boundaryChoices = bins.map((bin) => {
    const lower = bin[0]; const upper = bin[bin.length - 1];
    return bin.map((value) => {
      const lowerDistance = value - lower; const upperDistance = upper - value;
      if (lowerDistance === upperDistance && lower !== upper) return [lower, upper];
      return [lowerDistance < upperDistance ? lower : upper];
    });
  });
  const tieChoices = bins.flatMap((bin) => {
    const lower = bin[0]; const upper = bin[bin.length - 1];
    return bin.filter((item) => item - lower === upper - item && lower !== upper)
      .map((item) => `${item} → ${lower} or ${upper}`);
  });
  const oldMin = data[0]; const oldMax = data[data.length - 1];
  const minmax = data.map((item) => shown(minMaxNormalize(item, oldMin, oldMax, 0, 1), 4));
  const mean = shown(data.reduce((sum, item) => sum + item, 0) / data.length, 2);
  const sd = shown(Math.sqrt(data.reduce((sum, item) => sum + (item - mean) ** 2, 0) / data.length), 2);
  const zValues = data.map((item) => shown(zScore(item, mean, sd), 4));
  const decimals = data.slice(0, 8).map((item, index) => item * (index % 3 === 0 ? -23 : index + 7));
  const scaled = decimalScale(decimals); const scaledValues = scaled.values.map((item) => shown(item, 4));
  const problems: PreprocessingProblem[] = [
    { id: 'equal-frequency', kind: 'equal-frequency', title: 'Equal-frequency bins', points: 5, precision: 0, prompt: `Arrange this sorted dataset into bins with depth ${depth}: ${data.join(', ')}. Separate bins with |.`, expected: bins, solution: [{ label: 'Rule', expression: `${data.length} values ÷ ${depth} per bin`, result: `${bins.length} equal-frequency bins` }, { label: 'Group in order', expression: data.join(', '), result: binsText(bins) }, { label: 'Answer', expression: 'Keep every value once', result: binsText(bins) }] },
    { id: 'bin-means', kind: 'bin-means', title: 'Smoothing by bin means', points: 5, precision: 2, prompt: `Using bin depth ${depth}, replace each value with its bin mean: ${data.join(', ')}. Separate bins with |.`, expected: means, solution: [{ label: 'Create bins', expression: data.join(', '), result: binsText(bins) }, { label: 'Find each mean', expression: bins.map((bin) => `(${bin.join('+')})/${bin.length}`).join('; '), result: means.map((bin) => bin[0]).join(', ') }, { label: 'Replace values', expression: 'Repeat each bin mean', result: binsText(means) }] },
    { id: 'bin-boundaries', kind: 'bin-boundaries', title: 'Smoothing by bin boundaries', points: 5, precision: 0, prompt: `Using bin depth ${depth}, replace each value with its nearest bin boundary: ${data.join(', ')}. Either boundary is accepted for an exact tie.`, expected: boundaries, acceptedValues: boundaryChoices, solution: [{ label: 'Create bins', expression: data.join(', '), result: binsText(bins) }, { label: 'Compare distances', expression: 'Choose the nearer first or last value in each bin', result: 'Either boundary is valid when both distances are equal' }, ...(tieChoices.length ? [{ label: 'Tie choices', expression: 'Equal distance from both endpoints', result: tieChoices.join('; ') }] : []), { label: 'Replace values', expression: 'Apply the nearest boundary', result: binsText(boundaries) }] },
    { id: 'min-max', kind: 'min-max', title: 'Min-max normalization', points: 5, precision: 4, prompt: `Use min-max normalization to transform all values onto the range [0.0, 1.0]: ${data.join(', ')}. Round each answer to 4 decimal places and separate values with commas.`, expected: [minmax], solution: [{ label: 'Formula', expression: `(v − ${oldMin}) / (${oldMax} − ${oldMin})`, result: 'Apply this formula to every value' }, { label: 'Calculate', expression: data.map((item) => `(${item}−${oldMin})/${oldMax - oldMin}`).join(', '), result: minmax.join(', ') }, { label: 'Answer', expression: 'Keep the original value order', result: minmax.join(', ') }] },
    { id: 'z-score', kind: 'z-score', title: 'Z-score normalization', points: 5, precision: 4, prompt: `Use z-score normalization to transform all age values: ${data.join(', ')}. Use mean ${mean} and population standard deviation ${sd}. Round each answer to 4 decimal places and separate values with commas.`, expected: [zValues], solution: [{ label: 'Formula', expression: `(v − ${mean}) / ${sd}`, result: 'Apply this formula to every age value' }, { label: 'Calculate', expression: data.map((item) => `(${item}−${mean})/${sd}`).join(', '), result: zValues.join(', ') }, { label: 'Answer', expression: 'Keep the original value order', result: zValues.join(', ') }] },
    { id: 'decimal-scaling', kind: 'decimal-scaling', title: 'Decimal scaling', points: 5, precision: 4, prompt: `Use normalization by decimal scaling to transform all values: ${decimals.join(', ')}. Round each answer to 4 decimal places and separate values with commas.`, expected: [scaledValues], solution: [{ label: 'Find j', expression: `max |v| = ${Math.max(...decimals.map(Math.abs))}`, result: `j = ${scaled.exponent}` }, { label: 'Scale', expression: `v / 10^${scaled.exponent}`, result: scaledValues.join(', ') }, { label: 'Check', expression: 'Every absolute value must be less than 1', result: 'Condition satisfied' }] },
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
  const groupingMatters = problem.kind.includes('bin') || problem.kind === 'equal-frequency';
  if (!groupingMatters && problem.expected.flat().length > 1 && !answer.includes(',')) {
    return { correct: false, feedback: 'Separate every normalized value with a comma.' };
  }
  const parsed = parseAnswer(answer); if (!parsed) return { correct: false, feedback: 'Enter numbers separated by commas. Use | between bins.' };
  const flatExpected = problem.expected.flat(); const flatActual = parsed.flat();
  if (groupingMatters && parsed.some((group, index) => group.length !== problem.expected[index]?.length)) return { correct: false, feedback: 'Recheck how many values belong in each bin.' };
  if (flatActual.length !== flatExpected.length) return { correct: false, feedback: `Your answer needs ${flatExpected.length} values.` };
  const tolerance = problem.precision ? 0.5 * 10 ** -problem.precision : 1e-9;
  const accepted = problem.acceptedValues?.flat();
  const wrong = flatActual.findIndex((value, index) => {
    const validValues = accepted?.[index] ?? [flatExpected[index]];
    return validValues.every((valid) => Math.abs(value - valid) > tolerance);
  });
  return wrong < 0 ? { correct: true, feedback: 'Correct — your setup and calculation match.' } : { correct: false, feedback: `Recheck the value in position ${wrong + 1}.` };
}

export const getWorkedSolution = (problem: PreprocessingProblem) => problem.solution;
