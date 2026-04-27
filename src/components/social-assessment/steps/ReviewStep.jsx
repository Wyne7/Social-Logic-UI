const ACTIVE = (active) => (active ? 'step-panel is-active' : 'step-panel')

/**
 * @param {{ summaryHtml: string, isActive: boolean }} props
 */
export function ReviewStep({ summaryHtml, isActive }) {
  return (
    <div className={ACTIVE(isActive)} data-step="5" id="stepPanel5" aria-labelledby="st5">
      <section>
        <h2 id="st5">Step 5 — Review</h2>
        <p className="hint" style={{ marginTop: 0 }}>
          Use the step tabs or Back to change answers. This summary updates live.
        </p>
        <div
          id="eligibilitySummary"
          className="clinical-report-wrap"
          role="region"
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: summaryHtml }}
        />
      </section>
    </div>
  )
}
