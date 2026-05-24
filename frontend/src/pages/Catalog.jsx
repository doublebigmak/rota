import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useManifest } from '../hooks/useManifest';
import { useTheme } from '../context/ThemeContext';
import { useProgressContext } from '../context/ProgressContext';
import TopicCard from '../components/TopicCard';

export default function Catalog() {
  const { manifest, loading, error } = useManifest();
  const { resetTheme } = useTheme();
  const { getSubjectProgress } = useProgressContext();

  useEffect(() => {
    resetTheme();
    document.title = 'ROTA - Learning Platform';
  }, [resetTheme]);

  if (loading) return <div className="loading">Loading subjects…</div>;
  if (error) return <div className="error">{error}</div>;

  const subjects = manifest?.subjects ?? [];

  return (
    <div className="page">
      <header className="app-header">
        <span className="logo">ROTA (Repository Of The Ancients)</span>
      </header>

      <div className="catalog-hero">
        <h1>Learn anything.</h1>
        <p>Interactive lessons with math, visualizations, and knowledge checks.</p>
      </div>

      <div className="catalog-grid">
        {subjects.map((subject) => (
          <TopicCard
            key={subject.id}
            subject={subject}
            progress={getSubjectProgress(subject.id, subject.topics)}
          />
        ))}
      </div>
    </div>
  );
}
