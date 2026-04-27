import { CriteriaBanner } from '../CriteriaBanner.jsx'

const ACTIVE = (active) => (active ? 'step-panel is-active' : 'step-panel')

/**
 * @param {object} props
 * @param {Record<string, string>} props.form
 * @param {(e: import('react').ChangeEvent<HTMLInputElement>) => void} props.onInputChange
 * @param {{ ok: boolean, msg: string } | null} props.result
 * @param {boolean} props.isActive
 */
export function PovertyStep({ form, onInputChange, result, isActive }) {
  return (
    <div className={ACTIVE(isActive)} data-step="4" id="stepPanel4" aria-labelledby="st4">
      <section>
        <h2 id="st4">Step 4 — Poverty assessment</h2>
        <div className="row">
          <label htmlFor="householdIncomeMonthly">Total household income per month (MMK)</label>
          <div className="field">
            <input
              type="number"
              id="householdIncomeMonthly"
              name="householdIncomeMonthly"
              value={form.householdIncomeMonthly}
              onChange={onInputChange}
              min={0}
              step={1}
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="householdMembers">Total number of household members</label>
          <div className="field">
            <input
              type="number"
              id="householdMembers"
              name="householdMembers"
              value={form.householdMembers}
              onChange={onInputChange}
              min={1}
              step={1}
            />
          </div>
        </div>
        <CriteriaBanner result={result} id="resultPoverty" />
      </section>
    </div>
  )
}
