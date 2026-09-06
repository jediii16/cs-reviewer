import { Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomePage } from './routes/HomePage';
import { SubjectPage } from './routes/SubjectPage';
import { StudyPage } from './routes/StudyPage';
import { TestPage } from './routes/TestPage';
import { FlashcardsPage } from './routes/FlashcardsPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
      <Route path="subjects/:subjectId" element={<SubjectPage />} />
      <Route path="subjects/:subjectId/study" element={<StudyPage />} />
      <Route path="subjects/:subjectId/flashcards" element={<FlashcardsPage />} />
      <Route path="subjects/:subjectId/test" element={<TestPage />} />
      </Route>
    </Routes>
  );
}
