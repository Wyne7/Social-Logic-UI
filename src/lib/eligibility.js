import { ageInCompletedYearsFromIsoDate } from './age.js'
import { POVERTY_DAILY_THRESHOLD_MMK } from './constants.js'

/**
 * @typedef {{ ok: boolean, msg: string } | null} EligibilityResult
 */

function val(data, key) {
  const v = data[key]
  if (v === undefined || v === null) return ''
  return String(v).trim()
}

/**
 * Age in completed years, from `dateOfBirth` (YYYY-MM-DD). Legacy `ageYears` is still supported
 * for older data if present and date of birth is empty.
 * @param {Record<string, string>} data
 * @returns {number | null}
 */
export function parseAge(data) {
  const dob = val(data, 'dateOfBirth')
  if (dob) {
    return ageInCompletedYearsFromIsoDate(dob)
  }
  const v = val(data, 'ageYears')
  if (v === '') return null
  const n = parseFloat(v, 10)
  return Number.isNaN(n) ? null : n
}

export function isEligibleTownship(township) {
  return /eligible/i.test(String(township ?? '').trim())
}

/**
 * Which DAQ sub-blocks to show for a given age (years), or all hidden if age is missing.
 * 3.1 (adult DAQ) when completed age is **over 5** ({@link parseAge} &gt; 5).
 * 3.2 when age is **under 2** (0–1). The generic “&lt;2 no branches” notice is off.
 */
export function getDaqBlockVisibility(age) {
  if (age === null) {
    return { showAdult: false, showGt2: false, show2to5: false, showNone: false }
  }
  const belowTwo = age < 2
  return {
    showAdult: age > 5,
    showGt2: belowTwo,
    show2to5: age >= 2 && age <= 5,
    showNone: false,
  }
}

export function needDaq25VisibleDescription(data) {
  const v = val(data, 'daq25_visible')
  return v === 'severe' || v === 'very_severe'
}

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalProfile(data) {
  const required = [
    'patientName',
    'patientId',
    'dateOfBirth',
    'address',
    'township',
    'stateRegion',
    'phone',
    'referredBy',
    'referrerOrg',
  ]
  for (const k of required) {
    if (!val(data, k)) return null
  }
  if (isEligibleTownship(val(data, 'township')) && !val(data, 'villageWard')) {
    return { ok: false, msg: 'Enter village/ward for eligible township.' }
  }
  return { ok: true, msg: 'Eligible — proceed to next step.' }
}

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalIdp(data) {
  const c = val(data, 'idp_conflict')
  const d = val(data, 'idp_disaster')
  if (!c || !d) return null
  const eligible = c === 'yes' || d === 'yes'
  return {
    ok: eligible,
    msg: eligible ? 'Eligible — proceed to next step.' : 'Not eligible (both No).',
  }
}

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalDaqAdult(data) {
  const ids = ['daq_a1', 'daq_a2', 'daq_a3', 'daq_a4', 'daq_a5']
  for (const id of ids) {
    if (!val(data, id)) return null
  }
  for (const id of ids) {
    if (Number(val(data, id), 10) >= 3) {
      return { ok: true, msg: 'Eligible — score ≥3 on at least one item.' }
    }
  }
  return { ok: false, msg: 'Not eligible — no score of 3 or above.' }
}

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalDaqGt2(data) {
  const r = val(data, 'daq_visible_disability')
  if (!r) return null
  return {
    ok: r === 'yes',
    msg: r === 'yes' ? 'Eligible — proceed to section 4.' : 'Not eligible (No visible disability).',
  }
}

const DAQ25_KEYS = [
  'daq25_appearance',
  'daq25_intelligence',
  'daq25_social',
  'daq25_hearing',
  'daq25_speech',
  'daq25_vision',
  'daq25_visible',
  'daq25_other',
]

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalDaq2to5(data) {
  for (const k of DAQ25_KEYS) {
    if (!val(data, k)) return null
  }
  const vis = val(data, 'daq25_visible')
  if (vis === 'severe' || vis === 'very_severe') {
    if (!val(data, 'daq25_visible_desc')) {
      return { ok: false, msg: 'Describe visible physical disability.' }
    }
  }
  let anyPositive = false
  for (const k of DAQ25_KEYS) {
    const v = val(data, k)
    if (v === 'severe' || v === 'very_severe') anyPositive = true
  }
  return {
    ok: anyPositive,
    msg: anyPositive
      ? 'Eligible — severe/very severe on at least one area.'
      : 'Not eligible — no severe/very severe.',
  }
}

/**
 * @param {Record<string, string>} data
 * @returns {EligibilityResult}
 */
export function evalPoverty(data) {
  const m = val(data, 'householdIncomeMonthly')
  const mem = val(data, 'householdMembers')
  if (m === '' || mem === '') return null
  const monthlyNum = Number(m, 10)
  const memNum = Number(mem, 10)
  if (Number.isNaN(monthlyNum) || Number.isNaN(memNum) || memNum < 1) {
    return { ok: false, msg: 'Invalid income or household size.' }
  }
  const dailyPerCapita = monthlyNum / (30 * memNum)
  const eligible = dailyPerCapita <= POVERTY_DAILY_THRESHOLD_MMK
  const note = `Per person/day ≈ ${Math.round(dailyPerCapita)} MMK`
  return {
    ok: eligible,
    msg: (eligible ? 'Eligible — ' : 'Not eligible — ') + note,
  }
}

function mark(x) {
  if (x === null) return '—'
  return x.ok ? '✓ Eligible' : '✗'
}

/**
 * @param {Record<string, string>} data
 */
export function buildEligibilitySnapshotLines(data) {
  const p = evalProfile(data)
  const idp = evalIdp(data)
  const age = parseAge(data)
  const da = age !== null && age > 5 ? evalDaqAdult(data) : null
  const g2 = age !== null && age < 2 ? evalDaqGt2(data) : null
  const d25 = age !== null && age >= 2 && age <= 5 ? evalDaq2to5(data) : null
  const pov = evalPoverty(data)

  const lines = ['<strong>Eligibility snapshot</strong><br><br>']
  lines.push(`1 Profile: ${mark(p)}<br>`)
  lines.push(`2 IDP: ${mark(idp)}<br>`)
  if (age !== null && age > 5) lines.push(`3.1 DAQ adult: ${mark(da)}<br>`)
  if (age !== null && age < 2) lines.push(`3.2 Visible disability: ${mark(g2)}<br>`)
  if (age !== null && age >= 2 && age <= 5) lines.push(`3.3 DAQ 2–5: ${mark(d25)}<br>`)
  lines.push(`4 Poverty: ${mark(pov)}<br>`)
  return lines.join('')
}
