import { PageColumn } from "@/shared/components/layouts/page-column"

export function TaskLoadingPage() {
  return (
    <PageColumn>
      <div aria-busy="true" className="h-40" />
    </PageColumn>
  )
}
