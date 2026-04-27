import { CriteriaBanner } from '../CriteriaBanner.jsx'

const ACTIVE = (active) => (active ? 'step-panel is-active' : 'step-panel')

/**
 * @param {object} props
 * @param {Record<string, string>} props.form
 * @param {(name: string, value: string) => void} props.onRadioChange
 * @param {{ ok: boolean, msg: string } | null} props.result
 * @param {boolean} props.isActive
 */
export function IdpStep({ form, onRadioChange, result, isActive }) {
  return (
    <div className={ACTIVE(isActive)} data-step="2" id="stepPanel2" aria-labelledby="st2">
      <section>
        <h2 id="st2">Step 2 — IDP (internally displaced person)</h2>
        <p className="hint" style={{ margin: '-0.25rem 0 0.5rem' }}>
          Forced to leave homes or places because of:
        </p>
        <div className="row">
          <div className="row-label" id="lbl-idp-c">
            Effects of conflict
          </div>
          <div className="field radio-row" role="radiogroup" aria-labelledby="lbl-idp-c">
            <label>
              <input
                type="radio"
                name="idp_conflict"
                value="yes"
                checked={form.idp_conflict === 'yes'}
                onChange={() => onRadioChange('idp_conflict', 'yes')}
              />{' '}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="idp_conflict"
                value="no"
                checked={form.idp_conflict === 'no'}
                onChange={() => onRadioChange('idp_conflict', 'no')}
              />{' '}
              No
            </label>
          </div>
        </div>
        <div className="row">
          <div className="row-label" id="lbl-idp-d">
            Natural or human-made disasters
          </div>
          <div className="field radio-row" role="radiogroup" aria-labelledby="lbl-idp-d">
            <label>
              <input
                type="radio"
                name="idp_disaster"
                value="yes"
                checked={form.idp_disaster === 'yes'}
                onChange={() => onRadioChange('idp_disaster', 'yes')}
              />{' '}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="idp_disaster"
                value="no"
                checked={form.idp_disaster === 'no'}
                onChange={() => onRadioChange('idp_disaster', 'no')}
              />{' '}
              No
            </label>
          </div>
        </div>
        <p className="hint">
          Eligible if <strong>either</strong> answer is Yes.
        </p>
        <CriteriaBanner result={result} id="resultIdp" />
      </section>
    </div>
  )
}
