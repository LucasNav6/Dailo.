import { RiAddLine, RiArrowLeftLine } from "@remixicon/react"
import { PillButton } from "@/shared/components/atoms/pill-button"
import { PageColumn } from "@/shared/components/layouts/page-column"
import { InlineAction } from "@/shared/components/molecules/inline-action"
import { WeekStrip } from "@/shared/components/molecules/week-strip"
import { CompletedGroup } from "@/shared/components/organisms/completed-group"
import { EssentialsBox } from "@/shared/components/organisms/essentials-box"
import { EssentialsDone } from "@/shared/components/organisms/essentials-done"
import { OverdueCard } from "@/shared/components/organisms/overdue-card"
import { TaskSection } from "@/shared/components/organisms/task-section"
import { useAgendaPage } from "../hooks/agenda-page.hook"
import { MonthModal } from "../modals/month.modal"
import { AchievedView } from "../views/achieved.view"
import { AgendaEmptyView } from "../views/agenda-empty.view"
import { AgendaHeaderView } from "../views/agenda-header.view"
import { toTaskItem } from "../views/agenda-items.view"
import { AgendaTitleView } from "../views/agenda-title.view"
import { AgendaErrorPage } from "./error.page"
import { AgendaLoadingPage } from "./loading.page"

export function AgendaPage() {
  const page = useAgendaPage()

  if (page.hasError) return <AgendaErrorPage onRetry={page.reload} />
  if (page.isLoading) return <AgendaLoadingPage page={page} />

  const planAction = (
    <InlineAction icon={<RiAddLine aria-hidden />} onClick={page.goInbox}>Planificar algo</InlineAction>
  )

  return (
    <PageColumn>
      <AgendaHeaderView eyebrow={page.eyebrow} title={<AgendaTitleView kind={page.titleKind} />} onMonth={page.openMonth} />
      <WeekStrip days={page.days} onSelect={page.selectDay} />
      {!page.isToday && (
        <PillButton className="mb-1" onClick={page.goToToday}>
          <RiArrowLeftLine aria-hidden />
          Volver a hoy
        </PillButton>
      )}

      {page.overdue.length > 0 && <OverdueCard tasks={page.overdue} actions={["Traer todas a hoy"]} onAction={page.bringOverdue} />}

      {page.isEmpty ? (
        page.isToday ? (
          <AgendaEmptyView inboxCount={page.inboxCount} onInbox={page.goInbox} onPlan={page.goInbox} />
        ) : (
          planAction
        )
      ) : (
        <>
          {page.achieved ? (
            <AchievedView total={page.plannedCount} essentials={page.essentialsTotal} onTomorrow={page.goToTomorrow} />
          ) : (
            <>
              {page.essentialsTotal > 0 &&
                (page.pendingEssentials.length > 0 ? (
                  <EssentialsBox done={page.essentialsDone} max={page.maxEssential} tasks={page.pendingEssentials.map(toTaskItem)} />
                ) : (
                  <EssentialsDone count={page.essentialsDone} total={page.essentialsTotal} lead={page.phrase.lead} emphasis={page.phrase.emphasis} />
                ))}
              {page.sections.map((section) => (
                <TaskSection
                  key={section.key}
                  title={section.title}
                  period={section.period}
                  badge={section.badge}
                  meta={section.range || undefined}
                  tasks={section.items.map(toTaskItem)}
                />
              ))}
              {!page.isToday && planAction}
            </>
          )}
          {page.completed.length > 0 && <CompletedGroup tasks={page.completed} open={page.showCompleted} onToggle={page.toggleCompleted} />}
        </>
      )}

      <MonthModal
        open={page.monthOpen}
        onOpenChange={page.setMonthOpen}
        selected={page.selected}
        today={page.today}
        loads={page.monthLoads}
        onSelect={page.goTo}
        onToday={() => page.goTo(page.today)}
      />
    </PageColumn>
  )
}
