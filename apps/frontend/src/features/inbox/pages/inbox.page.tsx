import { PageColumn } from "@/shared/components/layouts/page-column"
import { useInboxPage } from "../hooks/inbox-page.hook"
import { ProcessItemModal } from "../modals/process-item.modal"
import { InboxEmptyView } from "../views/inbox-empty.view"
import { InboxHeaderView } from "../views/inbox-header.view"
import { InboxListView } from "../views/inbox-list.view"
import { InboxErrorPage } from "./error.page"
import { InboxLoadingPage } from "./loading.page"

export function InboxPage() {
  const page = useInboxPage()

  if (page.hasError) return <InboxErrorPage onRetry={page.reload} />
  if (page.isLoading) return <InboxLoadingPage />

  return (
    <PageColumn>
      <InboxHeaderView count={page.count} />
      {page.count === 0 ? (
        <InboxEmptyView onCapture={page.openCapture} />
      ) : (
        <InboxListView entries={page.entries} onOpen={page.open} onProcess={page.processFirst} />
      )}
      <ProcessItemModal task={page.selected} onClose={page.close} />
    </PageColumn>
  )
}
