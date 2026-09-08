import { describe, expect, it } from 'vitest';
import { createEqualFrequencyBins, decimalScale, minMaxNormalize, smoothByBinBoundaries, smoothByBinMeans, zScore } from './math';

describe('preprocessing math', () => {
  it('forms equal-frequency bins and keeps a remainder', () => {
    expect(createEqualFrequencyBins([9, 12, 13, 15, 16, 19], 4)).toEqual([[9, 12, 13, 15], [16, 19]]);
  });
  it('smooths by bin means and boundaries', () => {
    expect(smoothByBinMeans([4, 8, 15, 21, 21, 24], 3)).toEqual([[9, 9, 9], [22, 22, 22]]);
    expect(smoothByBinBoundaries([4, 8, 12], 3)).toEqual([[4, 4, 12]]);
  });
  it('normalizes with all three course formulas', () => {
    expect(minMaxNormalize(73_600, 12_000, 98_000, 0, 1)).toBeCloseTo(0.716279, 6);
    expect(zScore(73_600, 54_000, 16_000)).toBeCloseTo(1.225, 6);
    expect(decimalScale([-986, 547, 917])).toEqual({ exponent: 3, values: [-0.986, 0.547, 0.917] });
  });
  it('rejects undefined operations', () => {
    expect(() => minMaxNormalize(1, 2, 2, 0, 1)).toThrow(RangeError);
    expect(() => zScore(1, 1, 0)).toThrow(RangeError);
    expect(() => createEqualFrequencyBins([1], 0)).toThrow(RangeError);
  });
});
