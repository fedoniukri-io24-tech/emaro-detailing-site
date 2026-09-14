type SectionHeadingProps = {
  title: React.ReactNode
  lead?: React.ReactNode
  centered?: boolean
}

export function SectionHeading({ title, lead, centered = false }: SectionHeadingProps) {
  return (
    <div className={`section-intro${centered ? ' section-intro-center' : ''}`}>
      <h2 className="section-heading">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  )
}
