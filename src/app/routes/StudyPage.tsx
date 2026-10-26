import { ArrowLeft, Check, ChevronRight, Search } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useLearning } from '../../features/learning/useLearning';
import { positionKey, sectionKey } from '../../features/learning/model';
import { StudyLesson } from '../../features/study/StudyLesson';

export function StudyPage() {
  const { subjectId } = useParams();
  const { subjects, data, actions, state } = useLearning();
  const [params, setParams] = useSearchParams();
  const subject = subjects.find((s) => s.id === subjectId);
  const last = Object.values(data.positions).filter((p) => p.subjectId === subjectId).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const topic = subject?.topics.find((t) => t.id === (params.get('topic') ?? last?.topicId)) ?? subject?.topics[0];
  const savedPosition = subject && topic ? data.positions[positionKey(subject.id, topic.id)] : undefined;
  const section = topic?.sections.find((s) => s.id === (params.get('section') ?? savedPosition?.sectionId)) ?? topic?.sections[0];
  useEffect(() => {
    if (subject && topic && section) actions.savePosition(subject.id, topic.id, section.id);
  }, [subject, topic, section, actions]);
  if (!subject || !topic || !section) return <Navigate to="/" replace />;
  const topicReviewed = topic.sections.every((s) => data.reviewedSections.includes(sectionKey(subject.id, topic.id, s.id)));
  return <section className="study-page modern-study" aria-labelledby="study-title">
    <div className="study-topbar"><Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft size={16} />{subject.title}</Link><Link className="text-button" to="/search"><Search size={16} />Search lessons</Link></div>
    <h1 className="study-page-title" id="study-title">{topic.title}</h1>
    <div className="study-layout">
      <aside className="study-sidebar"><span className="eyebrow">Your lessons</span><nav className="topic-nav" aria-label="Study topics">
        {subject.topics.map((item, index) => <div key={item.id} className="study-topic-group"><button type="button" className={item.id === topic.id ? 'is-active' : ''} aria-current={item.id === topic.id ? 'page' : undefined} onClick={() => setParams({ topic: item.id })}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronRight size={15} /></button>
          {item.id === topic.id ? <ol className="section-links">{item.sections.map((s) => <li key={s.id}><button type="button" className={s.id === section.id ? 'current' : ''} aria-current={s.id === section.id ? 'step' : undefined} onClick={() => setParams({ topic: item.id, section: s.id })}>{data.reviewedSections.includes(sectionKey(subject.id, item.id, s.id)) ? <Check size={13} aria-label="Reviewed" /> : <span className="section-dot" />}<span>{s.title}</span></button></li>)}</ol> : null}
        </div>)}
      </nav><p className="study-save-note">Your place is saved automatically. Come back anytime.</p><Link className="button button-secondary" to={`/subjects/${subject.id}/test?topic=${topic.id}`}>Practice this lesson</Link></aside>
      <StudyLesson key={`${state.activePeriodId}:${topic.id}`} topic={topic} activeSectionId={section.id} onSectionChange={(id) => setParams({ topic: topic.id, section: id })} reviewed={topicReviewed} onComplete={() => actions.reviewTopic(subject.id, topic.id)} sectionReviewed={data.reviewedSections.includes(sectionKey(subject.id, topic.id, section.id))} onReviewSection={() => actions.reviewSection(subject.id, topic.id, section.id)} />
    </div>
  </section>;
}
