import { useState, useCallback } from 'react';

const STORAGE_KEY = 'rota:progress';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load);

  const markComplete = useCallback((subjectId, topicId, quizScore = null) => {
    setProgress((prev) => {
      const key = `${subjectId}/${topicId}`;
      const next = {
        ...prev,
        [key]: { completed: true, quizScore, completedAt: Date.now() },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getTopicProgress = useCallback(
    (subjectId, topicId) => progress[`${subjectId}/${topicId}`] || { completed: false },
    [progress]
  );

  const getSubjectProgress = useCallback(
    (subjectId, topics) => {
      if (!topics?.length) return 0;
      const done = topics.filter((t) => progress[`${subjectId}/${t.id}`]?.completed).length;
      return Math.round((done / topics.length) * 100);
    },
    [progress]
  );

  return { progress, markComplete, getTopicProgress, getSubjectProgress };
}
