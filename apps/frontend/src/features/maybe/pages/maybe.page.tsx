import { PageColumn } from "@/shared/components/layouts/page-column"
import { useMaybePage } from "../hooks/maybe-page.hook"
import { IdeaListView } from "../views/idea-list.view"
import { MaybeEmptyView } from "../views/maybe-empty.view"
import { MaybeHeaderView } from "../views/maybe-header.view"
import { MaybeErrorPage } from "./error.page"
import { MaybeLoadingPage } from "./loading.page"

export function MaybePage() {
  const page = useMaybePage()

  if (page.hasError) return <MaybeErrorPage onRetry={page.reload} />
  if (page.isLoading) return <MaybeLoadingPage />

  return (
    <PageColumn>
      <MaybeHeaderView eyebrow={page.eyebrow} />
      {page.ideas.length === 0 ? (
        <MaybeEmptyView onCapture={page.openCapture} />
      ) : (
        <IdeaListView ideas={page.ideas} onPlan={page.plan} onDiscard={page.discard} />
      )}
    </PageColumn>
  )
}
