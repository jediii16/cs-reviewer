import { ArrowRight, BookOpen, Check, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoamingBappi } from '../../components/RoamingBappi';
import { Button } from '../../components/Button';
import { useLearning } from '../../features/learning/useLearning';
import { dueMistakes, learningStats, sectionKey, weakestConcept } from '../../features/learning/model';
import { createQuiz } from '../../features/test/quizEngine';

export function HomePage() {
  const { state, period, subjects, questions, data, actions } = useLearning();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const allQuestions = Object.values(questions).flat();
  const stats = learningStats(data, subjects, allQuestions);
  const due = dueMistakes(data, now);
  const latest = data.lastActivity;
  const session = latest?.kind === 'quiz' ? data.sessions[latest.subjectId] : undefined;
  const continuingQuiz = session && session.finishedAt === undefined;
  const position = Object.values(data.positions).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const studySubject = subjects.find((s) => s.id === position?.subjectId);
  const studyTopic = studySubject?.topics.find((t) => t.id === position?.topicId);
  const continueStudy = studyTopic && !continuingQuiz;
  const first = subjects[0];
  const nextHref = continuingQuiz ? `/subjects/${session.subjectId}/test?session=${session.id}` : continueStudy ? `/subjects/${position.subjectId}/study?topic=${position.topicId}&section=${position.sectionId}` : due.length ? '/review' : first ? `/subjects/${first.id}/test` : '/settings';
  const weakest = weakestConcept(data, questions);
  function quickReview() {
    if (!first) return;
    const bank = questions[first.id] ?? [];
    const id = actions.startQuiz(first.id, '5-minute quick review', createQuiz(bank, Math.random, { limit: 5, balanceByTopic: true, balanceByKind: true }), 'learn', 5);
    if (id) navigate(`/subjects/${first.id}/test?session=${id}`);
  }
  return <section className="desk-page" aria-labelledby="home-title">
    <header className="desk-heading"><div><span className="eyebrow">{period.label} season · one step at a time</span><h1 id="home-title">A little progress,<br /><em>every day.</em></h1><p>Your space to learn, try, and come back stronger.</p></div><RoamingBappi /></header>
    {first ? <>
      <div className="desk-next"><div className="desk-next-copy"><span className="eyebrow"><span className="live-dot" />Your next small step</span><h2>{continuingQuiz ? 'Pick up where you left off.' : continueStudy ? 'Your lesson is right here.' : due.length ? 'A little recall goes a long way.' : 'Let’s find your starting point.'}</h2><p>{continuingQuiz ? `${session.title} · Question ${session.index + 1} of ${session.questions.length}. Same order. Same saved answers.` : continueStudy ? `${studyTopic.title} · ${studyTopic.sections.find((s) => s.id === position.sectionId)?.title ?? 'Continue reading'}` : due.length ? `${due.length} ${due.length === 1 ? 'question is' : 'questions are'} ready to revisit today.` : 'Start a short practice session or settle into the lesson notes.'}</p><Link className="button button-primary" to={nextHref}>{continuingQuiz ? 'Continue session' : continueStudy ? 'Continue studying' : due.length ? 'Review due questions' : 'Start practicing'}<ArrowRight size={18} /></Link></div><div className="desk-next-side"><span className="outline-spark"><Sparkles size={29} /></span><span>Small steps count.</span><small>Go at your own pace.</small></div></div>
      <div className="desk-stats" aria-label="Learning progress"><div><span>Sections reviewed</span><strong>{stats.reviewed}<small> / {stats.sections}</small></strong></div><div><span>Concepts practiced</span><strong>{stats.practiced}<small> / {stats.concepts}</small></strong></div><div><span>Recent accuracy</span><strong>{stats.accuracy === null ? '—' : `${stats.accuracy}%`}</strong><small>{stats.accuracy === null ? 'Take a session to begin' : 'From completed sessions'}</small></div></div>
      <div className="desk-columns"><section className="desk-lessons" aria-labelledby="lessons-heading"><div className="section-heading"><h2 id="lessons-heading">On your study desk</h2><span>{subjects.reduce((sum, s) => sum + s.topics.length, 0)} lessons</span></div>
        {subjects.map((subject) => <div key={subject.id} className="subject-syllabus"><Link className="subject-label" to={`/subjects/${subject.id}`}>{subject.code} <span>{subject.title}</span><ChevronRight size={15} /></Link>{subject.topics.map((topic, index) => {
          const reviewed = topic.sections.filter((s) => data.reviewedSections.includes(sectionKey(subject.id, topic.id, s.id))).length;
          return <Link className="desk-lesson-row" to={`/subjects/${subject.id}/study?topic=${topic.id}`} key={topic.id}><span className={`lesson-number ${reviewed === topic.sections.length ? 'complete' : ''}`}>{reviewed === topic.sections.length ? <Check size={18} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{topic.title}</strong><small>{topic.sections.length} sections · {reviewed ? `${reviewed} reviewed` : 'Ready when you are'}</small></span><ArrowRight size={18} /></Link>;
        })}</div>)}
        {weakest ? <div className="next-recommendation"><BookOpen size={20} /><div><strong>A good concept to revisit</strong><p>{weakest.concept} has your lowest practiced accuracy ({Math.round(weakest.accuracy * 100)}%).</p><Link to={`/subjects/${weakest.subjectId}/test?topic=${weakest.topicId}&concept=${encodeURIComponent(weakest.concept)}`}>Practice this concept<ArrowRight size={14} /></Link></div></div> : null}
      </section><aside className="desk-sidebar"><div className="daily-review"><span className="eyebrow">Keep it gentle</span><h2>Just five minutes.</h2><p>A short review is a good place to start. Five questions, then back to your day.</p><Button variant="secondary" onClick={quickReview} disabled={!(questions[first.id]?.length)}><Clock3 size={16} />Start 5-minute review</Button><small>{Math.min(5, questions[first.id]?.length ?? 0)} questions · 5-minute limit</small></div><Link className="review-queue-link" to="/review"><span><strong>{Object.keys(data.mistakes).length} saved mistakes</strong><small>{due.length ? `${due.length} due today` : 'A little practice for another day'}</small></span><ArrowRight size={17} /></Link></aside></div>
    </> : <div className="empty-state"><BookOpen size={32} /><h2>A fresh page for {period.label.toLowerCase()}.</h2><p>This period has no lessons yet. Import a syllabus here, or switch back to Finals to keep studying.</p><div className="result-actions"><Button onClick={() => actions.setPeriod('2026-finals')} disabled={state.periods.find((p) => p.id === '2026-finals')?.archived}>Back to Finals</Button><Link to="/settings" className="button button-secondary">Import a syllabus</Link></div></div>}
  </section>;
}
