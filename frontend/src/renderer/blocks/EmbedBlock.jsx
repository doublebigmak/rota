export default function EmbedBlock({ src, height = 500, title = 'Interactive content' }) {
  return (
    <div className="block-embed">
      <iframe
        src={src}
        height={height}
        title={title}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
    </div>
  );
}
