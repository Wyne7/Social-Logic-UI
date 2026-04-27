import { CriteriaBanner } from '../CriteriaBanner.jsx'

const ACTIVE = (active) => (active ? 'step-panel is-active' : 'step-panel')

const SCORE_OPTS = (
  <>
    <option value="">—</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
  </>
)

const RATING_OPTS = (
  <>
    <option value="">—</option>
    <option value="none">No disability</option>
    <option value="severe">Severe</option>
    <option value="very_severe">Very severe</option>
  </>
)

/**
 * @param {object} props
 * @param {Record<string, string>} props.form
 * @param {(e: import('react').ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void} props.onInputChange
 * @param {(name: string, value: string) => void} props.onRadioChange
 * @param {{ showAdult: boolean, showGt2: boolean, show2to5: boolean, showNone: boolean }} props.daqVis
 * @param {boolean} props.showDaq25VisibleDesc
 * @param {{ ok: boolean, msg: string } | null} props.daqAdultResult
 * @param {{ ok: boolean, msg: string } | null} props.daqGt2Result
 * @param {{ ok: boolean, msg: string } | null} props.daq2to5Result
 * @param {boolean} props.isActive
 */
export function DaqStep({
  form,
  onInputChange,
  onRadioChange,
  daqVis,
  showDaq25VisibleDesc,
  daqAdultResult,
  daqGt2Result,
  daq2to5Result,
  isActive,
}) {
  return (
    <div className={ACTIVE(isActive)} data-step="3" id="stepPanel3" aria-labelledby="st3">
      <section>
        <h2 id="st3">Step 3 — DAQ (disability assessment)</h2>
        <p className="hint" style={{ margin: '-0.25rem 0 0.5rem' }}>
          Questions shown depend on age calculated from date of birth in step 1.
        </p>

        <div id="blockDaqNone" className={`muted-panel ${daqVis.showNone ? '' : 'is-hidden'}`}>
          <strong>Age &lt; 2</strong> — DAQ branches below do not apply. Continue to poverty or review.
        </div>

        <div id="blockDaqAdult" className={`daq-block ${daqVis.showAdult ? '' : 'is-hidden'}`}>
          <h3>3.1 DAQ (adult)</h3>
          <p className="hint">
            Scale: 1 = No difficulty · 2 = Some difficulty · 3 = A lot of difficulties · 4 = Cannot do at
            all. Eligible if <strong>any</strong> score is 3 or 4.
          </p>
          <table className="scale-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Score (1–4)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['daq_a1', 'Difficult seeing even when wearing glasses'],
                ['daq_a2', 'Difficult hearing even when using hearing aid'],
                ['daq_a3', 'Difficult walking or climbing steps'],
                ['daq_a4', 'Difficult remembering or concentrating'],
                ['daq_a5', 'Difficult with self-care'],
              ].map(([id, label]) => (
                <tr key={id}>
                  <td>{label}</td>
                  <td>
                    <select id={id} name={id} value={form[id]} onChange={onInputChange}>
                      {SCORE_OPTS}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <CriteriaBanner
            result={daqAdultResult}
            id="resultDaqAdult"
            style={{ marginTop: '1rem' }}
          />
        </div>

        <div id="blockDaqGt2" className={`daq-block ${daqVis.showGt2 ? '' : 'is-hidden'}`}>
          <h3>3.2 DAQ (&gt; 2 years)</h3>
          <div className="row">
            <div className="row-label" id="lbl-vis">
              Visible physical disability?
            </div>
            <div className="field radio-row" role="radiogroup" aria-labelledby="lbl-vis">
              <label>
                <input
                  type="radio"
                  name="daq_visible_disability"
                  value="yes"
                  checked={form.daq_visible_disability === 'yes'}
                  onChange={() => onRadioChange('daq_visible_disability', 'yes')}
                />{' '}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="daq_visible_disability"
                  value="no"
                  checked={form.daq_visible_disability === 'no'}
                  onChange={() => onRadioChange('daq_visible_disability', 'no')}
                />{' '}
                No
              </label>
            </div>
          </div>
          <p className="hint">Eligible if Yes — proceed to section 4.</p>
          <CriteriaBanner result={daqGt2Result} id="resultDaqGt2" />
        </div>

        <div id="blockDaq2to5" className={`daq-block ${daqVis.show2to5 ? '' : 'is-hidden'}`}>
          <h3>3.3 DAQ (2–5 years)</h3>
          <p className="hint">
            Options: No disability · Severe · Very severe. Eligible if any category is Severe or Very
            severe.
          </p>
          <table className="scale-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['daq25_appearance', 'Physical appearance'],
                ['daq25_intelligence', 'Intelligence'],
                ['daq25_social', 'Social'],
                ['daq25_hearing', 'Hearing (sensory)'],
                ['daq25_speech', 'Speech (sensory)'],
                ['daq25_vision', 'Vision (sensory)'],
                ['daq25_visible', 'Visible physical disability (e.g. face, limbs)'],
                ['daq25_other', 'Other disability'],
              ].map(([id, label]) => (
                <tr key={id}>
                  <td>{label}</td>
                  <td>
                    <select id={id} name={id} value={form[id]} onChange={onInputChange}>
                      {RATING_OPTS}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={`row ${showDaq25VisibleDesc ? '' : 'is-hidden'}`} id="daq25VisibleDescRow">
            <label htmlFor="daq25_visible_desc">Describe visible physical disability</label>
            <div className="field">
              <textarea
                id="daq25_visible_desc"
                name="daq25_visible_desc"
                value={form.daq25_visible_desc}
                onChange={onInputChange}
                rows={2}
              />
            </div>
          </div>
          <CriteriaBanner
            result={daq2to5Result}
            id="resultDaq2to5"
            style={{ marginTop: '1rem' }}
          />
        </div>
      </section>
    </div>
  )
}
