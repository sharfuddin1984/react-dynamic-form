import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SchemaEditor({ jsonText, onChange, parseError }) {
  // Tab inserts spaces instead of jumping focus out of the textarea.
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const textarea = e.target;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const next = jsonText.slice(0, start) + '  ' + jsonText.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    });
  };

  return (
    <div className="dff-pane">
      <div className="dff-pane-header">
        <span className="dff-pane-title-amber">Schema</span>
        <span className="dff-pane-meta">{jsonText.split('\n').length} lines</span>
      </div>

      <textarea
        className="dff-editor"
        value={jsonText}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />

      <div className="dff-editor-status">
        {parseError ? (
          <span className="dff-status-row dff-status-error">
            <AlertCircle size={13} /> {parseError}
          </span>
        ) : (
          <span className="dff-status-row dff-status-valid">
            <CheckCircle2 size={13} /> valid schema
          </span>
        )}
      </div>
    </div>
  );
}
