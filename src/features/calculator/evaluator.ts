export type AngleMode = 'deg' | 'rad';
type ErrorCode = 'SYNTAX' | 'DIVIDE_BY_ZERO' | 'DOMAIN' | 'UNSUPPORTED';

export class CalculatorError extends Error {
  constructor(public code: ErrorCode, message: string) { super(message); this.name = 'CalculatorError'; }
}

type Token = { type: 'number'; value: number } | { type: 'name' | 'operator' | 'paren'; value: string };

function tokenize(source: string): Token[] {
  const tokens: Token[] = []; let index = 0;
  while (index < source.length) {
    const rest = source.slice(index); const space = rest.match(/^\s+/);
    if (space) { index += space[0].length; continue; }
    const number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
    if (number) { tokens.push({ type: 'number', value: Number(number[0]) }); index += number[0].length; continue; }
    const name = rest.match(/^[a-z]+/i);
    if (name) { tokens.push({ type: 'name', value: name[0].toLowerCase() }); index += name[0].length; continue; }
    const char = source[index];
    if ('+-*/^%'.includes(char)) tokens.push({ type: 'operator', value: char });
    else if ('()'.includes(char)) tokens.push({ type: 'paren', value: char });
    else throw new CalculatorError('UNSUPPORTED', `Unsupported character: ${char}`);
    index += 1;
  }
  return tokens;
}

export function evaluateExpression(expression: string, options: { angleMode?: AngleMode; ans?: number } = {}): number {
  const tokens = tokenize(expression); let position = 0; const angleMode = options.angleMode ?? 'deg';
  const peek = () => tokens[position]; const take = () => tokens[position++];
  const fail = (message = 'Check the expression and try again.'): never => { throw new CalculatorError('SYNTAX', message); };
  function primary(): number {
    const token = take(); if (!token) return fail();
    if (token.type === 'number') return token.value;
    if (token.type === 'paren' && token.value === '(') { const value = expressionRule(); if (take()?.value !== ')') fail('Missing closing parenthesis.'); return value; }
    if (token.type !== 'name') return fail();
    if (token.value === 'pi') return Math.PI;
    if (token.value === 'e') return Math.E;
    if (token.value === 'ans') return options.ans ?? 0;
    if (!['sqrt', 'sin', 'cos', 'tan', 'log', 'ln'].includes(token.value)) throw new CalculatorError('UNSUPPORTED', `Unsupported function: ${token.value}`);
    if (take()?.value !== '(') return fail(`Use parentheses after ${token.value}.`);
    const value = expressionRule(); if (take()?.value !== ')') return fail('Missing closing parenthesis.');
    if ((token.value === 'sqrt' && value < 0) || (['log', 'ln'].includes(token.value) && value <= 0)) throw new CalculatorError('DOMAIN', 'That value is outside the function domain.');
    const radians = angleMode === 'deg' ? value * Math.PI / 180 : value;
    if (token.value === 'tan' && Math.abs(Math.cos(radians)) < 1e-12) throw new CalculatorError('DOMAIN', 'Tangent is undefined at this angle.');
    switch (token.value) {
      case 'sqrt': return Math.sqrt(value);
      case 'sin': return Math.sin(radians);
      case 'cos': return Math.cos(radians);
      case 'tan': return Math.tan(radians);
      case 'log': return Math.log10(value);
      case 'ln': return Math.log(value);
      default: throw new CalculatorError('UNSUPPORTED', `Unsupported function: ${token.value}`);
    }
  }
  function postfix(): number { let value = primary(); while (peek()?.value === '%') { take(); value /= 100; } return value; }
  function power(): number { const left = postfix(); if (peek()?.value === '^') { take(); return left ** unary(); } return left; }
  function unary(): number { if (peek()?.value === '+') { take(); return unary(); } if (peek()?.value === '-') { take(); return -unary(); } return power(); }
  function term(): number { let value = unary(); while (peek()?.value === '*' || peek()?.value === '/') { const op = take().value; const right = unary(); if (op === '/' && right === 0) throw new CalculatorError('DIVIDE_BY_ZERO', 'Cannot divide by zero.'); value = op === '*' ? value * right : value / right; } return value; }
  function expressionRule(): number { let value = term(); while (peek()?.value === '+' || peek()?.value === '-') { const op = take().value; const right = term(); value = op === '+' ? value + right : value - right; } return value; }
  if (tokens.length === 0) return fail('Enter a calculation.');
  const result = expressionRule(); if (position !== tokens.length) fail();
  if (!Number.isFinite(result)) throw new CalculatorError('DOMAIN', 'The result is not finite.');
  return result;
}
