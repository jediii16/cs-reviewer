import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="home-intro">
        <p className="section-label">Your subjects</p>
        <h1 id="home-title">What are we reviewing today?</h1>
        <p>Pick a subject, study the material, then test what you remember.</p>
      </div>

      <Link className="subject-row" to="/subjects/cit017">
        <span className="subject-icon" aria-hidden="true"><BookOpen /></span>
        <span className="subject-copy">
          <strong>CIT.017</strong>
          <span>Foundations of Information Security</span>
        </span>
        <span className="subject-status">Ready to study</span>
        <ArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}
