import { RiArchiveLine, RiBubbleChartLine, RiEqualizerLine, RiNotification3Line, RiShieldLine } from "@remixicon/react";
import { NavCard } from "@/components/molecules/nav-card";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </section>
  );
}

/** Índice de Configuración: personalización y seguridad. */
export function SettingsIndexView() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <h1 className="font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em]">Configuración</h1>
      <Group title="Personalización">
        <NavCard icon={<RiEqualizerLine aria-hidden />} title="Preferencias" subtitle="Rutina, planificación y apariencia" />
        <NavCard icon={<RiNotification3Line aria-hidden />} title="Notificaciones" subtitle="Recordatorios y avisos" />
        <NavCard icon={<RiBubbleChartLine aria-hidden />} title="Ámbitos de la vida" subtitle="Trabajo, personal, salud y más" />
      </Group>
      <Group title="Seguridad">
        <NavCard icon={<RiShieldLine aria-hidden />} title="Seguridad y datos" subtitle="Almacenamiento local en este dispositivo" />
        <NavCard icon={<RiArchiveLine aria-hidden />} title="Archivados" subtitle="Proyectos que guardaste aparte" />
      </Group>
    </div>
  );
}
