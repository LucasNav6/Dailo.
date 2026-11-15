import { Emphasis } from "@/components/atoms/emphasis";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TaskSection } from "@/components/organisms/task-section";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayLongTextView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <TaskSection
        title="Esenciales"
        meta="2 de 3"
        tasks={[
          {
            title: "Preparar la presentación del rediseño completo del sitio para el comité de dirección y enviar el borrador al equipo comercial antes del jueves a primera hora",
            time: "Vie",
          },
          {
            title: "Revisar y aprobar el presupuesto de la reforma de la cocina con los tres proveedores que enviaron cotización la semana pasada",
            time: "13:30",
          },
          { title: "Comprar regalo" },
        ]}
      />
      <TaskSection title="Tarde" meta="15–19" tasks={[{ title: "Reunión", time: "16:00" }]} />
    </>
  );
}
