import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChoiceQuestion, QuizTopic } from '../../content/types';
import { BappiMascot } from '../../components/BappiMascot';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { getCorrectAnswerLabel, getMissedQuestions, isQuestionCorrect, scoreQuiz, type QuizAnswers } from './quizEngine';

interface QuizRunnerProps {
  questions: ChoiceQuestion[];
  setTitle?: string;
  onComplete: (result: { correct: number; total: number }) => void;
  onExit?: () => void;
}

const topicLabels: Record<QuizTopic, string> = {
  threats: 'Threat categories',
  cia: 'Foundations & CIA',
  principles: 'Security principles',
  social: 'Social engineering',
};

export function QuizRunner({ questions, setTitle, onComplete, onExit }: QuizRunnerProps) {
  const runnerRef = useRef<HTMLElement>(null);
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerValue, setAnswerValue] = useState('');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = activeQuestions[questionIndex];
  const score = scoreQuiz(activeQuestions, answers);

  function returnToQuestion() {
    window.requestAnimationFrame?.(() => {
      runnerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    });
  }

  function submitAnswer() {
    if (!answerValue) return;
    setAnswers((current) => ({ ...current, [question.id]: answerValue }));
    setSubmitted(true);
  }

  function advance() {
    if (questionIndex === activeQuestions.length - 1) {
      const finalAnswers = { ...answers, [question.id]: answerValue };
      const finalScore = scoreQuiz(activeQuestions, finalAnswers);
      setAnswers(finalAnswers);
      setShowResults(true);
      onComplete({ correct: finalScore.correct, total: finalScore.total });
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnswerValue('');
    setSubmitted(false);
    returnToQuestion();
  }

  function retryMissed() {
    const missed = getMissedQuestions(activeQuestions, answers);
    setActiveQuestions(missed);
    setQuestionIndex(0);
    setAnswerValue('');
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
    returnToQuestion();
  }

  if (showResults) {
    const missed = getMissedQuestions(activeQuestions, answers);
    return (
      <section className="quiz-results" aria-labelledby="results-heading">
        <div className="results-heading-lockup">
          <div>
            <h2 id="results-heading">Review complete</h2>
            <p className="results-summary">{score.percent >= 80 ? 'You have a solid grasp of this set.' : 'Use the breakdown below to choose what to review next.'}</p>
          </div>
          <BappiMascot
            className="results-mascot"
            pose={score.percent >= 80 ? 'celebrating' : 'worried'}
            alt={score.percent >= 80 ? 'Bappi is celebrating' : 'Bappi looks worried'}
            eager
          />
        </div>
        <div className="score-lockup">
          <strong aria-label="Total score">{score.correct} / {score.total}</strong>
          <span>{score.percent}% correct</span>
        </div>

        <div className="topic-breakdown">
          {Object.entries(score.byTopic).map(([topic, topicScore]) => (
            <div key={topic}>
              <span>{topicLabels[topic as QuizTopic]}</span>
              <strong>{topicScore.correct} / {topicScore.total}</strong>
            </div>
          ))}
        </div>

        {missed.length > 0 ? (
          <div className="missed-list">
            <h3>Concepts to revisit</h3>
            <ul>{missed.map((item) => <li key={item.id}>{item.concept}</li>)}</ul>
          </div>
        ) : (
          <p className="perfect-note">You answered every question correctly.</p>
        )}

        <div className="results-actions">
          {missed.length > 0 ? <Button onClick={retryMissed}><RotateCcw aria-hidden="true" /> Retry missed</Button> : null}
          {onExit ? <Button variant="ghost" onClick={onExit}>Choose another test</Button> : null}
        </div>
      </section>
    );
  }

  const selectedIsCorrect = isQuestionCorrect(question, answerValue);

  return (
    <section ref={runnerRef} className="quiz-runner" aria-labelledby="question-heading">
      <div className="quiz-progress-row">
        <span className="quiz-meta">
          <span>{topicLabels[question.topicId]}</span>
          {setTitle ? <strong>{setTitle}</strong> : null}
        </span>
        <span>Question {questionIndex + 1} of {activeQuestions.length}</span>
      </div>
      <ProgressBar value={questionIndex + 1} max={activeQuestions.length} label="Test progress" />

      <BappiMascot
        className="quiz-state-mascot"
        pose={submitted ? (selectedIsCorrect ? 'celebrating' : 'worried') : 'focused'}
        alt={submitted ? (selectedIsCorrect ? 'Bappi is celebrating' : 'Bappi looks worried') : 'Bappi is focused'}
        eager
      />

      <h2 id="question-heading">{question.prompt}</h2>

      <fieldset className="answer-list" disabled={submitted}>
        <legend>Choose the best answer</legend>
        {question.options.map((option) => {
          const isSelected = answerValue === option.id;
          const isCorrectOption = isQuestionCorrect(question, option.id);
          const stateClass = submitted
            ? isCorrectOption ? 'is-correct' : isSelected ? 'is-wrong' : ''
            : isSelected ? 'is-selected' : '';
          return (
            <label key={option.id} className={stateClass}>
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={isSelected}
                onChange={() => setAnswerValue(option.id)}
              />
              <span>{option.label}</span>
              {submitted && isCorrectOption ? <CheckCircle2 aria-hidden="true" /> : null}
              {submitted && isSelected && !isCorrectOption ? <XCircle aria-hidden="true" /> : null}
            </label>
          );
        })}
      </fieldset>

      {submitted ? (
        <div className={`answer-feedback ${selectedIsCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
          <strong>
            {selectedIsCorrect ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
            <span>{selectedIsCorrect ? 'Correct' : `Not quite — ${getCorrectAnswerLabel(question)}`}</span>
          </strong>
          <p>{question.explanation}</p>
        </div>
      ) : null}

      <div className="quiz-actions">
        {submitted ? (
          <Button onClick={advance}>{questionIndex === activeQuestions.length - 1 ? 'See results' : 'Next question'}</Button>
        ) : (
          <Button disabled={!answerValue} onClick={submitAnswer}>Submit answer</Button>
        )}
      </div>
    </section>
  );
}
