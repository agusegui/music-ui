import Link from "next/link";
import type { SCPlaylist } from "@/types/soundcloud";
import { CoverArt } from "@/components/cover-art";

interface PlaylistCardProps {
  playlist: SCPlaylist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/playlist/${encodeURIComponent(playlist.urn)}`}
      className="group flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <CoverArt
        src={playlist.artwork_url}
        alt={playlist.title}
        size={200}
        className="aspect-square w-full"
      />
      <div data-slot="info" className="min-w-0">
        <p
          data-slot="title"
          className="truncate text-sm font-medium text-on-surface"
        >
          {playlist.title}
        </p>
        <p data-slot="meta" className="truncate text-xs text-on-surface-muted">
          {playlist.user.username}
          {" \u00B7 "}
          {playlist.track_count} {playlist.track_count === 1 ? "track" : "tracks"}
        </p>
      </div>
    </Link>
  );
}
