import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RoamingBappi } from '../../components/RoamingBappi';
import { subjects } from '../../content/subjects';

export function HomePage() {
  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="home-hero">
        <div className="home-intro">
          <h1 id="home-title">What are we reviewing today?</h1>
          <p>Pick a subject, study the material, then test what you remember.</p>
        </div>
        <RoamingBappi />
      </div>

      <div className="subject-list">
        {subjects.map((subject) => (
          <Link className="subject-row" to={`/subjects/${subject.id}`} key={subject.id}>
            <span className="subject-icon" aria-hidden="true"><BookOpen /></span>
            <span className="subject-copy">
              <strong>{subject.code}</strong>
              <span>{subject.title}</span>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
