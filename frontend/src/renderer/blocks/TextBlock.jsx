import DOMPurify from 'dompurify';

export default function TextBlock({ content }) {
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class'],
  });
  return <div className="block-text" dangerouslySetInnerHTML={{ __html: clean }} />;
}
