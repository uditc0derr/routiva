import { useState } from 'react';
import { copyText } from '../lib/copy.js';

/** A small copy-to-clipboard button matching the docs `.copy-btn` style. */
export default function CopyButton({ text, className = 'copy-btn', label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      className={copied ? `${className} copied` : className}
      onClick={onClick}
      aria-label="Copy code"
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
