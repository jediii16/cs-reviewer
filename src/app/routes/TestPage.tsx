import { ArrowLeft, ArrowRight, Brain, Layers3, ShieldCheck, UserRoundSearch } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cit017Questions } from '../../content/cit017/questions';
import { QuizRunner } from '../../features/test/QuizRunner';
import { createQuiz, type QuizFilter } from '../../features/test/quizEngine';
import { useProgress } from '../../features/progress/useProgress';

const testModes: Array<{ id: QuizFilter; label: string; description: string; icon: typeof Brain }> = [
  { id: 'threats', label: 'Threat Categories', description: 'Scenarios, definitions, identification, and true or false.', icon: ShieldCheck },
  { id: 'cia', label: 'Foundations & CIA', description: 'CIA, AAA, and the McCumber Cube in mixed formats.', icon: Layers3 },
  { id: 'principles', label: 'Security Principles', description: 'Apply and define the nine security principles.', icon: Brain },
  { id: 'social', label: 'Social Engineering', description: 'Recognize techniques, examples, and definitions.', icon: UserRoundSearch },
  { id: 'mixed', label: 'Mixed Review', description: 'Ten questions across every topic and format.', icon: Brain },
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
        <h1 id="test-title">Choose a practice set</h1>
        <p>Ten-question sets mixing multiple choice, identification, true or false, definitions, and scenarios—with feedback after every answer.</p>
      </header>

      <div className="test-mode-list">
        {testModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button key={mode.id} onClick={() => start(mode.id)}>
              <span className="test-mode-icon"><Icon aria-hidden="true" /></span>
              <span><strong>{mode.label}</strong><small>{mode.description}</small></span>
              <ArrowRight className="test-mode-action" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
