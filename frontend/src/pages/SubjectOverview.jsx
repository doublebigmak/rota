import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useManifest } from '../hooks/useManifest';
import { useTheme } from '../context/ThemeContext';
import { useProgressContext } from '../context/ProgressContext';

export default function SubjectOverview() {
  const { subjectId } = useParams();
  const { getSubject, loading, error } = useManifest();
  const { applyTheme } = useTheme();
  const { getTopicProgress, getSubjectProgress } = useProgressContext();

  const subject = getSubject(subjectId);

  useEffect(() => {
    if (subject?.theme) applyTheme(subject.theme);
    if (subject) document.title = `${subject.title} — Rota`;
  }, [subject, applyTheme]);

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!subject) return <div className="error">Subject not found.</div>;

  const { title, description, icon, topics = [] } = subject;
  const pct = getSubjectProgress(subjectId, topics);

  return (
    <div className="page">
      <header className="app-header">
        <span className="logo">Rota</span>
        <div className="breadcrumb">
          <Link to="/">Subjects</Link>
          <span className="sep">/</span>
          <span>{title}</span>
        </div>
      </header>

      <div className="subject-hero">
        <div className="subject-hero-inner">
          <span className="subject-hero-icon">{icon}</span>
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        {pct > 0 && (
          <div className="subject-progress-bar-wrap">
            <div className="subject-progress-bar">
              <div className="subject-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="subject-progress-label">{pct}% complete</span>
          </div>
        )}
      </div>

      <div className="topic-list">
        {topics.map((topic, i) => {
          const tp = getTopicProgress(subjectId, topic.id);
          return (
            <Link
              key={topic.id}
              to={`/subject/${subjectId}/${topic.id}`}
              className={`topic-list-item${tp.completed ? ' completed' : ''}`}
            >
              <div className={`topic-list-num${tp.completed ? ' done' : ''}`}>
                {tp.completed ? '✓' : i + 1}
              </div>
              <span className="topic-list-title">{topic.title}</span>
              {topic.estimatedMinutes && (
                <span className="topic-list-meta">{topic.estimatedMinutes} min</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
