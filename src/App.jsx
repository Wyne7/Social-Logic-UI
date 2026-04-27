import { SocialAssessmentForm } from './components/social-assessment/SocialAssessmentForm.jsx'

function App() {
  return (
    <div className="wrap">
      <header>
        <h1>Social eligibility assessment</h1>
        <p>
          Same step style as mandatory clinical data: profile, IDP, DAQ (by age), poverty, then review.
          Eligibility updates as you type.
        </p>
      </header>
      <SocialAssessmentForm />
    </div>
  )
}

export default App
