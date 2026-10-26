import { ArrowRight, Bookmark, Brain, Check, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { BappiMascot } from '../../components/BappiMascot';
import { useLearning } from '../../features/learning/useLearning';
import { dueMistakes } from '../../features/learning/model';
import { createQuiz, getCorrectAnswerLabel } from '../../features/test/quizEngine';
import { QuestionExplanation } from '../../features/test/QuestionExplanation';

export function ReviewPage() {
  const { subjects, questions, data, actions } = useLearning();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const selected = subjects.find((s) => s.id === params.get('subject')) ?? subjects[0];
  const tab = params.get('tab') === 'saved' ? 'saved' : 'mistakes';
  const [filter, setFilter] = useState('');
  const bank = selected ? questions[selected.id] ?? [] : [];
  const due = dueMistakes(data, now, selected?.id);
  const mistakes = bank.filter((q) => data.mistakes[q.id]);
  const saved = bank.filter((q) => data.bookmarks[q.id]);
  const list = (tab === 'saved' ? saved : mistakes).filter((q) => `${q.concept} ${q.prompt} ${data.bookmarks[q.id]?.note ?? ''}`.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  const tomorrow = Object.values(data.mistakes).filter((m) => m.subjectId === selected?.id && m.dueAt > now).sort((a, b) => a.dueAt - b.dueAt)[0];
  function startReview(onlyDue: boolean) {
    if (!selected) return;
    const ids = new Set(due.map((m) => m.questionId));
    const pool = tab === 'saved' ? saved : onlyDue ? mistakes.filter((q) => ids.has(q.id)) : mistakes;
    const id = actions.startQuiz(selected.id, tab === 'saved' ? 'Bookmarked questions' : 'Mistake review', createQuiz(pool, Math.random, { limit: 10, balanceByTopic: true, balanceByKind: true }));
    if (id) navigate(`/subjects/${selected.id}/test?session=${id}`);
  }
  return <section className="review-page" aria-labelledby="review-title"><header className="page-intro"><div><span className="eyebrow">A fresh look helps</span><h1 id="review-title">Come back <em>stronger.</em></h1><p>Your mistakes are a starting point. Your notes make them personal.</p></div><BappiMascot className="intro-bappi" pose="thinking" alt="Bappi is thinking" /></header>
    {subjects.length > 1 ? <label className="inline-select">Subject<select value={selected.id} onChange={(event) => setParams({ tab, subject: event.currentTarget.value })}>{subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label> : null}
    <div className="review-tabs" role="tablist" aria-label="Review library"><button type="button" role="tab" aria-selected={tab === 'mistakes'} onClick={() => setParams({ tab: 'mistakes', ...(selected ? { subject: selected.id } : {}) })}><Brain size={17} />Saved mistakes<span>{mistakes.length}</span></button><button type="button" role="tab" aria-selected={tab === 'saved'} onClick={() => setParams({ tab: 'saved', ...(selected ? { subject: selected.id } : {}) })}><Bookmark size={17} />Bookmarks<span>{saved.length}</span></button></div>
    <div role="tabpanel" aria-label={tab === 'saved' ? 'Bookmarked questions' : 'Saved mistakes'}>
      {tab === 'mistakes' && mistakes.length ? <div className="review-schedule"><div><span className="eyebrow"><Clock3 size={15} />Your review rhythm</span><h2>{due.length ? `${due.length} ready for today.` : 'You’re caught up for now.'}</h2><p>{due.length ? 'A short session brings these ideas back into focus.' : tomorrow ? `Next review: ${new Date(tomorrow.dueAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}. You can still practice early.` : 'New mistakes return tomorrow.'}</p><small>Misses return after 1 day. Correct reviews move to 3, 7, then 14 days.</small></div><div className="review-schedule-actions">{due.length ? <Button onClick={() => startReview(true)}>Review {Math.min(10, due.length)} due questions<ArrowRight size={16} /></Button> : null}<Button variant="secondary" onClick={() => startReview(false)}>Practice {Math.min(10, mistakes.length)} saved mistakes</Button></div></div> : null}
      {tab === 'saved' && saved.length ? <div className="section-heading"><h2>Your collection</h2><Button variant="secondary" onClick={() => startReview(false)}>Practice {Math.min(10, saved.length)} bookmarks<ArrowRight size={15} /></Button></div> : null}
      {(tab === 'saved' ? saved : mistakes).length ? <><label className="library-filter"><span className="sr-only">Filter review questions</span><input type="search" aria-label="Filter review questions" placeholder="Find a concept or personal note…" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} /></label><div className="library-list">{list.map((q) => {
        const mistake = data.mistakes[q.id]; const bookmark = data.bookmarks[q.id];
        return <article key={q.id}><div className="library-item-heading"><span className="question-type">{q.kind === 'true-false' ? 'True or false' : 'Multiple choice'}</span>{tab === 'mistakes' && mistake ? <span className={`due-label ${mistake.dueAt <= now ? 'due' : ''}`}>{mistake.dueAt <= now ? 'Due today' : `Next: ${new Date(mistake.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}`}</span> : <Bookmark size={17} />}</div><h3>{q.concept}</h3><p>{q.prompt}</p><details><summary>Review answer & explanation</summary><div><p><Check size={15} /> Correct answer: <strong>{getCorrectAnswerLabel(q)}</strong></p><QuestionExplanation question={q} /></div></details>
          {bookmark ? <label className="personal-note-label">Personal note<textarea aria-label={`Note for ${q.concept}`} rows={2} maxLength={10000} placeholder="Add the detail you want to remember…" value={bookmark.note} onChange={(event) => actions.saveBookmarkNote(q.id, event.currentTarget.value)} /><small>Saved automatically.</small></label> : null}
          <div className="library-item-actions"><button className="text-button" type="button" onClick={() => actions.bookmark(selected!.id, q.id)}><Bookmark size={15} />{bookmark ? 'Remove bookmark' : 'Bookmark & add note'}</button>{mistake && tab === 'mistakes' ? <button className="text-button muted" type="button" onClick={() => actions.removeMistake(q.id)}>Remove from queue</button> : null}</div>
        </article>;
      })}</div>{!list.length ? <p className="empty-state">No questions match that search.</p> : null}</> : <div className="empty-state">{tab === 'saved' ? <Bookmark size={32} /> : <Brain size={32} />}<h2>{tab === 'saved' ? 'Keep the tricky ones close.' : 'A clean slate.'}</h2><p>{tab === 'saved' ? 'Bookmark a question while practicing, then add a note about what you want to remember.' : 'Missed questions will appear here after you check an answer or submit an exam. They’ll be scheduled for another look tomorrow.'}</p>{selected ? <Button onClick={() => navigate(`/subjects/${selected.id}/test`)}>Start practicing<ArrowRight size={16} /></Button> : null}</div>}
    </div>
  </section>;
}
