import { TOTAL_STEPS } from '../../lib/constants.js'

/**
 * @param {{ currentStep: number, onPrev: () => void, onNext: () => void, onReset: () => void }} props
 */
export function StepFooter({ currentStep, onPrev, onNext, onReset }) {
  const isFirst = currentStep === 1
  const isLast = currentStep === TOTAL_STEPS

  return (
    <div className="step-footer">
      <button type="button" className="btn-secondary" disabled={isFirst} onClick={onPrev}>
        Back
      </button>
      <div className="step-footer-end">
        <button
          type="button"
          className={`btn-secondary ${isLast ? '' : 'is-hidden'}`}
          onClick={onReset}
        >
          Reset form
        </button>
        <button
          type="button"
          className={`btn-primary ${isLast ? 'is-hidden' : ''}`}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}
