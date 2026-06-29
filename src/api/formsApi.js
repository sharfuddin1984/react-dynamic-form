// ---------------------------------------------------------------------------
// formsApi.js
// This file pretends to be a backend. In a real app, ENDPOINTS would not
// exist here — fetchFormSchema() would call `fetch('/api/forms/' + key)`
// instead. Everything else in the app only talks to fetchFormSchema(), so
// swapping the mock for a real API later means editing ONLY this file.
// ---------------------------------------------------------------------------

export const ENDPOINTS = {
  'contact': {
    title: 'Contact us',
    description: 'We typically reply within one business day.',
    submitLabel: 'Send message',
    fields: [
      { name: 'name', label: 'Your name', type: 'text', required: true, minLength: 2, placeholder: 'Ada Lovelace' },
      { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'ada@example.com' },
      { name: 'topic', label: 'Topic', type: 'select', required: true, options: ['General inquiry', 'Bug report', 'Billing', 'Partnership'] },
      { name: 'message', label: 'Message', type: 'textarea', required: true, minLength: 10, maxLength: 600, placeholder: 'How can we help?' },
      { name: 'newsletter', label: 'Subscribe to product updates', type: 'checkbox' },
    ],
  },
  'job-application': {
    title: 'Frontend Engineer application',
    description: 'Tell us about your experience building interfaces.',
    submitLabel: 'Submit application',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true, minLength: 2 },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'portfolio', label: 'Portfolio URL', type: 'url', placeholder: 'https://…' },
      { name: 'experience', label: 'Years of experience', type: 'number', required: true, min: 0, max: 40 },
      { name: 'stack', label: 'Primary stack', type: 'radio', required: true, options: ['React', 'Angular', 'Vue', 'Other'] },
      { name: 'skills', label: 'Skills', type: 'multiselect', options: ['TypeScript', 'CSS architecture', 'Accessibility', 'Testing', 'Performance'] },
      { name: 'startDate', label: 'Available from', type: 'date', required: true },
      { name: 'cover', label: 'Why this role?', type: 'textarea', maxLength: 500 },
    ],
  },
  'survey': {
    title: 'Developer experience survey',
    description: '5 quick questions, no email required.',
    submitLabel: 'Submit survey',
    fields: [
      { name: 'role', label: 'Current role', type: 'select', required: true, options: ['Frontend', 'Backend', 'Full stack', 'DevOps', 'Other'] },
      { name: 'yearsCoding', label: 'Years coding', type: 'number', min: 0, max: 60 },
      { name: 'satisfaction', label: 'Job satisfaction (1–10)', type: 'number', required: true, min: 1, max: 10 },
      { name: 'remote', label: 'Work setup', type: 'radio', options: ['Remote', 'Hybrid', 'On-site'] },
      { name: 'feedback', label: 'Anything we should know?', type: 'textarea', maxLength: 300 },
    ],
  },
  'registration': {
    title: 'Create your account',
    description: 'Takes about a minute.',
    submitLabel: 'Create account',
    fields: [
      { name: 'username', label: 'Username', type: 'text', required: true, minLength: 3, maxLength: 20, pattern: '^[a-zA-Z0-9_]+$', patternMessage: 'Letters, numbers and underscores only' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password', required: true, minLength: 8 },
      { name: 'phone', label: 'Phone number', type: 'tel' },
      { name: 'birthday', label: 'Date of birth', type: 'date' },
      { name: 'terms', label: 'I agree to the terms of service', type: 'checkbox', required: true, requiredMessage: 'You must agree to continue' },
    ],
  },
};

export const DEFAULT_ENDPOINT = 'job-application';

/**
 * Simulates `GET /api/forms/:key`.
 * Returns the schema plus how long the "request" took, so the UI can
 * show a realistic network status line.
 */
export async function fetchFormSchema(key) {
  const start = performance.now();
  await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 450));
  const ms = Math.round(performance.now() - start);
  return { schema: ENDPOINTS[key], ms };
}
