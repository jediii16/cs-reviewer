import { ChevronLeft, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { LessonTopic } from '../../content/types';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { McCumberCube } from './McCumberCube';

interface StudyLessonProps {
  topic: LessonTopic;
  onComplete: (topicId: string) => void;
  reviewed?: boolean;
}

export function StudyLesson({ topic, onComplete, reviewed = false }: StudyLessonProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const section = topic.sections[sectionIndex];
  const isLast = sectionIndex === topic.sections.length - 1;

  function moveTo(nextIndex: number) {
    setSectionIndex(nextIndex);
    setRevealed(false);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  return (
    <article className="lesson">
      <div className="lesson-kicker">
        <span>{topic.title}</span>
        <span>{sectionIndex + 1} of {topic.sections.length}</span>
      </div>
      <ProgressBar value={sectionIndex + 1} max={topic.sections.length} label="Lesson progress" />

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

      {section.id === 'mccumber-cube' ? <McCumberCube /> : null}

      <section className="recall-panel" aria-labelledby="recall-title">
        <div>
          <span>Active recall</span>
          <h3 id="recall-title">{section.recallPrompt}</h3>
        </div>
        {revealed ? (
          <div className="recall-answer">
            <p>{section.recallAnswer}</p>
            <Button variant="ghost" onClick={() => setRevealed(false)}><RotateCcw aria-hidden="true" /> Hide answer</Button>
          </div>
        ) : (
          <Button onClick={() => setRevealed(true)}><Eye aria-hidden="true" /> Reveal answer</Button>
        )}
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
