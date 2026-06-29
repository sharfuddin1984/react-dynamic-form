import React from 'react';
import { useDynamicForm } from './hooks/useDynamicForm.js';
import ApiToolbar from './components/ApiToolbar.jsx';
import SchemaEditor from './components/SchemaEditor.jsx';
import FlowDivider from './components/FlowDivider.jsx';
import FormPreview from './components/FormPreview.jsx';

export default function App() {
  const form = useDynamicForm();

  return (
    <div className="dff-app">
      <header className="dff-header">
        <div>
          <h1 className="dff-title">FormSmith</h1>
          <p className="dff-subtitle">Forge a form from a JSON schema — fetched live or hand-edited.</p>
        </div>
        <span className="dff-live-badge"><span className="dff-dot" />live preview</span>
      </header>

      <ApiToolbar
        endpointKeys={form.endpointKeys}
        endpointKey={form.endpointKey}
        onSelect={form.selectEndpoint}
        onFetch={() => form.selectEndpoint(form.endpointKey)}
        loading={form.loading}
        lastFetch={form.lastFetch}
      />

      <div className="dff-layout">
        <SchemaEditor
          jsonText={form.jsonText}
          onChange={form.editSchema}
          parseError={form.parseError}
        />

        <FlowDivider />

        <FormPreview
          schema={form.schema}
          values={form.values}
          errors={form.errors}
          submitted={form.submitted}
          onFieldChange={form.changeField}
          onSubmit={form.submit}
          onReset={form.reset}
          onContinue={form.continueEditing}
        />
      </div>
    </div>
  );
}
