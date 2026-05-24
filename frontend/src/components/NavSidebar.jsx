import { Link, useNavigate } from 'react-router-dom';
import { useProgressContext } from '../context/ProgressContext';

export default function NavSidebar({ subject, currentTopicId }) {
  const { getTopicProgress } = useProgressContext();
  const navigate = useNavigate();
  const topics = subject?.topics ?? [];
  const currentIdx = topics.findIndex((t) => t.id === currentTopicId);

  const prev = topics[currentIdx - 1];
  const next = topics[currentIdx + 1];

  return (
    <aside className="topic-sidebar">
      <div className="sidebar-subject-title">{subject?.title}</div>

      <nav className="sidebar-toc">
        {topics.map((topic) => {
          const tp = getTopicProgress(subject.id, topic.id);
          const isActive = topic.id === currentTopicId;
          return (
            <Link
              key={topic.id}
              to={`/subject/${subject.id}/${topic.id}`}
              className={`sidebar-toc-item${isActive ? ' active' : ''}${tp.completed ? ' done-item' : ''}`}
            >
              <span className="sidebar-toc-check">{tp.completed ? '✓' : '○'}</span>
              {topic.title}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-nav">
        {prev ? (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/subject/${subject.id}/${prev.id}`)}
          >
            ← Prev
          </button>
        ) : (
          <Link to={`/subject/${subject.id}`} className="btn btn-ghost btn-sm">
            ↑ Overview
          </Link>
        )}
        {next && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/subject/${subject.id}/${next.id}`)}
          >
            Next →
          </button>
        )}
      </div>
    </aside>
  );
}
