import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getSubject } from '../../content/subjects';
import { useProgress } from '../../features/progress/useProgress';
import { StudyLesson } from '../../features/study/StudyLesson';

export function StudyPage() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const [topicId, setTopicId] = useState(subject?.topics[0]?.id ?? '');
  const { progress, markTopicReviewed } = useProgress();

  if (!subject) return <Navigate to="/" replace />;

  const topic = subject.topics.find((item) => item.id === topicId) ?? subject.topics[0];
  if (!topic) return <Navigate to={`/subjects/${subject.id}`} replace />;

  return (
    <section className="study-page" aria-labelledby="study-title">
      <div className="study-topbar">
        <Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft aria-hidden="true" /> {subject.code}</Link>
        <div>
          <h1 id="study-title">Study {subject.code}</h1>
        </div>
      </div>

      <div className="study-layout">
        <nav className="topic-nav" aria-label="Study topics">
          <p>Topics</p>
          {subject.topics.map((item, index) => {
            const isReviewed = progress.reviewedTopicIds.includes(item.id);
            return (
              <button
                key={item.id}
                className={item.id === topic.id ? 'is-active' : ''}
                aria-current={item.id === topic.id ? 'page' : undefined}
                onClick={() => setTopicId(item.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.title}</strong>
                {isReviewed ? <Check aria-label="Reviewed" /> : null}
              </button>
            );
          })}
        </nav>

        <StudyLesson
          key={topic.id}
          topic={topic}
          reviewed={progress.reviewedTopicIds.includes(topic.id)}
          onComplete={markTopicReviewed}
        />
      </div>
    </section>
  );
}
