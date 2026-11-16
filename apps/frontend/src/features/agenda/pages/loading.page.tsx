import { PageColumn } from "@/shared/components/layouts/page-column"
import type { AgendaPageState } from "../hooks/agenda-page.hook"
import { AgendaLoadingView } from "../views/agenda-loading.view"
import { AgendaTitleView } from "../views/agenda-title.view"

export function AgendaLoadingPage({ page }: { page: AgendaPageState }) {
  return (
    <PageColumn>
      <AgendaLoadingView eyebrow={page.eyebrow} title={<AgendaTitleView kind={page.titleKind} />} days={page.days} />
    </PageColumn>
  )
}
