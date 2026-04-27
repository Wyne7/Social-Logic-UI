import { useSocialAssessmentForm } from '../../hooks/useSocialAssessmentForm.js'
import { StepFooter } from './StepFooter.jsx'
import { StepNav } from './StepNav.jsx'
import { DaqStep } from './steps/DaqStep.jsx'
import { IdpStep } from './steps/IdpStep.jsx'
import { PovertyStep } from './steps/PovertyStep.jsx'
import { ProfileStep } from './steps/ProfileStep.jsx'
import { ReviewStep } from './steps/ReviewStep.jsx'

export function SocialAssessmentForm() {
  const s = useSocialAssessmentForm()
  const {
    form,
    currentStep,
    onInputChange,
    onRadioChange,
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
  } = s

  return (
    <form id="socialForm" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="criteria-banner" aria-live="polite">
        <strong>How it works:</strong> Complete each step in order. Use <strong>Back</strong> /{' '}
        <strong>Next</strong> or click a step tab. Section banners show eligibility when enough data is
        entered.
      </div>

      <StepNav currentStep={currentStep} onSelectStep={showStep} />

      <ProfileStep
        form={form}
        onInputChange={onInputChange}
        showVillageWard={showVillageWard}
        result={profileResult}
        isActive={currentStep === 1}
      />
      <IdpStep
        form={form}
        onRadioChange={onRadioChange}
        result={idpResult}
        isActive={currentStep === 2}
      />
      <DaqStep
        form={form}
        onInputChange={onInputChange}
        onRadioChange={onRadioChange}
        daqVis={daqVis}
        showDaq25VisibleDesc={showDaq25VisibleDesc}
        daqAdultResult={daqAdultResult}
        daqGt2Result={daqGt2Result}
        daq2to5Result={daq2to5Result}
        isActive={currentStep === 3}
      />
      <PovertyStep
        form={form}
        onInputChange={onInputChange}
        result={povertyResult}
        isActive={currentStep === 4}
      />
      <ReviewStep summaryHtml={summaryHtml} isActive={currentStep === 5} />

      <StepFooter currentStep={currentStep} onPrev={goPrev} onNext={goNext} onReset={reset} />
    </form>
  )
}
