import { ArrowLeft, ArrowRight, Brain, Layers3, MessagesSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { cit017TestSets, testSetTopicLabels } from '../../content/cit017/questions';
import type { ChoiceQuestion, QuizTopic, TestSet } from '../../content/types';
import { useProgress } from '../../features/progress/useProgress';
import { QuizRunner } from '../../features/test/QuizRunner';
import { createQuiz } from '../../features/test/quizEngine';

const testGroups: Array<{ topicId: QuizTopic; icon: typeof Brain }> = [
  { topicId: 'cia', icon: Layers3 },
  { topicId: 'principles', icon: Brain },
  { topicId: 'threats', icon: ShieldCheck },
  { topicId: 'social', icon: MessagesSquare },
];

interface ActiveTest {
  title: string;
  questions: ChoiceQuestion[];
}

function SetRow({ set, onStart }: { set: TestSet; onStart: (set: TestSet) => void }) {
  return (
    <button type="button" onClick={() => onStart(set)}>
      <span className="test-set-copy">
        <strong>{set.title}</strong>
        <small>{set.description}</small>
      </span>
      <span className="test-set-count">{set.questions.length} questions</span>
      <ArrowRight className="test-mode-action" aria-hidden="true" />
    </button>
  );
}

export function TestPage() {
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const { recordResult } = useProgress();

  function start(set: TestSet) {
    setActiveTest({ title: set.title, questions: createQuiz(set.questions) });
  }

  if (activeTest) {
    return (
      <section className="test-page test-page-running">
        <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
        <QuizRunner
          questions={activeTest.questions}
          setTitle={activeTest.title}
          onComplete={(result) => recordResult({ ...result, completedAt: new Date().toISOString() })}
          onExit={() => setActiveTest(null)}
        />
      </section>
    );
  }

  return (
    <section className="test-page" aria-labelledby="test-title">
      <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
      <header className="test-heading test-heading-with-bappi">
        <div>
          <h1 id="test-title">Choose a practice set</h1>
          <p>Focused multiple-choice sets cover every supplied concept, with feedback after each answer and no arbitrary question limit.</p>
        </div>
        <BappiMascot className="test-heading-mascot" pose="cool" alt="Bappi is ready for practice" />
      </header>

      <div className="test-groups">
        {testGroups.map(({ topicId, icon: Icon }) => {
          const sets = cit017TestSets.filter((set) => set.topicId === topicId);
          return (
            <section className="test-group" key={topicId} aria-labelledby={`test-group-${topicId}`}>
              <header>
                <span className="test-mode-icon" aria-hidden="true"><Icon /></span>
                <h2 id={`test-group-${topicId}`}>{testSetTopicLabels[topicId]}</h2>
                <span>{sets.reduce((total, set) => total + set.questions.length, 0)} total</span>
              </header>
              <div className="test-mode-list">
                {sets.map((set) => <SetRow key={set.id} set={set} onStart={start} />)}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
