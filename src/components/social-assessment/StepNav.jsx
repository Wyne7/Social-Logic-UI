const LABELS = ['Profile', 'IDP', 'DAQ', 'Poverty', 'Review']

/**
 * @param {{ currentStep: number, onSelectStep: (n: number) => void }} props
 */
export function StepNav({ currentStep, onSelectStep }) {
  return (
    <nav className="steps-nav" aria-label="Form steps">
      <ol className="steps-progress" id="stepsProgress">
        {LABELS.map((label, i) => {
          const n = i + 1
          const isCurrent = n === currentStep
          const isDone = n < currentStep
          return (
            <li
              key={label}
              className={isCurrent ? 'is-current' : isDone ? 'is-done' : ''}
              data-step-indicator={n}
              tabIndex={0}
              role="button"
              onClick={() => onSelectStep(n)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                onSelectStep(n)
              }}
            >
              {label}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
