import { highlight } from '../lib/markdown.js';
import CopyButton from './CopyButton.jsx';

/** A highlighted code block with a header label and a copy button. */
export default function CodeSample({ label, lang, code }) {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span className="lang">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
      </pre>
    </div>
  );
}
