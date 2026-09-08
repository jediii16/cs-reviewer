import { describe, expect, it } from 'vitest';
import { CalculatorError, evaluateExpression } from './evaluator';

describe('calculator evaluator', () => {
  it('honors precedence, parentheses, powers, and unary signs', () => {
    expect(evaluateExpression('2 + 3 * 4')).toBe(14);
    expect(evaluateExpression('(2 + 3)^2')).toBe(25);
    expect(evaluateExpression('-2^2')).toBe(-4);
  });
  it('supports course-friendly functions, constants, percent, and ans', () => {
    expect(evaluateExpression('sin(30)', { angleMode: 'deg' })).toBeCloseTo(0.5, 10);
    expect(evaluateExpression('sqrt(81) + log(100)')).toBe(11);
    expect(evaluateExpression('200 * 10%')).toBe(20);
    expect(evaluateExpression('ans / pi', { ans: Math.PI })).toBeCloseTo(1, 10);
  });
  it('reports safe errors and rejects arbitrary identifiers', () => {
    expect(() => evaluateExpression('1 / 0')).toThrowError(expect.objectContaining({ code: 'DIVIDE_BY_ZERO' }));
    expect(() => evaluateExpression('sqrt(-1)')).toThrowError(expect.objectContaining({ code: 'DOMAIN' }));
    expect(() => evaluateExpression('window.alert(1)')).toThrow(CalculatorError);
  });
});
