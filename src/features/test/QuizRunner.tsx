import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { QuizQuestion, QuizTopic } from '../../content/types';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { getCorrectAnswerLabel, getMissedQuestions, isQuestionCorrect, scoreQuiz, type QuizAnswers } from './quizEngine';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete: (result: { correct: number; total: number }) => void;
  onExit?: () => void;
}

const topicLabels: Record<QuizTopic, string> = {
  threats: 'Threat categories',
  cia: 'Foundations & CIA',
  principles: 'Security principles',
  social: 'Social engineering',
};

const kindLabels: Record<QuizQuestion['kind'], string> = {
  'multiple-choice': 'Multiple choice',
  identification: 'Identification',
  'true-false': 'True or false',
};

export function QuizRunner({ questions, onComplete, onExit }: QuizRunnerProps) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerValue, setAnswerValue] = useState('');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = activeQuestions[questionIndex];
  const score = scoreQuiz(activeQuestions, answers);

  function submitAnswer() {
    if (!answerValue.trim()) return;
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
  }

  function retryMissed() {
    const missed = getMissedQuestions(activeQuestions, answers);
    setActiveQuestions(missed);
    setQuestionIndex(0);
    setAnswerValue('');
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  }

  if (showResults) {
    const missed = getMissedQuestions(activeQuestions, answers);
    return (
      <section className="quiz-results" aria-labelledby="results-heading">
        <p className="section-label">Review complete</p>
        <h2 id="results-heading">{score.percent >= 80 ? 'Strong work.' : 'Now you know what to revisit.'}</h2>
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
  const choiceOptions = question.kind === 'multiple-choice'
    ? question.options
    : question.kind === 'true-false'
      ? [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }]
      : null;

  return (
    <section className="quiz-runner" aria-labelledby="question-heading">
      <div className="quiz-progress-row">
        <span className="quiz-meta"><span>{topicLabels[question.topicId]}</span><strong>{kindLabels[question.kind]}</strong></span>
        <span>Question {questionIndex + 1} of {activeQuestions.length}</span>
      </div>
      <ProgressBar value={questionIndex + 1} max={activeQuestions.length} label="Test progress" />

      <h2 id="question-heading">{question.prompt}</h2>

      {choiceOptions ? (
        <fieldset className="answer-list" disabled={submitted}>
          <legend>{question.kind === 'true-false' ? 'Choose true or false' : 'Choose the best answer'}</legend>
          {choiceOptions.map((option) => {
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
      ) : (
        <div className="identification-answer">
          <label htmlFor={`answer-${question.id}`}>Your answer</label>
          <input
            id={`answer-${question.id}`}
            type="text"
            value={answerValue}
            disabled={submitted}
            autoComplete="off"
            placeholder="Type the term or concept"
            onChange={(event) => setAnswerValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && answerValue.trim()) submitAnswer();
            }}
          />
        </div>
      )}

      {submitted ? (
        <div className={`answer-feedback ${selectedIsCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
          <strong>{selectedIsCorrect ? 'Correct' : `Not quite — ${getCorrectAnswerLabel(question)}`}</strong>
          <p>{question.explanation}</p>
        </div>
      ) : null}

      <div className="quiz-actions">
        {submitted ? (
          <Button onClick={advance}>{questionIndex === activeQuestions.length - 1 ? 'See results' : 'Next question'}</Button>
        ) : (
          <Button disabled={!answerValue.trim()} onClick={submitAnswer}>Submit answer</Button>
        )}
      </div>
    </section>
  );
}
