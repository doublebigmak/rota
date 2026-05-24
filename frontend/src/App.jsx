import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import Catalog from './pages/Catalog';
import SubjectOverview from './pages/SubjectOverview';
import TopicPage from './pages/TopicPage';
import './styles/global.css';
import 'katex/dist/katex.min.css';

export default function App() {
  return (
    <BrowserRouter basename="/rota">
      <ThemeProvider>
        <ProgressProvider>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/subject/:subjectId" element={<SubjectOverview />} />
            <Route path="/subject/:subjectId/:topicId" element={<TopicPage />} />
          </Routes>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
