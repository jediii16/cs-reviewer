import { ArrowLeft, ArrowRight, Check, Clock3, Layers3, Play } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import type { ChoiceQuestion } from '../../content/types';
import { Button } from '../../components/Button';
import { BappiMascot } from '../../components/BappiMascot';
import { useLearning } from '../../features/learning/useLearning';
import { createQuiz } from '../../features/test/quizEngine';
import { QuizSessionRunner } from '../../features/test/QuizSessionRunner';

export function TestPage() {
  const { subjectId } = useParams();
  const { subjects, questions, data, state, actions } = useLearning();
  const subject = subjects.find((s) => s.id === subjectId);
  const [params, setParams] = useSearchParams();
  const [lesson, setLesson] = useState(params.get('topic') ?? 'all');
  const [format, setFormat] = useState('all');
  const [length, setLength] = useState('20');
  const [mode, setMode] = useState<'learn' | 'exam'>('learn');
  const [minutes, setMinutes] = useState('0');
  const [concept, setConcept] = useState(params.get('concept') ?? '');
  if (!subject) return <Navigate to="/" replace />;
  const bank = questions[subject.id] ?? [];
  const pool = bank.filter((q) => (lesson === 'all' || q.topicId === lesson) && (format === 'all' || q.kind === format) && (!concept || q.concept === concept));
  const session = data.sessions[subject.id];
  const count = length === 'all' ? pool.length : Math.min(Number(length), pool.length);
  const hasSession = session && params.get('session') === session.id;
  const showSession = (id: string) => { actions.resumeQuiz(subject.id, id); setParams({ session: id }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  function start(title: string, bankToUse: ChoiceQuestion[], limit = bankToUse.length, sessionMode = mode, time = Number(minutes)) {
    const selected = createQuiz(bankToUse, Math.random, { limit, balanceByTopic: true, balanceByKind: true });
    const id = actions.startQuiz(subject!.id, title, selected, sessionMode, time);
    if (id) showSession(id);
  }

  if (hasSession) return <section className="test-page test-page-running" key={`${state.activePeriodId}-${session.id}`}>
    <button className="back-link back-link-button" type="button" onClick={() => setParams({})}><ArrowLeft size={16} />{session.finishedAt === undefined ? 'Save & leave session' : 'Back to practice sets'}</button>
    <QuizSessionRunner key={session.id} session={session} onExit={() => setParams({})} onSessionChange={showSession} />
  </section>;

  return <section className="practice-page" aria-labelledby="test-title" key={state.activePeriodId}>
    <Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft size={16} />{subject.code} · {subject.title}</Link>
    <header className="page-intro"><div><span className="eyebrow">Practice with purpose</span><h1 id="test-title">Make it <em>stick.</em></h1><p>A few questions today. A little more confidence tomorrow.</p></div><BappiMascot pose="focused" className="intro-bappi" alt="Bappi is ready for practice" /></header>
    {session?.finishedAt === undefined && session ? <div className="resume-strip"><span><strong>Your session is waiting.</strong><small>{session.title} · Question {session.index + 1} of {session.questions.length}</small></span><Button variant="secondary" onClick={() => showSession(session.id)}>Continue session<ArrowRight size={16} /></Button></div> : null}
    {bank.length ? <>
      <div className="practice-layout">
        <form className="practice-builder" onSubmit={(event) => { event.preventDefault(); start(concept ? `${concept} practice` : `${subject.title} practice`, pool, count); }}>
          <h2>Your session, your pace</h2>
          {concept ? <div className="concept-focus"><span>Focus concept: <strong>{concept}</strong></span><button type="button" className="text-button" onClick={() => setConcept('')}>Clear focus</button></div> : null}
          <fieldset className="mode-switch"><legend>How would you like to practice?</legend>
            <label className={mode === 'learn' ? 'selected' : ''}><input type="radio" name="mode" value="learn" checked={mode === 'learn'} onChange={() => setMode('learn')} /><strong>Learn</strong><span>Check each answer as you go</span>{mode === 'learn' ? <Check size={16} /> : null}</label>
            <label className={mode === 'exam' ? 'selected' : ''}><input type="radio" name="mode" value="exam" checked={mode === 'exam'} onChange={() => setMode('exam')} /><strong>Mock exam</strong><span>Get all feedback at the end</span>{mode === 'exam' ? <Check size={16} /> : null}</label>
          </fieldset>
          <div className="form-grid">
            <label>Lesson<select value={lesson} onChange={(event) => setLesson(event.currentTarget.value)}><option value="all">All lessons</option>{subject.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
            <label>Question type<select value={format} onChange={(event) => setFormat(event.currentTarget.value)}><option value="all">Both types</option><option value="multiple-choice">Multiple choice</option><option value="true-false">True or false</option></select></label>
            <label>Session length<select value={length} onChange={(event) => setLength(event.currentTarget.value)}><option value="5">5 questions</option><option value="10">10 questions</option><option value="20">20 questions</option><option value="all">All available questions</option></select></label>
            <label>Time limit<select value={minutes} onChange={(event) => setMinutes(event.currentTarget.value)}><option value="0">No timer</option><option value="5">5 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label>
          </div>
          <p className="session-preview"><Layers3 size={16} />{count} questions · {mode === 'learn' ? 'Immediate feedback' : 'Feedback after submission'}{Number(minutes) ? ` · ${minutes} minutes` : ' · Untimed'}</p>
          {session && session.finishedAt === undefined ? <p className="muted small">Starting a new session replaces this subject’s unfinished session. Submitted practice is already saved.</p> : null}
          <Button type="submit" disabled={count === 0}><Play size={16} />{session?.finishedAt === undefined && session ? 'Start new session' : 'Start session'}</Button>
        </form>
        <aside className="practice-aside">
          <div className="quick-review-card"><span className="small-icon"><Clock3 size={23} /></span><span className="eyebrow">A small daily win</span><h2>Got five minutes?</h2><p>Five questions from your lessons, with explanations as you go.</p><Button variant="secondary" onClick={() => start('5-minute quick review', bank, 5, 'learn', 5)}>Start 5-minute review<ArrowRight size={16} /></Button><small>{Math.min(5, bank.length)} questions · 5-minute limit</small></div>
          <p className="aside-note">No lost progress. Leave anytime and continue with the same questions and answers. Timers keep running while you’re away.</p>
        </aside>
      </div>
      <section className="ready-sets" aria-labelledby="ready-sets-title"><div className="section-heading"><h2 id="ready-sets-title">Or pick a ready-made set</h2><span>{bank.length} questions in your bank</span></div>
        {subject.topics.map((topic) => <div className="ready-topic" key={topic.id}><h3>{topic.title}</h3><div>{(['multiple-choice', 'true-false'] as const).map((kind) => {
          const focused = bank.filter((q) => q.topicId === topic.id && q.kind === kind);
          return focused.length ? <button type="button" className="ready-set" key={kind} onClick={() => start(`${topic.title} · ${kind === 'true-false' ? 'True or false' : 'Multiple choice'}`, focused, focused.length, 'learn', 0)} aria-label={`${topic.title} ${kind === 'true-false' ? 'True or false' : 'Multiple choice'} ${focused.length} questions`}><span>{kind === 'true-false' ? 'True or false' : 'Multiple choice'}</span><small>{focused.length} questions</small><ArrowRight size={17} /></button> : null;
        })}</div></div>)}
        <button className="mixed-set" type="button" onClick={() => start('Mixed finals review', bank, Math.min(20, bank.length), 'learn', 0)}><span><strong>Mixed {state.activePeriodId === '2026-finals' ? 'finals ' : ''}review</strong><small>A balanced mix of lessons and question types</small></span><span>{Math.min(20, bank.length)} questions</span><ArrowRight size={18} /></button>
      </section>
    </> : <div className="empty-state"><h2>No questions in this syllabus yet</h2><p>You can still study the notes or import a syllabus with a question bank.</p><Link to="/settings" className="button button-secondary">Manage syllabus</Link></div>}
  </section>;
}
