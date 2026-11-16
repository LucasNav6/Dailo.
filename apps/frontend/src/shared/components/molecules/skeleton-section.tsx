import { Skeleton } from "@/shared/components/atoms/skeleton"
import { cn } from "@/shared/libs/utils"

function SkeletonRows({ widths }: { widths: number[] }) {
  return (
    <ul className="m-0 flex flex-col p-0">
      {widths.map((width, index) => (
        <li key={index} className="flex list-none items-center gap-[15px] py-3 pl-[5px]">
          <Skeleton className="size-[22px] shrink-0 rounded-full" />
          <span className="flex flex-1 flex-col gap-2">
            <Skeleton className="block h-4 rounded-lg" style={{ width: `${width}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function SkeletonSection({ widths, label = 70 }: { widths: number[]; label?: number }) {
  return (
    <>
      <div className="mt-4 mb-0.5 flex items-center gap-2.5">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="block h-3 rounded-lg" style={{ width: label }} />
      </div>
      <SkeletonRows widths={widths} />
    </>
  )
}

function SkeletonEssentials({ widths }: { widths: number[] }) {
  return (
    <div className={cn("mt-3 mb-1 rounded-2xl border-2 border-border px-4 pt-3.5 pb-1.5")}>
      <div className="flex items-center gap-2.5 pb-1.5">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="block h-3 w-[90px] rounded-lg" />
      </div>
      <SkeletonRows widths={widths} />
    </div>
  )
}

export { SkeletonEssentials, SkeletonSection }
