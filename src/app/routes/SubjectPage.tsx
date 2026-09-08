import { ArrowLeft, BookOpen, Calculator, ClipboardCheck, GalleryHorizontalEnd, Puzzle } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { getSubject } from '../../content/subjects';
import { useProgress } from '../../features/progress/useProgress';

export function SubjectPage() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const { progress, resetSubject } = useProgress();

  if (!subject) return <Navigate to="/" replace />;

  const currentSubject = subject;

  const knownTopicIds = new Set(currentSubject.topics.map((topic) => topic.id));
  const reviewedCount = new Set(progress.reviewedTopicIds.filter((id) => knownTopicIds.has(id))).size;
  const progressPercent = currentSubject.topics.length === 0
    ? 0
    : Math.min(100, Math.round((reviewedCount / currentSubject.topics.length) * 100));
  const latestResult = progress.recentResults.find((result) => (
    result.subjectId ? result.subjectId === currentSubject.id : currentSubject.id === 'cit017'
  ));

  function confirmReset() {
    if (window.confirm(`Reset reviewed topics and recent scores for ${currentSubject.code}?`)) {
      resetSubject(currentSubject.id, currentSubject.topics.map((topic) => topic.id));
    }
  }
  return (
    <section className="subject-page" aria-labelledby="subject-title">
      <Link className="back-link" to="/"><ArrowLeft aria-hidden="true" /> Subjects</Link>
      <div className="subject-heading">
        <div>
          <h1 id="subject-title">{currentSubject.code}</h1>
          <p>{currentSubject.id === 'cs412' ? 'Master the likely terms in real crosswords, then solve a complete 30-point preprocessing set.' : 'Learn each concept, self-check with flashcards, then practice complete multiple-choice sets.'}</p>
        </div>
        <BappiMascot
          className="subject-heading-mascot"
          pose={progressPercent > 0 ? 'celebrating' : 'cool'}
          alt={progressPercent > 0 ? 'Bappi cheers on your progress' : 'Bappi is ready to review'}
        />
      </div>

      {currentSubject.id === 'cs412' ? <section className="review-summary cs412-review-summary" aria-label="CS.412 exam format">
        <div className="review-stat"><span>Theory coverage</span><strong>56 likely terms</strong></div>
        <div className="review-stat"><span>Exam practice</span><strong>15 clues + 30-point solving</strong></div>
      </section> : <section className="review-summary" aria-label="Saved review progress">
        <div className="review-stat">
          <span>Course progress</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="review-stat">
          <span>Latest score</span>
          <strong>{latestResult ? `${latestResult.correct} / ${latestResult.total}` : 'No test scores yet'}</strong>
        </div>
        <button type="button" onClick={confirmReset}>Reset progress</button>
      </section>}

      {currentSubject.id === 'cs412' ? <div className="mode-list cs412-mode-list" aria-label="Choose a review mode">
        <Link aria-label="Study" className="mode-row" to="/subjects/cs412/study"><span className="mode-icon"><BookOpen /></span><span><strong>Study</strong><small>Words, definitions, formulas, and worked examples</small></span><span className="mode-action">Learn first</span></Link>
        <Link aria-label="Crossword practice" className="mode-row mode-row-primary" to="/subjects/cs412/crossword"><span className="mode-icon"><Puzzle /></span><span><strong>Crossword practice</strong><small>Real 15-item interlocking puzzles</small></span><span className="mode-action">Open puzzle lab</span></Link>
        <Link aria-label="Data preprocessing" className="mode-row" to="/subjects/cs412/preprocessing"><span className="mode-icon"><Calculator /></span><span><strong>Data preprocessing</strong><small>6 problems · 30 points</small></span><span className="mode-action">Start solving</span></Link>
      </div> : <div className="mode-list" aria-label="Choose a review mode">
        <Link aria-label="Study" className="mode-row mode-row-primary" to={`/subjects/${currentSubject.id}/study`}>
          <span className="mode-icon" aria-hidden="true"><BookOpen /></span>
          <span><strong>Study</strong><small>Review lessons and use active recall</small></span>
          <span className="mode-action">Open notes</span>
        </Link>
        <Link aria-label="Flashcards" className="mode-row" to={`/subjects/${currentSubject.id}/flashcards`}>
          <span className="mode-icon" aria-hidden="true"><GalleryHorizontalEnd /></span>
          <span><strong>Flashcards</strong><small>Practice identification at your own pace</small></span>
          <span className="mode-action">Choose a deck</span>
        </Link>
        <Link aria-label="Test" className="mode-row" to={`/subjects/${currentSubject.id}/test`}>
          <span className="mode-icon" aria-hidden="true"><ClipboardCheck /></span>
          <span><strong>Test</strong><small>Complete focused multiple-choice sets</small></span>
          <span className="mode-action">Choose a set</span>
        </Link>
      </div>}
    </section>
  );
}
