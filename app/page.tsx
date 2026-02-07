import { getAllPlaylists } from "@/lib/soundcloud";
import { PlaylistGrid } from "@/components/playlist-grid";

export default async function LibraryPage() {
  const playlists = await getAllPlaylists();

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface text-wrap-balance">
          Library
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}
        </p>
      </header>
      <PlaylistGrid playlists={playlists} />
    </div>
  );
}
