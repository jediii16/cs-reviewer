import { Bookmark, Check, ChevronLeft, ChevronRight, Clock3, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BappiMascot } from '../../components/BappiMascot';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { useLearning } from '../learning/useLearning';
import type { QuizSession } from '../learning/model';
import { createQuiz, getCorrectAnswerLabel, getMissedQuestions, isQuestionCorrect, scoreQuiz } from './quizEngine';
import { QuestionExplanation } from './QuestionExplanation';

export function QuizSessionRunner({ session, onExit, onSessionChange }: { session: QuizSession; onExit: () => void; onSessionChange: (id: string) => void }) {
  const { data, subjects, actions } = useLearning();
  const [reviewing, setReviewing] = useState(false);
  const [now, setNow] = useState(Date.now);
  const heading = useRef<HTMLHeadingElement>(null);
  const finished = session.finishedAt !== undefined;
  const question = session.questions[session.index];
  const submitted = session.gradedIds.includes(question.id);
  const answer = session.answers[question.id] ?? '';
  const score = scoreQuiz(session.questions, session.answers);
  const answered = Object.keys(session.answers).length;
  const topicLabel = subjects.find((s) => s.id === session.subjectId)?.topics.find((t) => t.id === question.topicId)?.title ?? question.concept;
  const remaining = session.deadlineAt ? Math.max(0, Math.ceil((session.deadlineAt - now) / 1000)) : null;
  const book = data.bookmarks[question.id];

  useEffect(() => {
    if (!session.deadlineAt || finished) return;
    const tick = () => {
      const time = Date.now();
      setNow(time);
      if (time >= session.deadlineAt!) actions.finishQuiz(session.subjectId, true);
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [session.deadlineAt, session.subjectId, finished, actions]);

  function move(index: number) {
    actions.moveQuestion(session.subjectId, index);
    setReviewing(false);
    window.requestAnimationFrame(() => heading.current?.focus());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function retryMissed() {
    const missed = getMissedQuestions(session.questions, session.answers);
    const id = actions.startQuiz(session.subjectId, 'Review missed questions', createQuiz(missed));
    if (id) onSessionChange(id);
  }

  if (finished) return <section className="session-results" aria-labelledby="results-heading">
    <div className="result-hero">
      <div><span className="eyebrow">{session.mode === 'exam' ? 'Mock exam' : 'Learning session'} complete</span>
        <h1 id="results-heading">{score.percent >= 80 ? 'That’s progress.' : 'A good place to grow.'}</h1>
        <p>{session.timedOut ? 'Time is up. Your saved answers were submitted automatically.' : 'Your results and review schedule are saved.'}</p>
      </div>
      <BappiMascot pose={score.percent >= 80 ? 'celebrating' : 'thinking'} className="result-bappi" alt={score.percent >= 80 ? 'Bappi is celebrating' : 'Bappi is thinking'} />
    </div>
    <div className="result-score"><strong aria-label="Total score">{score.correct} / {score.total}</strong><span>{score.percent}% correct</span></div>
    <div className="result-actions">
      {score.correct < score.total ? <Button onClick={retryMissed}><RotateCcw size={17} /> Retry missed</Button> : null}
      <Button variant="secondary" onClick={onExit}>Choose another session</Button>
    </div>
    <p className="muted">Missed questions join your review queue for tomorrow. Correct reviews move to a longer interval.</p>
    <h2>Look back at your answers</h2>
    <div className="answer-review-list">{session.questions.map((item, index) => <details key={item.id}>
      <summary><span className={isQuestionCorrect(item, session.answers[item.id]) ? 'answer-dot correct' : 'answer-dot incorrect'}>{index + 1}</span><span>{item.concept}</span><span>{isQuestionCorrect(item, session.answers[item.id]) ? 'Correct' : 'Revisit'}</span></summary>
      <div><h3>{item.prompt}</h3><p>Your answer: <strong>{item.options.find((o) => o.id === session.answers[item.id])?.label ?? 'Unanswered'}</strong></p><p>Correct answer: <strong>{getCorrectAnswerLabel(item)}</strong></p><QuestionExplanation question={item} />
        <button className="text-button" type="button" onClick={() => actions.bookmark(session.subjectId, item.id)}><Bookmark size={16} />{data.bookmarks[item.id] ? 'Remove bookmark' : 'Bookmark question'}</button>
      </div>
    </details>)}</div>
  </section>;

  if (reviewing && session.mode === 'exam') return <section className="exam-review" aria-labelledby="exam-review-title">
    <span className="eyebrow">Before you submit</span><h1 id="exam-review-title">One last look.</h1>
    <p>{answered} of {session.questions.length} answered. {session.questions.length - answered > 0 ? 'Unanswered questions will count as incorrect.' : 'You’ve answered every question.'}</p>
    <div className="exam-question-grid">{session.questions.map((q, index) => <button type="button" key={q.id} className={session.answers[q.id] ? 'answered' : ''} onClick={() => move(index)} aria-label={`Question ${index + 1}, ${session.answers[q.id] ? 'answered' : 'unanswered'}`}>{index + 1}{session.answers[q.id] ? <Check size={14} /> : null}</button>)}</div>
    <div className="result-actions"><Button onClick={() => actions.finishQuiz(session.subjectId)}>Submit exam</Button><Button variant="secondary" onClick={() => setReviewing(false)}>Back to questions</Button></div>
  </section>;

  return <section className="quiz-runner modern-quiz" aria-labelledby="question-heading">
    {session.contentUpdated ? <p className="muted small" role="status">This session now uses the slide wording. Checked answers are kept; please reselect any unchecked answer.</p> : null}
    <div className="session-topline"><span className="eyebrow">{session.mode === 'exam' ? 'Mock exam · feedback at the end' : 'Learning · feedback as you go'}</span>
      {remaining !== null ? <span className={`session-clock ${remaining < 60 ? 'is-urgent' : ''}`} role="timer" aria-label="Time remaining"><Clock3 size={16} />{Math.floor(remaining / 60).toString().padStart(2, '0')}:{(remaining % 60).toString().padStart(2, '0')}</span> : <span className="save-indicator">Saved on this device</span>}
    </div>
    <div className="quiz-progress-row"><span>{session.title}</span><span>Question {session.index + 1} of {session.questions.length}</span></div>
    <ProgressBar value={session.mode === 'exam' ? answered : session.gradedIds.length} max={session.questions.length} label="Test progress" />
    <div className="question-sheet">
      <div className="question-label-row"><span className="question-type">{question.kind === 'true-false' ? 'True or false' : 'Multiple choice'}</span><button className={`bookmark-button ${book ? 'is-saved' : ''}`} type="button" aria-label={book ? 'Remove bookmark' : 'Bookmark question'} aria-pressed={!!book} onClick={() => actions.bookmark(session.subjectId, question.id)}><Bookmark size={18} fill={book ? 'currentColor' : 'none'} /><span>{book ? 'Saved' : 'Save'}</span></button></div>
      <p className="question-topic">{topicLabel}</p>
      <h2 id="question-heading" ref={heading} tabIndex={-1}>{question.prompt}</h2>
      <fieldset className="answer-list" disabled={session.mode === 'learn' && submitted}>
        <legend className="sr-only">{question.kind === 'true-false' ? 'True or false' : 'Choose the best answer'}</legend>
        {question.options.map((option, index) => {
          const showFeedback = session.mode === 'learn' && submitted;
          const stateClass = showFeedback ? option.id === question.correctOptionId ? 'is-correct' : option.id === answer ? 'is-wrong' : '' : option.id === answer ? 'is-selected' : '';
          return <label key={option.id} className={stateClass}>
            <input type="radio" name={question.id} value={option.id} checked={answer === option.id} onChange={() => actions.answer(session.subjectId, question.id, option.id)} />
            <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option.label}</span>
            {showFeedback && option.id === question.correctOptionId ? <Check size={18} /> : null}
          </label>;
        })}
      </fieldset>
      {session.mode === 'learn' && submitted ? <div className={`answer-feedback ${isQuestionCorrect(question, answer) ? 'is-correct' : 'is-wrong'}`} role="status"><strong>{isQuestionCorrect(question, answer) ? 'Correct. Nicely done.' : `Let’s revisit this. Correct answer: ${getCorrectAnswerLabel(question)}`}</strong><QuestionExplanation question={question} /></div> : null}
      {book ? <details className="bookmark-note"><summary>Personal note</summary><label><span className="sr-only">Note for this question</span><textarea aria-label="Note for this question" placeholder="What made this one tricky?" rows={3} maxLength={10000} value={book.note} onChange={(event) => actions.saveBookmarkNote(question.id, event.currentTarget.value)} /></label><small>Saved automatically on this device.</small></details> : null}
      <div className="quiz-actions">
        {session.mode === 'learn' ? submitted ? <Button onClick={() => session.index === session.questions.length - 1 ? actions.finishQuiz(session.subjectId) : move(session.index + 1)}>{session.index === session.questions.length - 1 ? 'See results' : 'Next question'}<ChevronRight size={17} /></Button> : <Button disabled={!answer} onClick={() => actions.submitAnswer(session.subjectId)}>Check answer<Check size={17} /></Button> : <>
          <Button variant="ghost" disabled={session.index === 0} onClick={() => move(session.index - 1)}><ChevronLeft size={17} />Previous</Button>
          {session.index < session.questions.length - 1 ? <Button onClick={() => move(session.index + 1)}>Next question<ChevronRight size={17} /></Button> : <Button onClick={() => setReviewing(true)}>Review & submit</Button>}
        </>}
      </div>
    </div>
    {session.mode === 'exam' ? <button className="text-button" type="button" onClick={() => setReviewing(true)}>Review all {session.questions.length} questions</button> : null}
    <p className="session-footer-note">You can leave and return. Your question order and answers stay exactly as they are.{session.deadlineAt ? ' The timer keeps running while you are away.' : ''}</p>
  </section>;
}
