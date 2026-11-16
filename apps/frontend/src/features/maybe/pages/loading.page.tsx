import { PageColumn } from "@/shared/components/layouts/page-column"
import { MaybeLoadingView } from "../views/maybe-loading.view"

export function MaybeLoadingPage() {
  return (
    <PageColumn>
      <MaybeLoadingView />
    </PageColumn>
  )
}
