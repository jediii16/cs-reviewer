import { ArrowRight, BookOpen, Clock3, Gamepad2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoamingBappi } from '../../components/RoamingBappi';
import { Button } from '../../components/Button';
import { useLearning } from '../../features/learning/useLearning';
import { dueMistakes, learningStats, weakestConcept } from '../../features/learning/model';
import { createQuiz } from '../../features/test/quizEngine';

export function HomePage() {
  const { state, period, subjects, questions, data, actions } = useLearning();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const stats = learningStats(data, subjects, Object.values(questions).flat());
  const due = dueMistakes(data, now);
  const session = data.lastActivity?.kind === 'quiz' ? data.sessions[data.lastActivity.subjectId] : undefined;
  const continuingQuiz = session && session.finishedAt === undefined;
  const position = Object.values(data.positions).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const studySubject = subjects.find(subject => subject.id === position?.subjectId);
  const studyTopic = studySubject?.topics.find(topic => topic.id === position?.topicId);
  const first = subjects[0];
  const weakest = weakestConcept(data, questions);
  function quickReview() {
    if (!first) return;
    const id = actions.startQuiz(first.id, '5-minute quick review', createQuiz(questions[first.id] ?? [], Math.random, { limit: 5, balanceByTopic: true, balanceByKind: true }), 'learn', 5);
    if (id) navigate(`/subjects/${first.id}/test?session=${id}`);
  }
  return <section className="home-page classic-home" aria-labelledby="home-title">
    <div className="home-hero"><div className="home-intro"><h1 id="home-title">What are we reviewing today?</h1><p>Pick a subject, study the material, then test what you remember.</p></div><RoamingBappi /></div>
    <div className="subject-list">{subjects.map(subject => <Link className="subject-row" to={`/subjects/${subject.id}`} key={subject.id} aria-label={`${subject.code} ${subject.title}`}><span className="subject-icon" aria-hidden="true"><BookOpen /></span><span className="subject-copy"><strong>{subject.code}</strong><span>{subject.title}</span></span><ArrowRight aria-hidden="true" /></Link>)}<Link className="subject-row" to="/subjects/cognate3/jeopardy" aria-label="Cognate 3 Image Processing · Jeopardy practice"><span className="subject-icon" aria-hidden="true"><Gamepad2 /></span><span className="subject-copy"><strong>Cognate 3</strong><span>Image Processing · Jeopardy practice</span></span><ArrowRight aria-hidden="true" /></Link></div>
    {first ? <>
      {continuingQuiz ? <div className="classic-resume"><div><strong>{session.title}</strong><p>Question {session.index + 1} of {session.questions.length} · Your answers are saved.</p></div><Link className="text-button" to={`/subjects/${session.subjectId}/test?session=${session.id}`}>Continue session<ArrowRight size={15} /></Link></div> : studyTopic ? <div className="classic-resume"><div><strong>{studyTopic.title}</strong><p>{studyTopic.sections.find(section => section.id === position.sectionId)?.title}</p></div><Link className="text-button" to={`/subjects/${position.subjectId}/study?topic=${position.topicId}&section=${position.sectionId}`}>Continue studying<ArrowRight size={15} /></Link></div> : null}
      <div className="desk-stats classic-stats" aria-label="Learning progress"><div><span>Sections reviewed</span><strong>{stats.reviewed}<small> / {stats.sections}</small></strong></div><div><span>Concepts practiced</span><strong>{stats.practiced}<small> / {stats.concepts}</small></strong></div><div><span>Recent accuracy</span><strong>{stats.accuracy === null ? '—' : `${stats.accuracy}%`}</strong></div></div>
      <div className="classic-shortcuts"><Button variant="secondary" onClick={quickReview} disabled={!(questions[first.id]?.length)}><Clock3 size={16} />Start 5-minute review</Button><Link className="text-button" to="/review">{Object.keys(data.mistakes).length} saved mistakes · {due.length} due<ArrowRight size={15} /></Link></div>
      {weakest ? <p className="classic-recommendation">Review next: <Link to={`/subjects/${weakest.subjectId}/test?topic=${weakest.topicId}&concept=${encodeURIComponent(weakest.concept)}`}>{weakest.concept}</Link> ({Math.round(weakest.accuracy * 100)}% accuracy).</p> : null}
    </> : <div className="empty-state"><h2>A fresh page for {period.label.toLowerCase()}.</h2><p>This period has no lesson syllabus yet. You can still practice Cognate 3 Jeopardy above.</p><div className="result-actions"><Button onClick={() => actions.setPeriod('2026-finals')} disabled={state.periods.find(item => item.id === '2026-finals')?.archived}>Back to Finals</Button><Link to="/settings" className="button button-secondary">Import a syllabus</Link></div></div>}
  </section>;
}
