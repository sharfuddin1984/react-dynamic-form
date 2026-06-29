import React from 'react';
import { Send, RotateCcw } from 'lucide-react';
import FieldRenderer from './FieldRenderer.jsx';
import SuccessPanel from './SuccessPanel.jsx';

export default function FormPreview({
  schema, values, errors, submitted,
  onFieldChange, onSubmit, onReset, onContinue,
}) {
  return (
    <div className="dff-pane">
      <div className="dff-pane-header">
        <span className="dff-pane-title-teal">Live form</span>
        <span className="dff-live-badge"><span className="dff-dot" />renders on every keystroke</span>
      </div>

      <div className="dff-form-body">
        {!schema ? (
          <p className="dff-empty-state">Fix the schema error to preview the form.</p>
        ) : submitted ? (
          <SuccessPanel payload={submitted} title={schema.title} onContinue={onContinue} />
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>
            <h2 className="dff-form-title">{schema.title}</h2>
            {schema.description && <p className="dff-form-desc">{schema.description}</p>}

            {schema.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={(v) => onFieldChange(field.name, v)}
              />
            ))}

            <div className="dff-actions">
              <button type="submit" className="dff-btn-primary">
                <Send size={14} /> {schema.submitLabel || 'Submit'}
              </button>
              <button type="button" onClick={onReset} className="dff-btn-ghost">
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
