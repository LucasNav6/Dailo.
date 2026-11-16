function CountHeading({ label, count }: { label: string; count: string | number }) {
  return (
    <div className="mt-7 mb-1 flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">
      {label}
      <span className="font-medium text-muted-foreground">{count}</span>
    </div>
  )
}

export { CountHeading }
