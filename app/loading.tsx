export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="h-9 w-40 animate-pulse rounded bg-surface-raised" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-surface-raised" />
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 p-2">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-surface-raised" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-raised" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-raised" />
          </div>
        ))}
      </div>
    </div>
  );
}
