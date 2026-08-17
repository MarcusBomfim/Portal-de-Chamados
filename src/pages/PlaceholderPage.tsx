interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <span className="eyebrow">PORTAL DE CHAMADOS</span>
      <h1>{title}</h1>
      <p>Esta página será desenvolvida na próxima etapa correspondente.</p>
    </section>
  )
}
