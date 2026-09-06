import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import type { LessonTopic } from '../../content/types';
import { BappiMascot } from '../../components/BappiMascot';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { McCumberCube } from './McCumberCube';

interface StudyLessonProps {
  topic: LessonTopic;
  onComplete: (topicId: string) => void;
  reviewed?: boolean;
}

export function StudyLesson({ topic, onComplete, reviewed = false }: StudyLessonProps) {
  const lessonAnchorRef = useRef<HTMLDivElement>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const section = topic.sections[sectionIndex];
  const isLast = sectionIndex === topic.sections.length - 1;

  function moveTo(nextIndex: number) {
    setSectionIndex(nextIndex);
    lessonAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <article className="lesson">
      <div ref={lessonAnchorRef} className="lesson-anchor">
        <div className="lesson-kicker">
          <span>{topic.title}</span>
          <span>{sectionIndex + 1} of {topic.sections.length}</span>
        </div>
        <ProgressBar value={sectionIndex + 1} max={topic.sections.length} label="Lesson progress" />
      </div>

      <header className="lesson-header">
        <h2>{section.title}</h2>
        <p>{section.summary}</p>
      </header>

      {section.bullets?.length ? (
        <section className="lesson-block" aria-labelledby="key-points-title">
          <h3 id="key-points-title">Key points</h3>
          <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}

      {section.examples?.length ? (
        <section className="lesson-block lesson-examples" aria-labelledby="examples-title">
          <h3 id="examples-title">Examples</h3>
          <ul>{section.examples.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}

      {section.controls?.length ? (
        <section className="lesson-block" aria-labelledby="controls-title">
          <h3 id="controls-title">Controls</h3>
          <ul>{section.controls.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}

      {section.benefits?.length ? (
        <section className="lesson-block" aria-labelledby="benefits-title">
          <h3 id="benefits-title">Benefits</h3>
          <ul>{section.benefits.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}

      {section.applicablePrinciples?.length ? (
        <section className="lesson-block" aria-labelledby="applicable-principles-title">
          <h3 id="applicable-principles-title">Applicable security principles</h3>
          <ul>{section.applicablePrinciples.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}

      {section.id === 'mccumber-cube' ? <McCumberCube /> : null}

      <section className="recall-panel" aria-labelledby="recall-title" tabIndex={0}>
        <div className="recall-face recall-prompt">
          <BappiMascot className="recall-mascot" pose="thinking" alt="Bappi is thinking" />
          <div>
            <span>Active recall</span>
            <h3 id="recall-title">{section.recallPrompt}</h3>
          </div>
        </div>
        <div className="recall-face recall-answer">
          <span>Answer</span>
          <p>{section.recallAnswer}</p>
        </div>
        <small className="recall-hint">Hover or tap to reveal</small>
      </section>

      <footer className="lesson-footer">
        <Button variant="ghost" disabled={sectionIndex === 0} onClick={() => moveTo(sectionIndex - 1)}>
          <ChevronLeft aria-hidden="true" /> Previous
        </Button>
        {isLast ? (
          <Button onClick={() => onComplete(topic.id)}>
            {reviewed ? 'Reviewed' : 'Mark topic reviewed'}
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => moveTo(sectionIndex + 1)}>
            Next <ChevronRight aria-hidden="true" />
          </Button>
        )}
      </footer>
    </article>
  );
}
