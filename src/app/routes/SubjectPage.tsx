import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, Puzzle } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { useLearning } from '../../features/learning/useLearning';
import { learningStats, sectionKey } from '../../features/learning/model';

export function SubjectPage() {
  const { subjectId } = useParams();
  const { subjects, questions, data, period, actions } = useLearning();
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return <Navigate to="/" replace />;
  const currentSubject = subject;
  const stats = learningStats(data, [subject], questions[subject.id] ?? []);
  const latest = data.results.find((r) => r.subjectId === subject.id);
  function reset() {
    if (window.confirm(`Reset reviewed sections, scores, and mistakes for ${currentSubject.code} in ${period.label}? Your bookmarks and other periods will stay saved.`)) actions.resetSubject(currentSubject.id);
  }
  return <section className="subject-page" aria-labelledby="subject-title">
    <Link className="back-link" to="/"><ArrowLeft size={16} />My study desk</Link>
    <header className="page-intro"><div><span className="eyebrow">{period.label} · {subject.code}</span><h1 id="subject-title">{subject.title}</h1><p>{subject.description}</p></div><BappiMascot className="intro-bappi" pose="cool" alt="Bappi is ready to review" /></header>
    <section className="desk-stats" aria-label="Saved review progress"><div><span>Sections reviewed</span><strong>{stats.reviewed}<small> / {stats.sections}</small></strong></div><div><span>Concepts practiced</span><strong>{stats.practiced}<small> / {stats.concepts}</small></strong></div><div><span>Latest score</span><strong className="latest-score">{latest ? `${latest.correct} / ${latest.total}` : 'No test scores yet'}</strong></div></section>
    <div className="subject-actions"><Link className="button button-primary" to={`/subjects/${subject.id}/study`} aria-label="Study"><BookOpen size={18} />Study the lessons</Link><Link className="button button-secondary" to={`/subjects/${subject.id}/test`} aria-label="Test"><ClipboardCheck size={18} />Practice questions</Link>{subject.id === 'cit015' && period.id === '2026-finals' ? <Link className="button button-ghost" to={`/subjects/${subject.id}/crossword`}><Puzzle size={18} />Crosswords</Link> : null}</div>
    <section className="finals-syllabus"><div className="section-heading"><h2>Your {period.label.toLowerCase()} coverage</h2><span>{subject.topics.length} lessons</span></div>{subject.topics.map((topic, index) => <Link className="syllabus-row" key={topic.id} to={`/subjects/${subject.id}/study?topic=${topic.id}`}><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{topic.title}</strong><p>{topic.description}</p><small>{topic.sections.filter((section) => data.reviewedSections.includes(sectionKey(subject.id, topic.id, section.id))).length} / {topic.sections.length} sections reviewed</small></span><ArrowRight size={18} /></Link>)}</section>
    <div className="subject-reset"><p>Reading progress and practice accuracy measure different things. Take a session to see what you remember.</p><button className="text-button" type="button" onClick={reset}>Reset progress</button></div>
  </section>;
}
