/**
 * Completed years between an ISO date (YYYY-MM-DD) and a reference date (default: today).
 * @param {string} isoDate
 * @param {Date} [asOf]
 * @returns {number | null}
 */
export function ageInCompletedYearsFromIsoDate(isoDate, asOf = new Date()) {
  const trimmed = String(isoDate ?? '').trim()
  if (!trimmed) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!m) return null
  const y = Number(m[1], 10)
  const month = Number(m[2], 10)
  const day = Number(m[3], 10)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const birth = new Date(y, month - 1, day)
  if (Number.isNaN(birth.getTime())) return null
  if (birth > asOf) return null
  let age = asOf.getFullYear() - y
  const moDiff = asOf.getMonth() - (month - 1)
  if (moDiff < 0 || (moDiff === 0 && asOf.getDate() < day)) age--
  if (age < 0) return null
  if (age > 120) return null
  return age
}

/**
 * @param {Date} d
 * @returns {string} YYYY-MM-DD
 */
export function toIsoDateString(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @param {number} year
 * @param {number} month 1–12
 */
export function daysInMonth(year, month) {
  if (month < 1 || month > 12) return 31
  return new Date(year, month, 0).getDate()
}

/**
 * Build ISO date from Y/M/D part strings. Clamps day to the valid range for the month.
 * @param {string} yStr 4-digit year
 * @param {string} mStr month
 * @param {string} dStr day
 * @returns {string} YYYY-MM-DD or '' if any part missing/invalid
 */
export function buildIsoFromParts(yStr, mStr, dStr) {
  if (!yStr || !mStr || !dStr) return ''
  const y = parseInt(String(yStr), 10)
  const m = parseInt(String(mStr), 10)
  const d = parseInt(String(dStr), 10)
  if (Number.isNaN(y) || m < 1 || m > 12 || d < 1) return ''
  const maxD = daysInMonth(y, m)
  const dd = Math.min(d, maxD)
  return `${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
}

/**
 * @param {string} iso
 * @param {string} min YYYY-MM-DD
 * @param {string} max YYYY-MM-DD
 */
export function clampIsoToRange(iso, min, max) {
  if (!iso) return ''
  if (iso < min) return min
  if (iso > max) return max
  return iso
}

/**
 * Elapsed time from date of birth to `asOf` (default: today), in calendar years, months, and days.
 * @param {string} iso YYYY-MM-DD
 * @param {Date} [asOf] reference (usually today)
 * @returns {{ years: number, months: number, days: number } | null}
 */
export function getAgeYearsMonthsDaysFromIso(iso, asOf = new Date()) {
  const s = String(iso ?? '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [ys, ms, ds] = s.split('-').map(Number)
  const birth = new Date(ys, ms - 1, ds)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate())
  if (birth > now) return null
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  if (days < 0) {
    months--
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonthEnd.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  if (years < 0) return null
  return { years, months, days }
}
