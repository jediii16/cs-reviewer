import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomePage } from './routes/HomePage';
import { SubjectPage } from './routes/SubjectPage';
import { StudyPage } from './routes/StudyPage';
import { TestPage } from './routes/TestPage';
import { FlashcardsPage } from './routes/FlashcardsPage';
import { SearchPage } from './routes/SearchPage';
import { ReviewPage } from './routes/ReviewPage';
import { SettingsPage } from './routes/SettingsPage';
import { OSCrosswordPage } from './routes/OSCrosswordPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="subjects/:subjectId" element={<SubjectPage />} />
        <Route path="subjects/:subjectId/study" element={<StudyPage />} />
        <Route path="subjects/:subjectId/flashcards" element={<FlashcardsPage />} />
        <Route path="subjects/:subjectId/test" element={<TestPage />} />
        <Route path="subjects/cit015/crossword" element={<OSCrosswordPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
