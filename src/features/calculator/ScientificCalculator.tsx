import { Calculator, ChevronDown, History, X } from 'lucide-react';
import { useState } from 'react';
import { evaluateExpression, type AngleMode } from './evaluator';

const keys = [
  ['sin(', 'sin'], ['cos(', 'cos'], ['tan(', 'tan'], ['sqrt(', '√'], ['^2', 'x²'],
  ['log(', 'log'], ['ln(', 'ln'], ['1/(', '1/x'],
  ['(', '('], [')', ')'], ['pi', 'π'], ['e', 'e'], ['^', 'xʸ'],
  ['7', '7'], ['8', '8'], ['9', '9'], ['/', '÷'], ['%', '%'],
  ['4', '4'], ['5', '5'], ['6', '6'], ['*', '×'], ['ans', 'ANS'],
  ['1', '1'], ['2', '2'], ['3', '3'], ['-', '−'], ['.', '.'],
  ['0', '0'], ['+', '+'],
] as const;

export function ScientificCalculator() {
  const [open, setOpen] = useState(false); const [expression, setExpression] = useState('');
  const [result, setResult] = useState(0); const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState(0); const [error, setError] = useState(''); const [history, setHistory] = useState<string[]>([]);
  const calculate = () => {
    try { const value = evaluateExpression(expression, { angleMode, ans: result }); setResult(value); setHistory((items) => [`${expression} = ${Number(value.toPrecision(12))}`, ...items].slice(0, 10)); setError(''); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Check the expression.'); }
  };
  const add = (token: string) => setExpression((value) => value + token);
  if (!open) return <button className="calculator-launcher" type="button" aria-label="Open calculator" onClick={() => setOpen(true)}><Calculator aria-hidden="true" /><span>Calculator</span></button>;
  return (
    <aside className="scientific-calculator" role="dialog" aria-label="Scientific calculator">
      <header><div><strong>Scientific calculator</strong><span>{angleMode.toUpperCase()} mode</span></div><button type="button" aria-label="Minimize calculator" onClick={() => setOpen(false)}><ChevronDown /></button></header>
      <div className="calculator-display">
        <input aria-label="Calculator expression" value={expression} onChange={(event) => setExpression(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') calculate(); }} placeholder="Type a calculation" />
        <output data-testid="calculator-result">{Number(result.toPrecision(12))}</output>
        {error ? <p role="alert">{error}</p> : null}
      </div>
      <div className="calculator-memory">
        <button type="button" onClick={() => setMemory(0)}>MC</button><button type="button" onClick={() => setExpression((value) => value + memory)}>MR</button>
        <button type="button" onClick={() => setMemory((value) => value + result)}>M+</button><button type="button" onClick={() => setMemory((value) => value - result)}>M−</button>
        <button type="button" onClick={() => setAngleMode((mode) => mode === 'deg' ? 'rad' : 'deg')}>{angleMode.toUpperCase()}</button>
      </div>
      <div className="calculator-keys">
        {keys.map(([token, label]) => <button key={token} type="button" className={'+-*/^'.includes(token) ? 'operator' : ''} onClick={() => add(token)}>{label}</button>)}
        <button type="button" onClick={() => setExpression((value) => value.slice(0, -1))}>⌫</button>
        <button type="button" onClick={() => { setExpression(''); setError(''); }}><X aria-hidden="true" /> C</button>
        <button className="equals" type="button" onClick={calculate}>=</button>
      </div>
      {history.length ? <details className="calculator-history"><summary><History /> History</summary>{history.map((item) => <button type="button" key={item} onClick={() => setExpression(item.split(' = ')[0])}>{item}</button>)}</details> : null}
    </aside>
  );
}
