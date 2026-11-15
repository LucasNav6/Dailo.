import { PROJECT_NAMES } from "../data";

/** Lista simple de nombres de proyecto (la que queda detrás de hojas y diálogos). */
export function ProjectNames() {
  return (
    <ul className="flex flex-col">
      {PROJECT_NAMES.map((name) => (
        <li key={name} className="list-none border-b border-border py-3 text-[17px] font-medium">
          {name}
        </li>
      ))}
    </ul>
  );
}
