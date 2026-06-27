import React from 'react';

interface ScoreBreakdownProps {
  score: number;
  severityScore: number;
  urgencyScore: number;
  evidenceScore: number;
  justification?: string;
  miniature?: boolean;
}

export default function ScoreBreakdown({ score, severityScore, urgencyScore, evidenceScore, justification, miniature = false }: ScoreBreakdownProps) {
  // Normalize segments to percentage
  const total = severityScore + urgencyScore + evidenceScore || 1; // avoid div by 0
  const sevPct = Math.round((severityScore / total) * 100);
  const urgPct = Math.round((urgencyScore / total) * 100);
  const evdPct = Math.round((evidenceScore / total) * 100);

  if (miniature) {
    return (
      <div className="mt-4 pt-4 border-t border-outline-variant z-10 w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px]">Priority Score</span>
          <span className="font-label-mono text-label-mono text-brand-signal">{score}/100</span>
        </div>
        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden flex">
          <div className="h-full bg-brand-signal" style={{ width: `${sevPct}%` }}></div>
          <div className="h-full bg-brand-signal opacity-70 border-l border-surface-container-lowest" style={{ width: `${urgPct}%` }}></div>
          <div className="h-full bg-brand-signal opacity-40 border-l border-surface-container-lowest" style={{ width: `${evdPct}%` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-outline-variant rounded p-md w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">AI Severity Assessment</h3>
          <p className="font-headline-md text-headline-md text-primary">
            {score >= 75 ? 'High Priority Dispatch' : score >= 50 ? 'Elevated Priority' : 'Routine Maintenance'}
          </p>
        </div>
        <div className="font-label-mono font-bold text-[48px] leading-none text-secondary-container tracking-tighter">
          {score}
        </div>
      </div>
      
      {/* Segmented Amber Bar */}
      <div className="flex h-3 w-full gap-1 rounded overflow-hidden mb-3">
        {Array.from({ length: 10 }).map((_, i) => {
            const currentPct = (i + 1) * 10;
            if (currentPct <= sevPct) return <div key={i} className="bg-secondary-container flex-1"></div>;
            if (currentPct <= sevPct + urgPct) return <div key={i} className="bg-secondary-container opacity-70 flex-1"></div>;
            if (currentPct <= 100 && currentPct <= score) return <div key={i} className="bg-secondary-container opacity-40 flex-1"></div>;
            return <div key={i} className="bg-surface-variant flex-1"></div>;
        })}
      </div>

      {/* AI Justification */}
      {justification && (
        <div className="flex items-start gap-2 bg-surface-container-low p-sm rounded border border-outline-variant mt-4">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-1">auto_awesome</span>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            "{justification}"
          </p>
        </div>
      )}
    </div>
  );
}
