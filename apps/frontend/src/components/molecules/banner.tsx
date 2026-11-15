import { Button } from "@/components/atoms/button"

type BannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

function Banner({ message, actionLabel, onAction }: BannerProps) {
  return (
    <div
      role="status"
      className="absolute inset-x-4 bottom-[100px] flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-selected py-2 pr-2 pl-4 text-[15px] text-foreground"
    >
      <span className="flex-1">{message}</span>
      {actionLabel && (
        <Button variant="ghost" className="h-11 px-3 text-[15px] font-semibold" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { Banner }
