import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useManifest } from '../hooks/useManifest';
import { useTheme } from '../context/ThemeContext';
import { useProgressContext } from '../context/ProgressContext';
import NavSidebar from '../components/NavSidebar';
import BlockRenderer from '../renderer/BlockRenderer';

export default function TopicPage() {
  const { subjectId, topicId } = useParams();
  const { getSubject, loading: manifestLoading } = useManifest();
  const { applyTheme } = useTheme();
  const { getTopicProgress, markComplete } = useProgressContext();

  const [topicData, setTopicData] = useState(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState(null);

  const subject = getSubject(subjectId);
  const topicMeta = subject?.topics?.find((t) => t.id === topicId);
  const tp = getTopicProgress(subjectId, topicId);

  useEffect(() => {
    if (subject?.theme) applyTheme(subject.theme);
  }, [subject, applyTheme]);

  useEffect(() => {
    if (!topicMeta?.file) return;
    setTopicLoading(true);
    setTopicError(null);
    fetch(`/content/subjects/${topicMeta.file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load topic: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTopicData(data);
        setTopicLoading(false);
        document.title = `${data.title} — ${subject?.title} — Rota`;
      })
      .catch((err) => {
        setTopicError(err.message);
        setTopicLoading(false);
      });
  }, [topicMeta]);

  if (manifestLoading || topicLoading) return <div className="loading">Loading…</div>;
  if (topicError) return <div style={{ padding: '2rem' }} className="error">{topicError}</div>;
  if (!subject || !topicData) return <div style={{ padding: '2rem' }} className="error">Topic not found.</div>;

  return (
    <div className="page">
      <header className="app-header">
        <span className="logo">Rota</span>
        <div className="breadcrumb">
          <Link to="/">Subjects</Link>
          <span className="sep">/</span>
          <Link to={`/subject/${subjectId}`}>{subject.title}</Link>
          <span className="sep">/</span>
          <span>{topicData.title}</span>
        </div>
      </header>

      <div className="topic-layout">
        <NavSidebar subject={subject} currentTopicId={topicId} />

        <main className="topic-content">
          <div className="topic-content-header">
            <h1>{topicData.title}</h1>
            {topicData.estimatedMinutes && (
              <div className="topic-meta">
                {subject.icon} {subject.title} · {topicData.estimatedMinutes} min read
              </div>
            )}
          </div>

          {topicData.blocks?.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}

          <div className={`topic-complete-bar${tp.completed ? ' is-done' : ''}`}>
            {tp.completed ? (
              <div className="topic-complete-text">
                <strong>✓ Completed</strong>
                Keep going to the next topic!
              </div>
            ) : (
              <div className="topic-complete-text">
                <strong>Finished reading?</strong>
                Mark this topic as complete to track your progress.
              </div>
            )}
            <button
              className={`btn btn-lg ${tp.completed ? 'btn-secondary' : 'btn-success'}`}
              onClick={() => markComplete(subjectId, topicId)}
              disabled={tp.completed}
            >
              {tp.completed ? '✓ Done' : 'Mark Complete'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
