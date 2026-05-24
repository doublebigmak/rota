import { Link } from 'react-router-dom';
import ProgressRing from './ProgressRing';

export default function TopicCard({ subject, progress }) {
  const { id, title, description, icon, theme, topics = [] } = subject;

  return (
    <Link
      to={`/subject/${id}`}
      className="topic-card"
      style={{ '--subject-color': theme?.primary }}
    >
      <div className="topic-card-accent" />
      <div className="topic-card-header">
        <span className="topic-card-icon">{icon}</span>
        <div>
          <div className="topic-card-title">{title}</div>
          <div className="topic-card-desc">{description}</div>
        </div>
      </div>
      <div className="topic-card-footer">
        <span className="topic-card-count">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
        {progress > 0 && <ProgressRing percent={progress} size={32} stroke={3} />}
      </div>
    </Link>
  );
}
