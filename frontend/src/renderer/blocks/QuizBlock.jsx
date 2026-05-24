import { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuizBlock({ question, options = [], answer, explanation }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === answer;

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="block-quiz">
      <div className="quiz-header">Knowledge Check</div>
      <div className="quiz-question">{question}</div>

      <div className="quiz-options">
        {options.map((opt, i) => {
          let cls = 'quiz-option';
          if (submitted) {
            cls += ' disabled';
            if (i === answer) cls += ' correct';
            else if (i === selected) cls += ' incorrect';
          } else if (i === selected) {
            cls += ' selected';
          }

          return (
            <button
              key={i}
              className={cls}
              onClick={() => !submitted && setSelected(i)}
              type="button"
            >
              <span className="quiz-option-letter">{LETTERS[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && explanation && (
        <div className={`quiz-explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '✓ Correct! ' : '✗ Not quite. '}{explanation}
        </div>
      )}

      <div className="quiz-actions">
        {!submitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selected === null}
            type="button"
          >
            Check Answer
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleReset} type="button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
