import { useMemo } from 'react'
import { getAgeYearsMonthsDaysFromIso, toIsoDateString } from '../../../lib/age.js'
import { CriteriaBanner } from '../CriteriaBanner.jsx'

const ACTIVE = (active) => (active ? 'step-panel is-active' : 'step-panel')

/**
 * @param {object} props
 * @param {Record<string, string>} props.form
 * @param {(e: import('react').ChangeEvent<HTMLInputElement>) => void} props.onInputChange
 * @param {boolean} props.showVillageWard
 * @param {{ ok: boolean, msg: string } | null} props.result
 * @param {boolean} props.isActive
 */
export function ProfileStep({ form, onInputChange, showVillageWard, result, isActive }) {
  const { maxDob, minDob } = useMemo(() => {
    const today = new Date()
    const oldest = new Date()
    oldest.setFullYear(oldest.getFullYear() - 120)
    return { maxDob: toIsoDateString(today), minDob: toIsoDateString(oldest) }
  }, [])

  const ageYmd = useMemo(() => getAgeYearsMonthsDaysFromIso(form.dateOfBirth), [form.dateOfBirth])

  return (
    <div className={ACTIVE(isActive)} data-step="1" id="stepPanel1" aria-labelledby="st1">
      <section>
        <h2 id="st1">Step 1 — Patient profile</h2>
        <div className="row">
          <label htmlFor="patientName">Name</label>
          <div className="field">
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={form.patientName}
              onChange={onInputChange}
              autoComplete="name"
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="patientId">Patient ID</label>
          <div className="field">
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={form.patientId}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="dateOfBirth">Date of birth</label>
          <div className="field">
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={onInputChange}
              min={minDob}
              max={maxDob}
              required
            />
            {ageYmd ? (
              <div className="dob-readout" role="status" aria-live="polite">
                <p className="dob-readout__title">Calculated age (as of today)</p>
                <ul className="dob-readout__list">
                  <li>
                    <span className="dob-readout__label">Years</span>
                    <span className="dob-readout__value">{ageYmd.years}</span>
                  </li>
                  <li>
                    <span className="dob-readout__label">Months</span>
                    <span className="dob-readout__value">{ageYmd.months}</span>
                  </li>
                  <li>
                    <span className="dob-readout__label">Days</span>
                    <span className="dob-readout__value">{ageYmd.days}</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hint">Choose your date of birth. Age will show in years, months, and days.</div>
            )}
          </div>
        </div>
        <div className="row">
          <label htmlFor="address">Address</label>
          <div className="field">
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="township">Township</label>
          <div className="field">
            <input
              type="text"
              id="township"
              name="township"
              value={form.township}
              onChange={onInputChange}
              required
              // placeholder='Include the word "eligible" if village/ward is required'
            />
            {/* <div className="hint">
              If the township is within an eligible area, the village/ward field appears below.
            </div> */}
          </div>
        </div>
        <div className={`row ${showVillageWard ? '' : 'is-hidden'}`} id="villageWardRow">
          <label htmlFor="villageWard">Village / Ward</label>
          <div className="field">
            <input
              type="text"
              id="villageWard"
              name="villageWard"
              value={form.villageWard}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="stateRegion">State / Region</label>
          <div className="field">
            <input
              type="text"
              id="stateRegion"
              name="stateRegion"
              value={form.stateRegion}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="phone">Phone number</label>
          <div className="field">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onInputChange}
              inputMode="numeric"
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="referredBy">Referred by</label>
          <div className="field">
            <input
              type="text"
              id="referredBy"
              name="referredBy"
              value={form.referredBy}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="referrerOrg">Referrer organization</label>
          <div className="field">
            <input
              type="text"
              id="referrerOrg"
              name="referrerOrg"
              value={form.referrerOrg}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <CriteriaBanner result={result} id="resultProfile" />
      </section>
    </div>
  )
}
