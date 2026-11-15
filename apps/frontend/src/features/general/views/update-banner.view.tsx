import { Emphasis } from "@/components/atoms/emphasis";
import { Banner } from "@/components/molecules/banner";
import { WeekStrip } from "@/components/molecules/week-strip";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { TaskSection } from "@/components/organisms/task-section";
import { EssentialIcon } from "@/features/today/components/essential-icon";
import { TodayHeader } from "@/features/today/components/today-header";
import { weekDays } from "@/features/today/data";

export function GeneralUpdateBannerView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EssentialsBox done={1} max={3} tasks={[
          { title: "Llamar al contador", done: true },
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <Banner message="Hay una versión nueva de Dailo" actionLabel="Actualizar" />
    </>
  );
}
