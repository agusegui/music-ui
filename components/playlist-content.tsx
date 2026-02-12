"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import type { SCPlaylist } from "@/types/soundcloud";
import { formatTotalDuration } from "@/lib/format";
import { CoverArt } from "@/components/cover-art";
import { TrackList } from "@/components/track-list";

interface PlaylistContentProps {
  playlist: SCPlaylist;
}

export function PlaylistContent({ playlist }: PlaylistContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const totalDuration = formatTotalDuration(
    playlist.tracks.map((t) => t.duration),
  );

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return playlist;

    const query = searchQuery.toLowerCase();
    return {
      ...playlist,
      tracks: playlist.tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.user.username.toLowerCase().includes(query),
      ),
    };
  }, [playlist, searchQuery]);

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <div className="flex w-full items-center">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 px-16 py-8 text-sm text-on-surface-muted transition-colors hover:text-on-surface"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Library
        </Link>

        <div className="flex flex-1 items-center justify-center px-16 py-8">
          <div className="flex w-full max-w-[480px] items-center gap-2.5 rounded-full bg-surface-raised px-4 py-2.5">
            <span className="shrink-0 text-on-surface-muted">
              <HugeiconsIcon icon={Search01Icon} size={18} color="currentColor" />
            </span>
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-8 px-16">
        {/* Left Column — Cover Art */}
        <div className="flex w-[482px] shrink-0 items-center justify-center">
          <CoverArt
            src={playlist.artwork_url}
            alt={playlist.title}
            size={250}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Header Info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-muted">
              {playlist.is_album ? "Album" : "Playlist"}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              {playlist.title}
            </h1>
            <p className="mt-2 text-sm text-on-surface-muted">
              {playlist.user.username}
              {" \u00B7 "}
              {playlist.track_count}{" "}
              {playlist.track_count === 1 ? "track" : "tracks"}
              {" \u00B7 "}
              {totalDuration}
            </p>
          </div>

          {/* Track List */}
          <TrackList playlist={filteredPlaylist} />
        </div>
      </div>
    </main>
  );
}
