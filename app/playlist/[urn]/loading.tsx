export default function PlaylistLoading() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar skeleton */}
      <div className="flex w-full items-center">
        <div className="flex shrink-0 items-center gap-1 px-16 py-8">
          <div className="h-5 w-16 animate-pulse rounded bg-surface-raised" />
        </div>
        <div className="flex flex-1 items-center justify-center px-16 py-8">
          <div className="h-11 w-full max-w-[480px] animate-pulse rounded-full bg-surface-raised" />
        </div>
      </div>

      {/* Content Area skeleton */}
      <div className="flex gap-8 px-16">
        {/* Left Column — Cover Art */}
        <div className="flex w-[482px] shrink-0 items-center justify-center">
          <div className="size-[250px] animate-pulse rounded-lg bg-surface-raised" />
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Header Info skeleton */}
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-surface-raised" />
            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-surface-raised" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface-raised" />
          </div>

          {/* Track list skeleton */}
          <div className="flex flex-col gap-1">
            {Array.from({ length: 6 }, (_, i) => (
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
      </div>
    </main>
  );
}
