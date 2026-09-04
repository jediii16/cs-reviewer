import { Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomePage } from './routes/HomePage';
import { SubjectPage } from './routes/SubjectPage';
import { StudyPage } from './routes/StudyPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="subjects/cit017" element={<SubjectPage />} />
        <Route path="subjects/cit017/study" element={<StudyPage />} />
      </Route>
    </Routes>
  );
}
