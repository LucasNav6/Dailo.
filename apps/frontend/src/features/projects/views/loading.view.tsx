import { Skeleton } from "@/components/atoms/skeleton";
import { ProjectsHeader } from "../components/projects-header";

export function ProjectsLoadingView() {
  return (
    <div aria-busy="true" className="contents">
      <ProjectsHeader />
      <ul>
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="flex list-none flex-col gap-2 border-b border-border py-3.5">
            <Skeleton className="block h-[18px] w-[55%] rounded-lg" />
            <Skeleton className="block h-3 w-[75%] rounded-lg" />
            <Skeleton className="block h-2.5 w-[40%] rounded-lg" />
          </li>
        ))}
      </ul>
    </div>
  );
}
