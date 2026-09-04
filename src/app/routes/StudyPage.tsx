import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cit017Subject } from '../../content/cit017';
import { useProgress } from '../../features/progress/useProgress';
import { StudyLesson } from '../../features/study/StudyLesson';

export function StudyPage() {
  const [topicId, setTopicId] = useState(cit017Subject.topics[0].id);
  const { progress, markTopicReviewed } = useProgress();
  const topic = cit017Subject.topics.find((item) => item.id === topicId) ?? cit017Subject.topics[0];

  return (
    <section className="study-page" aria-labelledby="study-title">
      <div className="study-topbar">
        <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
        <div>
          <p className="section-label">Study mode</p>
          <h1 id="study-title">Learn it in layers.</h1>
        </div>
      </div>

      <div className="study-layout">
        <nav className="topic-nav" aria-label="Study topics">
          <p>Topics</p>
          {cit017Subject.topics.map((item, index) => {
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
