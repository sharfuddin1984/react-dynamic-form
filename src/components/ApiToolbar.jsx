import React from 'react';
import { Code2, RefreshCw } from 'lucide-react';

export default function ApiToolbar({ endpointKeys, endpointKey, onSelect, onFetch, loading, lastFetch }) {
  return (
    <div className="dff-toolbar">
      <Code2 size={16} color="var(--amber)" />
      <span className="dff-toolbar-label">GET /api/forms/</span>
      <select id="endpoint-select" name="endpoint" className="dff-select-sm" value={endpointKey} onChange={(e) => onSelect(e.target.value)}>
        {endpointKeys.map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <button className="dff-btn-ghost" disabled={loading} onClick={onFetch}>
        <RefreshCw size={14} className={loading ? 'dff-spin' : ''} /> {loading ? 'Fetching…' : 'Fetch'}
      </button>
      {lastFetch && !loading && (
        <span className="dff-status-ok">200 OK · {lastFetch.ms}ms</span>
      )}
    </div>
  );
}
