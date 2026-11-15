import { Skeleton } from "@/components/atoms/skeleton"

/** Grupo esqueleto: barra de título de 90×12 y filas con círculo y barra de ancho variable (porcentajes). */
function SkeletonSection({ widths }: { widths: number[] }) {
  return (
    <>
      <div className="mt-[18px] mb-1.5">
        <Skeleton className="block h-3 w-[90px] rounded-lg" />
      </div>
      <ul className="flex flex-col">
        {widths.map((width, index) => (
          <li key={index} className="flex list-none items-center gap-[15px] py-3 pl-[5px]">
            <Skeleton className="size-[22px] shrink-0 rounded-full" />
            <span className="flex flex-1 flex-col gap-2">
              <Skeleton className="block h-4 rounded-lg" style={{ width: `${width}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export { SkeletonSection }
