import { MockupFrame } from "@/components/layouts/mockup-frame";
import { features } from "@/features";

export function MockupsPage() {
  return (
    <div className="min-h-svh bg-selected/40 px-10 py-12">
      <h1 className="font-display text-5xl font-semibold tracking-[-0.02em]">Dailo · Vistas</h1>
      <p className="mt-2 text-muted-foreground">Mockups estáticos de cada pantalla, agrupados por feature.</p>
      {features.map((feature) => (
        <section key={feature.id} id={feature.id} className="mt-16">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.02em]">{feature.name}</h2>
          <p className="mt-1 max-w-2xl text-muted-foreground">{feature.description}</p>
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-16">
            {feature.views.map(({ id, title, source, component: View, nav, height }) => (
              <figure key={id} id={`${feature.id}-${id}`} className="flex flex-col gap-3">
                <figcaption className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{title}</span> · {source} · {feature.id}/views/{id}.view.tsx
                </figcaption>
                <div className="w-fit overflow-hidden rounded-2xl border-2 border-border shadow-sm">
                  <MockupFrame nav={nav} height={height}>
                    <View />
                  </MockupFrame>
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
