import type { SCPlaylist } from "@/types/soundcloud";
import { PlaylistCard } from "@/components/playlist-card";

interface PlaylistGridProps {
  playlists: SCPlaylist[];
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-muted">
        <p className="text-lg">No playlists yet</p>
        <p className="text-sm">Your library is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.urn} playlist={playlist} />
      ))}
    </div>
  );
}
