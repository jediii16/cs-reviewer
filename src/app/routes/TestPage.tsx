import { ArrowLeft, ArrowRight, Brain, Layers3, MessagesSquare, Network, RadioTower, ScanSearch, ShieldCheck, Split, Waves } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { getSubject, getSubjectTests } from '../../content/subjects';
import type { ChoiceQuestion, TestSet } from '../../content/types';
import { useProgress } from '../../features/progress/useProgress';
import { QuizRunner } from '../../features/test/QuizRunner';
import { createQuiz } from '../../features/test/quizEngine';

const topicIcons: Record<string, typeof Brain> = {
  cia: Layers3,
  principles: Brain,
  threats: ShieldCheck,
  social: MessagesSquare,
  'digital-analog': Waves,
  'error-control': ScanSearch,
  'tcp-ip': Network,
  'transmission-media': RadioTower,
  multiplexing: Split,
};

interface ActiveTest {
  subjectId: string;
  title: string;
  instruction?: string;
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
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const testContent = getSubjectTests(subjectId);
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const { recordResult } = useProgress();

  if (!subject || !testContent) return <Navigate to="/" replace />;

  const testTopicIds = Array.from(new Set(testContent.sets.map((set) => set.topicId)));

  const start = (set: TestSet) => {
    setActiveTest({
      subjectId: subject.id,
      title: set.title,
      instruction: set.instruction,
      questions: createQuiz(set.questions),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTest?.subjectId === subject.id) {
    return (
      <section className="test-page test-page-running">
        <button className="back-link back-link-button" type="button" onClick={() => setActiveTest(null)}>
          <ArrowLeft aria-hidden="true" /> Back to practice sets
        </button>
        <QuizRunner
          questions={activeTest.questions}
          setTitle={activeTest.title}
          instruction={activeTest.instruction}
          onComplete={(result) => recordResult({
            ...result,
            subjectId: activeTest.subjectId,
            completedAt: new Date().toISOString(),
          })}
          onExit={() => setActiveTest(null)}
        />
      </section>
    );
  }

  return (
    <section className="test-page" aria-labelledby="test-title">
      <Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft aria-hidden="true" /> {subject.code}</Link>
      <header className="test-heading test-heading-with-bappi">
        <div>
          <h1 id="test-title">Choose a practice set</h1>
          <p>Focused multiple-choice sets cover every supplied concept, with feedback after each answer and no arbitrary question limit.</p>
        </div>
        <BappiMascot className="test-heading-mascot" pose="cool" alt="Bappi is ready for practice" />
      </header>

      <div className="test-groups">
        {testTopicIds.map((topicId) => {
          const Icon = topicIcons[topicId] ?? Brain;
          const sets = testContent.sets.filter((set) => set.topicId === topicId);
          return (
            <section className="test-group" key={topicId} aria-labelledby={`test-group-${topicId}`}>
              <header>
                <span className="test-mode-icon" aria-hidden="true"><Icon /></span>
                <h2 id={`test-group-${topicId}`}>{testContent.labels[topicId]}</h2>
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
