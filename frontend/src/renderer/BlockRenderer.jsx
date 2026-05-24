import TextBlock from './blocks/TextBlock';
import MathBlock from './blocks/MathBlock';
import ChartBlock from './blocks/ChartBlock';
import PlotBlock from './blocks/PlotBlock';
import VisualizationBlock from './blocks/VisualizationBlock';
import EmbedBlock from './blocks/EmbedBlock';
import QuizBlock from './blocks/QuizBlock';

const RENDERERS = {
  text: TextBlock,
  math: MathBlock,
  chart: ChartBlock,
  plot: PlotBlock,
  visualization: VisualizationBlock,
  embed: EmbedBlock,
  quiz: QuizBlock,
};

export default function BlockRenderer({ block }) {
  const Component = RENDERERS[block.type];
  if (!Component) {
    return (
      <div className="block error">
        Unknown block type: <code>{block.type}</code>
      </div>
    );
  }
  return (
    <div className="block">
      <Component {...block} />
    </div>
  );
}
