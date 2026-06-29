import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPanel({ payload, title, onContinue }) {
  return (
    <div>
      <div className="dff-success-header">
        <CheckCircle2 size={20} />
        <span className="dff-success-title">Submitted</span>
      </div>
      <p className="dff-success-sub">"{title}" response payload:</p>
      <pre className="dff-payload">{JSON.stringify(payload, null, 2)}</pre>
      <button onClick={onContinue} className="dff-btn-ghost" style={{ marginTop: 16 }}>
        Fill out again
      </button>
    </div>
  );
}
