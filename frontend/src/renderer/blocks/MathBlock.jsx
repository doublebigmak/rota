import { BlockMath, InlineMath } from 'react-katex';

export default function MathBlock({ content, display = true }) {
  if (display) {
    return (
      <div className="block-math">
        <BlockMath math={content} errorColor="#ef4444" />
      </div>
    );
  }
  return <span className="block-math-inline"><InlineMath math={content} errorColor="#ef4444" /></span>;
}
