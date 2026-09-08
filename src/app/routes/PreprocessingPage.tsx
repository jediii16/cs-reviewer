import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PreprocessingPractice } from '../../features/preprocessing/PreprocessingPractice';

export function PreprocessingPage() {
  return <section className="cs412-page"><Link className="back-link" to="/subjects/cs412"><ArrowLeft /> CS.412</Link><header className="cs412-hero"><div><h1>Data preprocessing lab</h1><p>Six calculation problems, five points each. Work them out, check your process, and open the calculator anytime.</p></div><FlaskConical /></header><PreprocessingPractice /></section>;
}
