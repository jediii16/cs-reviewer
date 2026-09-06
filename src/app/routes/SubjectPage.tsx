import { ArrowLeft, BookOpen, ClipboardCheck, GalleryHorizontalEnd } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { cit017Subject } from '../../content/cit017';
import { useProgress } from '../../features/progress/useProgress';

export function SubjectPage() {
  const { progress, reset } = useProgress();
  const knownTopicIds = new Set(cit017Subject.topics.map((topic) => topic.id));
  const reviewedCount = new Set(progress.reviewedTopicIds.filter((id) => knownTopicIds.has(id))).size;
  const progressPercent = Math.min(100, Math.round((reviewedCount / cit017Subject.topics.length) * 100));
  const latestResult = progress.recentResults[0];

  function confirmReset() {
    if (window.confirm('Reset reviewed topics, recent scores, and local preferences?')) reset();
  }
  return (
    <section className="subject-page" aria-labelledby="subject-title">
      <Link className="back-link" to="/"><ArrowLeft aria-hidden="true" /> Subjects</Link>
      <div className="subject-heading">
        <div>
          <h1 id="subject-title">CIT.017</h1>
          <p>Learn each concept, self-check with flashcards, then practice complete multiple-choice sets.</p>
        </div>
        <BappiMascot
          className="subject-heading-mascot"
          pose={progressPercent > 0 ? 'celebrating' : 'cool'}
          alt={progressPercent > 0 ? 'Bappi cheers on your progress' : 'Bappi is ready to review'}
        />
      </div>

      <section className="review-summary" aria-label="Saved review progress">
        <div className="review-stat">
          <span>Course progress</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="review-stat">
          <span>Latest score</span>
          <strong>{latestResult ? `${latestResult.correct} / ${latestResult.total}` : 'No test scores yet'}</strong>
        </div>
        <button type="button" onClick={confirmReset}>Reset progress</button>
      </section>

      <div className="mode-list" aria-label="Choose a review mode">
        <Link aria-label="Study" className="mode-row mode-row-primary" to="/subjects/cit017/study">
          <span className="mode-icon" aria-hidden="true"><BookOpen /></span>
          <span><strong>Study</strong><small>Review lessons and use active recall</small></span>
          <span className="mode-action">Open notes</span>
        </Link>
        <Link aria-label="Flashcards" className="mode-row" to="/subjects/cit017/flashcards">
          <span className="mode-icon" aria-hidden="true"><GalleryHorizontalEnd /></span>
          <span><strong>Flashcards</strong><small>Practice identification at your own pace</small></span>
          <span className="mode-action">Choose a deck</span>
        </Link>
        <Link aria-label="Test" className="mode-row" to="/subjects/cit017/test">
          <span className="mode-icon" aria-hidden="true"><ClipboardCheck /></span>
          <span><strong>Test</strong><small>Complete focused multiple-choice sets</small></span>
          <span className="mode-action">Choose a set</span>
        </Link>
      </div>
    </section>
  );
}
