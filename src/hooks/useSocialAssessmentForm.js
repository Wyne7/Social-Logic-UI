import { useCallback, useMemo, useState } from 'react'
import { TOTAL_STEPS } from '../lib/constants.js'
import {
  buildEligibilitySnapshotLines,
  evalDaq2to5,
  evalDaqAdult,
  evalDaqGt2,
  evalIdp,
  evalPoverty,
  evalProfile,
  getDaqBlockVisibility,
  isEligibleTownship,
  needDaq25VisibleDescription,
  parseAge,
} from '../lib/eligibility.js'

function createInitialForm() {
  return {
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    address: '',
    township: '',
    villageWard: '',
    stateRegion: '',
    phone: '',
    referredBy: '',
    referrerOrg: '',
    idp_conflict: '',
    idp_disaster: '',
    daq_a1: '',
    daq_a2: '',
    daq_a3: '',
    daq_a4: '',
    daq_a5: '',
    daq_visible_disability: '',
    daq25_appearance: '',
    daq25_intelligence: '',
    daq25_social: '',
    daq25_hearing: '',
    daq25_speech: '',
    daq25_vision: '',
    daq25_visible: '',
    daq25_other: '',
    daq25_visible_desc: '',
    householdIncomeMonthly: '',
    householdMembers: '',
  }
}

export function useSocialAssessmentForm() {
  const [form, setForm] = useState(createInitialForm)
  const [currentStep, setCurrentStep] = useState(1)

  const setField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  const onInputChange = useCallback(
    (e) => {
      const t = e.target
      const name = t.name
      if (!name) return
      setField(name, t.value)
    },
    [setField],
  )

  const onRadioChange = useCallback(
    (name, value) => {
      setField(name, value)
    },
    [setField],
  )

  const age = useMemo(() => parseAge(form), [form])
  const daqVis = useMemo(() => getDaqBlockVisibility(age), [age])
  const showVillageWard = useMemo(() => isEligibleTownship(form.township), [form.township])
  const showDaq25VisibleDesc = useMemo(() => needDaq25VisibleDescription(form), [form])

  const profileResult = useMemo(() => evalProfile(form), [form])
  const idpResult = useMemo(() => evalIdp(form), [form])
  const daqAdultResult = useMemo(
    () => (age !== null && age > 5 ? evalDaqAdult(form) : null),
    [form, age],
  )
  const daqGt2Result = useMemo(
    () => (age !== null && age < 2 ? evalDaqGt2(form) : null),
    [form, age],
  )
  const daq2to5Result = useMemo(
    () => (age !== null && age >= 2 && age <= 5 ? evalDaq2to5(form) : null),
    [form, age],
  )
  const povertyResult = useMemo(() => evalPoverty(form), [form])

  const summaryHtml = useMemo(() => buildEligibilitySnapshotLines(form), [form])

  const showStep = useCallback((n) => {
    setCurrentStep(Math.max(1, Math.min(TOTAL_STEPS, n)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    showStep(currentStep + 1)
  }, [currentStep, showStep])

  const goPrev = useCallback(() => {
    showStep(currentStep - 1)
  }, [currentStep, showStep])

  const reset = useCallback(() => {
    setForm(createInitialForm())
    setCurrentStep(1)
  }, [])

  return {
    form,
    currentStep,
    setField,
    onInputChange,
    onRadioChange,
    age,
    daqVis,
    showVillageWard,
    showDaq25VisibleDesc,
    profileResult,
    idpResult,
    daqAdultResult,
    daqGt2Result,
    daq2to5Result,
    povertyResult,
    summaryHtml,
    showStep,
    goNext,
    goPrev,
    reset,
  }
}
