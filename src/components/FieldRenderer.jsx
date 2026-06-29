import React from 'react';

// Picks a sensible browser-autofill hint per field type, unless the
// schema itself specifies one. Silences Chrome's "missing autocomplete
// attribute" notice and gives password managers something useful to do.
function autoCompleteFor(field) {
  if (field.autoComplete) return field.autoComplete;
  switch (field.type) {
    case 'email': return 'email';
    case 'password': return 'new-password';
    case 'tel': return 'tel';
    case 'url': return 'url';
    default: return 'off';
  }
}

// Turns an option label into a safe id fragment, e.g. "Full stack" -> "full-stack".
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// This is the piece that makes the form "dynamic": one switch statement
// maps a field's `type` to the right control. Add a new type here and
// every schema in the app can use it immediately.
export default function FieldRenderer({ field, value, error, onChange }) {
  const id = `f-${field.name}`;
  const common = {
    id,
    name: field.name,
    placeholder: field.placeholder,
    autoComplete: autoCompleteFor(field),
    className: `dff-input ${error ? 'dff-input-error' : ''}`,
  };

  let control;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea {...common} rows={4} value={value || ''} maxLength={field.maxLength}
          onChange={(e) => onChange(e.target.value)} />
      );
      break;

    case 'select':
      control = (
        <select {...common} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>Select…</option>
          {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
      break;

    case 'radio':
      return (
        <fieldset className="dff-field">
          <legend className="dff-label">
            {field.label}{field.required && <span className="dff-required"> *</span>}
          </legend>
          <div className="dff-option-group">
            {field.options.map((opt) => (
              <label key={opt} className="dff-option">
                <input
                  type="radio"
                  id={`${id}-${slug(opt)}`}
                  name={field.name}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {error && <p className="dff-error">{error}</p>}
        </fieldset>
      );

    case 'multiselect': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <fieldset className="dff-field">
          <legend className="dff-label">
            {field.label}{field.required && <span className="dff-required"> *</span>}
          </legend>
          <div className="dff-option-group">
            {field.options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="dff-option">
                  <input
                    type="checkbox"
                    id={`${id}-${slug(opt)}`}
                    name={`${field.name}-${slug(opt)}`}
                    checked={checked}
                    onChange={() => onChange(checked ? selected.filter((v) => v !== opt) : [...selected, opt])}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {error && <p className="dff-error">{error}</p>}
        </fieldset>
      );
    }

    case 'checkbox':
      // Checkboxes put the label next to the box itself, so they return early.
      return (
        <div className="dff-field">
          <label className="dff-option">
            <input type="checkbox" id={id} name={field.name} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <span>{field.label}{field.required && <span className="dff-required"> *</span>}</span>
          </label>
          {error && <p className="dff-error">{error}</p>}
        </div>
      );

    default:
      // text, email, password, url, tel, number, date all fall through to here.
      control = (
        <input {...common} type={field.type || 'text'} value={value ?? ''}
          onChange={(e) => onChange(e.target.value)} />
      );
  }

  return (
    <div className="dff-field">
      <label htmlFor={id} className="dff-label">
        {field.label}{field.required && <span className="dff-required"> *</span>}
      </label>
      {control}
      {error && <p className="dff-error">{error}</p>}
    </div>
  );
}