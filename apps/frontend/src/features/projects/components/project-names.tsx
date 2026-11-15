import { PROJECT_NAMES } from "../data";

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
