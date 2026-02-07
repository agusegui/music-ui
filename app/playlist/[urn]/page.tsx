import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPlaylistByUrn } from "@/lib/soundcloud";
import { formatDuration, formatTotalDuration } from "@/lib/format";
import { CoverArt } from "@/components/cover-art";
import { TrackList } from "@/components/track-list";

interface PlaylistPageProps {
  params: Promise<{ urn: string }>;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { urn } = await params;
  const decodedUrn = decodeURIComponent(urn);
  const playlist = await getPlaylistByUrn(decodedUrn);

  if (!playlist) {
    notFound();
  }

  const totalDuration = formatTotalDuration(
    playlist.tracks.map((t) => t.duration),
  );

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-on-surface-muted transition-colors hover:text-on-surface"
      >
        <ChevronLeft size={16} />
        Library
      </Link>

      {/* Playlist header */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end">
        <CoverArt
          src={playlist.artwork_url}
          alt={playlist.title}
          size={200}
          className="shrink-0 rounded-lg shadow-lg"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-on-surface-muted">
            {playlist.is_album ? "Album" : "Playlist"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface text-wrap-balance sm:text-4xl">
            {playlist.title}
          </h1>
          <p className="mt-2 text-sm text-on-surface-muted">
            {playlist.user.username}
            {" \u00B7 "}
            {playlist.track_count} {playlist.track_count === 1 ? "track" : "tracks"}
            {" \u00B7 "}
            {totalDuration}
          </p>
        </div>
      </header>

      {/* Track list */}
      <TrackList playlist={playlist} />
    </div>
  );
}
