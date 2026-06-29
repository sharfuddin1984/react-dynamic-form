// ---------------------------------------------------------------------------
// useDynamicForm.js
// All app state and logic lives here. Components below only receive data
// and callbacks as props — none of them call useState for app data, which
// keeps "what happens" separate from "how it looks."
// ---------------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS, DEFAULT_ENDPOINT, fetchFormSchema } from '../api/formsApi.js';
import { validateSchema } from '../utils/validation.js';

export function useDynamicForm() {
  const [endpointKey, setEndpointKey] = useState(DEFAULT_ENDPOINT);
  const [jsonText, setJsonText] = useState('');
  const [schema, setSchema] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const loadSchema = useCallback(async (key) => {
    setLoading(true);
    setSubmitted(null);
    const { schema: data, ms } = await fetchFormSchema(key);
    setSchema(data);
    setJsonText(JSON.stringify(data, null, 2));
    setParseError(null);
    setValues({});
    setErrors({});
    setLastFetch({ path: `/api/forms/${key}`, ms });
    setLoading(false);
  }, []);

  // Load the default form once, on mount.
  useEffect(() => { loadSchema(DEFAULT_ENDPOINT); }, [loadSchema]);

  /** Called when the person picks a different mock endpoint, or hits "Fetch" again. */
  const selectEndpoint = (key) => {
    setEndpointKey(key);
    loadSchema(key);
  };

  /** Called on every keystroke in the JSON editor. Bad JSON never crashes the form. */
  const editSchema = (text) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (!parsed.fields || !Array.isArray(parsed.fields)) {
        throw new Error('Schema needs a "fields" array');
      }
      setSchema(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e.message);
    }
  };

  const changeField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = () => {
    if (!schema) return;
    const newErrors = validateSchema(schema, values);
    setErrors(newErrors);
    setSubmitted(Object.keys(newErrors).length === 0 ? { ...values } : null);
  };

  const reset = () => {
    setValues({});
    setErrors({});
    setSubmitted(null);
  };

  const continueEditing = () => setSubmitted(null);

  return {
    endpointKeys: Object.keys(ENDPOINTS),
    endpointKey,
    selectEndpoint,
    loading,
    lastFetch,
    jsonText,
    editSchema,
    parseError,
    schema,
    values,
    errors,
    submitted,
    changeField,
    submit,
    reset,
    continueEditing,
  };
}
