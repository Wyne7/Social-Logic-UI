/**
 * @param {{ result: { ok: boolean, msg: string } | null, id?: string, className?: string, style?: object }} props
 */
export function CriteriaBanner({ result, id, className, style }) {
  const text = result === null ? 'Complete fields to see eligibility.' : result.msg
  const c =
    result === null
      ? 'criteria-banner'
      : `criteria-banner ${result.ok ? 'eligible' : 'ineligible'}`
  return (
    <div
      id={id}
      className={className ? `${c} ${className}`.trim() : c}
      style={style}
      role="status"
    >
      {text}
    </div>
  )
}
