import { Skeleton } from "@/shared/components/atoms/skeleton"
import { SectionHeader } from "@/shared/components/molecules/section-header"
import { ScreenHeader } from "@/shared/components/molecules/screen-header"

function LoadingLayout({ rows = 4, label = "Cargando" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="flex flex-1 flex-col">
      <ScreenHeader eyebrow={<Skeleton className="h-3.5 w-28 rounded-md" />} title={<Skeleton className="h-8 w-48 rounded-lg" />} />
      <SectionHeader title={<Skeleton className="h-3.5 w-24 rounded-md" />} />
      <ul className="flex flex-col">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="flex items-center gap-[15px] py-[9px] pl-[5px]">
            <Skeleton className="size-[22px] shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export { LoadingLayout }
