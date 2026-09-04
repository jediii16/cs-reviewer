import { ArrowLeft, Brain, Layers3, ShieldCheck, UserRoundSearch } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cit017Questions } from '../../content/cit017/questions';
import { QuizRunner } from '../../features/test/QuizRunner';
import { createQuiz, type QuizFilter } from '../../features/test/quizEngine';
import { useProgress } from '../../features/progress/useProgress';

const testModes: Array<{ id: QuizFilter; label: string; description: string; icon: typeof Brain }> = [
  { id: 'threats', label: 'Threat Categories', description: 'Identify all 12 categories from scenarios.', icon: ShieldCheck },
  { id: 'cia', label: 'CIA Triad', description: 'Choose confidentiality, integrity, or availability.', icon: Layers3 },
  { id: 'principles', label: 'Security Principles', description: 'Match scenarios to the nine principles.', icon: Brain },
  { id: 'social', label: 'Social Engineering', description: 'Recognize manipulation techniques.', icon: UserRoundSearch },
  { id: 'mixed', label: 'Mixed Review', description: 'A little of everything in ten questions.', icon: Brain },
];

export function TestPage() {
  const [quiz, setQuiz] = useState<ReturnType<typeof createQuiz> | null>(null);
  const { recordResult } = useProgress();

  function start(filter: QuizFilter) {
    setQuiz(createQuiz(cit017Questions, filter, 10));
  }

  if (quiz) {
    return (
      <section className="test-page test-page-running">
        <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
        <QuizRunner
          questions={quiz}
          onComplete={(result) => recordResult({ ...result, completedAt: new Date().toISOString() })}
          onExit={() => setQuiz(null)}
        />
      </section>
    );
  }

  return (
    <section className="test-page" aria-labelledby="test-title">
      <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
      <header className="test-heading">
        <p className="section-label">Test mode</p>
        <h1 id="test-title">Practice the way you’ll be asked.</h1>
        <p>Short, scenario-based sets with feedback after every answer.</p>
      </header>

      <div className="test-mode-list">
        {testModes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <button key={mode.id} onClick={() => start(mode.id)}>
              <span className="test-mode-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="test-mode-icon"><Icon aria-hidden="true" /></span>
              <span><strong>{mode.label}</strong><small>{mode.description}</small></span>
              <span className="test-mode-action">Start</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
