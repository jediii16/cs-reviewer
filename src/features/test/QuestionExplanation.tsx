import type { ChoiceQuestion } from '../../content/types';

export function QuestionExplanation({ question }: { question: ChoiceQuestion }) {
  const index = question.incorrectPhrase ? question.prompt.indexOf(question.incorrectPhrase) : -1;
  return <>
    {index >= 0 && question.incorrectPhrase && question.correctedStatement ? <div className="statement-correction">
      <span className="eyebrow">The part to rethink</span>
      <p>{question.prompt.slice(0, index)}<mark>{question.incorrectPhrase}</mark>{question.prompt.slice(index + question.incorrectPhrase.length)}</p>
      <span className="eyebrow">Corrected statement</span><p className="corrected-statement">{question.correctedStatement}</p>
    </div> : null}
    <p>{question.explanation}</p>
    {question.source ? <p className="source-reference">Source: {question.source}</p> : null}
  </>;
}
