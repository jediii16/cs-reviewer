import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { JeopardyGame } from '../../features/jeopardy/JeopardyGame';
import { useLearning } from '../../features/learning/useLearning';
import '../../styles/jeopardy.css';

export function JeopardyPage() {
  const { period } = useLearning();
  return <section className="jeopardy-page" aria-labelledby="jeopardy-title">
    <Link className="back-link" to="/"><ArrowLeft size={16} />My study desk</Link>
    <header className="page-intro"><div><span className="eyebrow">Image processing · {period.label}</span><h1 id="jeopardy-title">Cognate 3 Jeopardy</h1><p>Read the definition. Recall the term. Practice your six lessons with 60 clues and a final round.</p></div><BappiMascot className="intro-bappi" pose="thinking" alt="Bappi is thinking through a clue" /></header>
    <JeopardyGame key={period.id} periodId={period.id} />
  </section>;
}
