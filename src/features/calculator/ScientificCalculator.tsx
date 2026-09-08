import {
  Calculator,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  History,
} from 'lucide-react';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { evaluateExpression, type AngleMode } from './evaluator';

const positionStorageKey = 'calculator-position-v1';
const binaryOperators = new Set(['+', '-', '*', '/', '^']);
const scientificKeys = [
  ['sin(', 'sin'], ['cos(', 'cos'], ['tan(', 'tan'], ['sqrt(', '√'],
  ['^2', 'x²'], ['^', 'xʸ'], ['log(', 'log'], ['ln(', 'ln'],
  ['1/(', '1/x'], ['(', '('], [')', ')'], ['pi', 'π'],
  ['e', 'e'],
] as const;

type Position = { x: number; y: number };
type DragState = { offsetX: number; offsetY: number };

function loadPosition(): Position | null {
  try {
    const value = localStorage.getItem(positionStorageKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<Position>;
    return Number.isFinite(parsed.x) && Number.isFinite(parsed.y)
      ? { x: parsed.x!, y: parsed.y! }
      : null;
  } catch {
    return null;
  }
}

function formatResult(value: number) {
  return String(Number(value.toPrecision(12)));
}

export function ScientificCalculator() {
  const [open, setOpen] = useState(false);
  const [scientificOpen, setScientificOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(0);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState(0);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [position, setPosition] = useState<Position | null>(loadPosition);
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const clampPosition = useCallback((next: Position): Position => {
    const panel = panelRef.current;
    const width = panel?.offsetWidth ?? 390;
    const height = panel?.offsetHeight ?? 560;
    const margin = 8;
    return {
      x: Math.min(Math.max(margin, next.x), Math.max(margin, window.innerWidth - width - margin)),
      y: Math.min(Math.max(margin, next.y), Math.max(margin, window.innerHeight - height - margin)),
    };
  }, []);

  useEffect(() => {
    const keepInView = () => setPosition((current) => current ? clampPosition(current) : null);
    if (open) requestAnimationFrame(keepInView);
    window.addEventListener('resize', keepInView);
    return () => window.removeEventListener('resize', keepInView);
  }, [clampPosition, open, scientificOpen]);

  const calculate = () => {
    try {
      const value = evaluateExpression(expression, { angleMode, ans: result });
      const formatted = formatResult(value);
      setResult(value);
      setHistory((items) => [`${expression} = ${formatted}`, ...items].slice(0, 10));
      setJustEvaluated(true);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Check the expression.');
    }
  };

  const add = (token: string) => {
    if (justEvaluated) {
      setExpression(binaryOperators.has(token) || token === '^2' ? `${formatResult(result)}${token}` : token);
      setJustEvaluated(false);
      return;
    }
    setExpression((value) => value + token);
  };

  const clear = () => {
    setExpression('');
    setResult(0);
    setJustEvaluated(false);
    setError('');
  };

  const handleExpressionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculate();
      return;
    }
    if (!justEvaluated) return;
    if (binaryOperators.has(event.key)) {
      event.preventDefault();
      add(event.key);
    } else if (/^[0-9.(]$/.test(event.key)) {
      event.preventDefault();
      setExpression(event.key);
      setJustEvaluated(false);
    }
  };

  const moveStart = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    setPosition(clampPosition({
      x: event.clientX - dragRef.current.offsetX,
      y: event.clientY - dragRef.current.offsetY,
    }));
  };

  const moveEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setPosition((current) => {
      if (current) localStorage.setItem(positionStorageKey, JSON.stringify(current));
      return current;
    });
  };

  if (!open) {
    return (
      <button className="calculator-launcher" type="button" aria-label="Open calculator" onClick={() => setOpen(true)}>
        <Calculator aria-hidden="true" />
        <span>Calculator</span>
      </button>
    );
  }

  const positionStyle: CSSProperties | undefined = position
    ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
    : undefined;

  return (
    <aside ref={panelRef} className="scientific-calculator" style={positionStyle} role="dialog" aria-label="Scientific calculator">
      <header>
        <button
          className="calculator-drag-handle"
          data-testid="calculator-drag-handle"
          type="button"
          aria-label="Move calculator"
          onPointerDown={moveStart}
          onPointerMove={move}
          onPointerUp={moveEnd}
        >
          <GripHorizontal aria-hidden="true" />
        </button>
        <div><strong>Calculator</strong><span>{angleMode.toUpperCase()} mode</span></div>
        <button type="button" aria-label="Minimize calculator" onClick={() => setOpen(false)}><ChevronDown /></button>
      </header>

      <div className="calculator-display">
        <input
          aria-label="Calculator expression"
          value={expression}
          onChange={(event) => { setExpression(event.target.value); setJustEvaluated(false); }}
          onKeyDown={handleExpressionKeyDown}
          placeholder="0"
        />
        <output data-testid="calculator-result">{formatResult(result)}</output>
        {error ? <p role="alert">{error}</p> : null}
      </div>

      <div className="calculator-memory">
        <button type="button" onClick={() => setMemory(0)}>MC</button>
        <button type="button" onClick={() => add(formatResult(memory))}>MR</button>
        <button type="button" onClick={() => setMemory((value) => value + result)}>M+</button>
        <button type="button" onClick={() => setMemory((value) => value - result)}>M−</button>
        <button type="button" onClick={() => setAngleMode((mode) => mode === 'deg' ? 'rad' : 'deg')}>{angleMode.toUpperCase()}</button>
      </div>

      <button
        className="calculator-science-toggle"
        type="button"
        aria-expanded={scientificOpen}
        onClick={() => setScientificOpen((value) => !value)}
      >
        <span>{scientificOpen ? 'Hide' : 'Show'} scientific functions</span>
        {scientificOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
      </button>

      {scientificOpen ? (
        <div className="calculator-science-keys">
          {scientificKeys.map(([token, label]) => (
            <button key={token} type="button" className={binaryOperators.has(token) ? 'operator' : ''} onClick={() => add(token)}>{label}</button>
          ))}
        </div>
      ) : null}

      <div className="calculator-keys">
        <button type="button" className="utility" onClick={clear}>AC</button>
        <button type="button" className="utility" aria-label="Backspace" onClick={() => { setExpression((value) => value.slice(0, -1)); setJustEvaluated(false); }}>⌫</button>
        <button type="button" className="utility" onClick={() => add('ans')}>ANS</button>
        <button type="button" className="operator" onClick={() => add('/')}>÷</button>
        {['7', '8', '9'].map((value) => <button type="button" key={value} onClick={() => add(value)}>{value}</button>)}
        <button type="button" className="operator" onClick={() => add('*')}>×</button>
        {['4', '5', '6'].map((value) => <button type="button" key={value} onClick={() => add(value)}>{value}</button>)}
        <button type="button" className="operator" onClick={() => add('-')}>−</button>
        {['1', '2', '3'].map((value) => <button type="button" key={value} onClick={() => add(value)}>{value}</button>)}
        <button type="button" className="operator" onClick={() => add('+')}>+</button>
        <button type="button" onClick={() => { setExpression((value) => value ? `-(${value})` : '-'); setJustEvaluated(false); }}>±</button>
        <button type="button" onClick={() => add('0')}>0</button>
        <button type="button" onClick={() => add('.')}>.</button>
        <button className="equals" type="button" onClick={calculate}>=</button>
      </div>

      {history.length ? (
        <details className="calculator-history">
          <summary><History /> History</summary>
          {history.map((item) => <button type="button" key={item} onClick={() => { setExpression(item.split(' = ')[0]); setJustEvaluated(false); }}>{item}</button>)}
        </details>
      ) : null}
    </aside>
  );
}
