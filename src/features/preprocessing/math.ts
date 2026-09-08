function assertFinite(values: readonly number[]) {
  if (!values.every(Number.isFinite)) throw new RangeError('Values must be finite numbers.');
}

export function createEqualFrequencyBins(values: readonly number[], depth: number): number[][] {
  assertFinite(values);
  if (!Number.isInteger(depth) || depth <= 0) throw new RangeError('Bin depth must be a positive integer.');
  const sorted = [...values].sort((a, b) => a - b);
  return Array.from({ length: Math.ceil(sorted.length / depth) }, (_, index) => sorted.slice(index * depth, (index + 1) * depth));
}

export function smoothByBinMeans(values: readonly number[], depth: number): number[][] {
  return createEqualFrequencyBins(values, depth).map((bin) => {
    const mean = bin.reduce((sum, value) => sum + value, 0) / bin.length;
    return bin.map(() => mean);
  });
}

export function smoothByBinBoundaries(values: readonly number[], depth: number): number[][] {
  return createEqualFrequencyBins(values, depth).map((bin) => {
    const lower = bin[0]; const upper = bin[bin.length - 1];
    return bin.map((value) => value - lower <= upper - value ? lower : upper);
  });
}

export function minMaxNormalize(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
  assertFinite([value, oldMin, oldMax, newMin, newMax]);
  if (oldMin === oldMax) throw new RangeError('Source range cannot be zero.');
  return newMin + ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin);
}

export function zScore(value: number, mean: number, standardDeviation: number): number {
  assertFinite([value, mean, standardDeviation]);
  if (standardDeviation === 0) throw new RangeError('Standard deviation cannot be zero.');
  return (value - mean) / standardDeviation;
}

export function decimalScale(values: readonly number[]) {
  assertFinite(values);
  if (values.length === 0) throw new RangeError('At least one value is required.');
  const maxAbsolute = Math.max(...values.map(Math.abs));
  const exponent = maxAbsolute === 0 ? 0 : Math.floor(Math.log10(maxAbsolute)) + 1;
  const divisor = 10 ** exponent;
  return { exponent, values: values.map((value) => value / divisor) };
}
