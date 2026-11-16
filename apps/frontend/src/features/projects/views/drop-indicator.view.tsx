export function DropIndicatorView() {
  return (
    <li aria-hidden="true" className="ml-[5px] flex h-3 list-none items-center">
      <span className="size-2 rounded-full bg-primary" />
      <span className="h-[3px] flex-1 rounded-full bg-primary" />
    </li>
  );
}
