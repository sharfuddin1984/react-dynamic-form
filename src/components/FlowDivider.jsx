import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

// Renders both orientations; global.css shows/hides the right one per
// breakpoint (vertical bar on desktop, horizontal bar on mobile).
export default function FlowDivider() {
  return (
    <>
      <div className="dff-divider-v" aria-hidden="true">
        <ChevronRight size={14} className="dff-flow-1" color="var(--text-dim)" />
        <ChevronRight size={14} className="dff-flow-2" color="var(--text-dim)" />
        <ChevronRight size={14} className="dff-flow-3" color="var(--text-dim)" />
      </div>
      <div className="dff-divider-h" aria-hidden="true">
        <ChevronDown size={14} className="dff-flow-1" color="var(--text-dim)" />
        <ChevronDown size={14} className="dff-flow-2" color="var(--text-dim)" />
        <ChevronDown size={14} className="dff-flow-3" color="var(--text-dim)" />
      </div>
    </>
  );
}
