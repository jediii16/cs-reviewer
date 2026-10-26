import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLearning } from '../../features/learning/useLearning';

export function SearchPage() {
  const { subjects } = useLearning();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const normalized = query.trim().toLocaleLowerCase();
  const allSections = subjects.flatMap((subject) => subject.topics.flatMap((topic) => topic.sections.map((section) => ({ subject, topic, section }))));
  const matches = normalized ? allSections.filter(({ section, topic }) => [topic.title, section.title, section.summary, ...(section.bullets ?? []), ...(section.examples ?? []), ...(section.terms ?? []).flatMap((term) => [term.term, term.definition, ...(term.notes ?? [])])].join(' ').toLocaleLowerCase().includes(normalized)) : allSections;
  return <section className="search-page"><header className="page-intro"><div><span className="eyebrow">Find a little clarity</span><h1>What’s on your <em>mind?</em></h1><p>Search your lesson terms, notes, and examples.</p></div></header>
    <label className="lesson-search"><Search size={21} /><span className="sr-only">Search lesson terms</span><input type="search" aria-label="Search lesson terms" placeholder="Try deadlock, read lock, indexed allocation…" value={query} onChange={(event) => setParams(event.currentTarget.value ? { q: event.currentTarget.value } : {}, { replace: true })} /></label>
    <div className="section-heading"><h2>{normalized ? `${matches.length} matching sections` : 'Explore your lessons'}</h2><span>Jump straight to a section</span></div>
    <div className="search-results">{matches.map(({ subject, topic, section }) => <Link key={`${subject.id}-${topic.id}-${section.id}`} to={`/subjects/${subject.id}/study?topic=${topic.id}&section=${section.id}`}><span className="search-result-icon"><BookOpen size={19} /></span><span><small>{subject.code} · {topic.title}</small><strong>{section.title}</strong><p>{section.summary}</p>{section.terms?.some((term) => normalized && term.term.toLocaleLowerCase().includes(normalized)) ? <span className="matched-term">Includes: {section.terms.filter((term) => term.term.toLocaleLowerCase().includes(normalized)).map((term) => term.term).join(', ')}</span> : null}</span><ArrowRight size={18} /></Link>)}</div>
    {!matches.length ? <div className="empty-state"><Search size={28} /><h2>No matching sections yet.</h2><p>Try a shorter term, or check which exam period is selected.</p></div> : null}
  </section>;
}
