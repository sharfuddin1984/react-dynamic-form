// ---------------------------------------------------------------------------
// validation.js
// Pure functions only — no React, no DOM. This is what makes validation
// schema-driven: every rule reads from the field's own JSON definition
// (required, minLength, pattern, etc.) instead of being hardcoded per field.
// ---------------------------------------------------------------------------

export function validateValue(field, value) {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return field.requiredMessage || `${field.label} is required`;
  }
  if (isEmpty) return null; // optional + empty: nothing left to check

  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter a valid email address';
  }
  if (field.type === 'url') {
    try {
      // eslint-disable-next-line no-new
      new URL(value);
    } catch {
      return 'Enter a valid URL';
    }
  }
  if (field.minLength && String(value).length < field.minLength) {
    return `Must be at least ${field.minLength} characters`;
  }
  if (field.maxLength && String(value).length > field.maxLength) {
    return `Must be at most ${field.maxLength} characters`;
  }
  if (field.type === 'number') {
    const num = Number(value);
    if (Number.isNaN(num)) return 'Enter a valid number';
    if (field.min !== undefined && num < field.min) return `Must be at least ${field.min}`;
    if (field.max !== undefined && num > field.max) return `Must be at most ${field.max}`;
  }
  if (field.pattern) {
    try {
      if (!new RegExp(field.pattern).test(value)) {
        return field.patternMessage || 'Invalid format';
      }
    } catch {
      // malformed pattern in the schema itself — don't crash the form
    }
  }
  return null;
}

/** Validates every field in a schema against a values object. Returns an errors map. */
export function validateSchema(schema, values) {
  const errors = {};
  schema.fields.forEach((field) => {
    const error = validateValue(field, values[field.name]);
    if (error) errors[field.name] = error;
  });
  return errors;
}
