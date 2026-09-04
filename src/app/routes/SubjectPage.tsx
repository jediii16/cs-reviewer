import { ArrowLeft, Brain, PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubjectPage() {
  return (
    <section className="subject-page" aria-labelledby="subject-title">
      <Link className="back-link" to="/"><ArrowLeft aria-hidden="true" /> Subjects</Link>
      <div className="subject-heading">
        <div>
          <p className="section-label">Information Security</p>
          <h1 id="subject-title">CIT.017</h1>
          <p>Learn the concepts, then practice with scenario-based questions.</p>
        </div>
        <div className="progress-stamp">
          <span>Course progress</span>
          <strong>0%</strong>
        </div>
      </div>

      <div className="mode-list" aria-label="Choose a review mode">
        <Link aria-label="Study" className="mode-row mode-row-primary" to="/subjects/cit017/study">
          <span className="mode-icon" aria-hidden="true"><Brain /></span>
          <span><strong>Study</strong><small>Review lessons and use active recall</small></span>
          <span className="mode-action">Open notes</span>
        </Link>
        <Link aria-label="Test" className="mode-row" to="/subjects/cit017/test">
          <span className="mode-icon" aria-hidden="true"><PencilLine /></span>
          <span><strong>Test</strong><small>Answer scenarios and review mistakes</small></span>
          <span className="mode-action">Start practice</span>
        </Link>
      </div>
    </section>
  );
}
