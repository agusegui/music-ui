export default function PlaylistLoading() {
  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link skeleton */}
      <div className="mb-6 h-5 w-16 animate-pulse rounded bg-surface-raised" />

      {/* Header skeleton */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="size-[200px] shrink-0 animate-pulse rounded-lg bg-surface-raised" />
        <div className="min-w-0 flex-1">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-raised" />
          <div className="mt-3 h-9 w-48 animate-pulse rounded bg-surface-raised" />
          <div className="mt-3 h-4 w-32 animate-pulse rounded bg-surface-raised" />
        </div>
      </header>

      {/* Track list skeleton */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md px-3 py-2"
          >
            <div className="h-4 w-8 animate-pulse rounded bg-surface-raised" />
            <div className="size-10 animate-pulse rounded-md bg-surface-raised" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-36 animate-pulse rounded bg-surface-raised" />
              <div className="mt-1 h-3 w-24 animate-pulse rounded bg-surface-raised" />
            </div>
            <div className="h-4 w-10 animate-pulse rounded bg-surface-raised" />
          </div>
        ))}
      </div>
    </div>
  );
}
