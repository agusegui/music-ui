"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import type { SCTrack, SCPlaylist } from "@/types/soundcloud";
import { usePlayback } from "@/hooks/use-playback";
import { CoverArt } from "@/components/cover-art";
import { formatDuration } from "@/lib/format";

interface TrackRowProps {
  track: SCTrack;
  index: number;
  playlist: SCPlaylist;
}

export function TrackRow({ track, index, playlist }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } =
    usePlayback();

  const isActive = currentTrack?.urn === track.urn;
  const isCurrentlyPlaying = isActive && isPlaying;

  function handleClick() {
    if (isActive) {
      togglePlayPause();
    } else {
      playTrack(track, playlist, index);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      data-slot="track-row"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${isActive ? "bg-surface-raised" : ""}`}
    >
      {/* Track number / play icon */}
      <div
        data-slot="track-number"
        className="flex w-8 shrink-0 items-center justify-center"
      >
        {isCurrentlyPlaying ? (
          <span className="text-accent" aria-label="Playing">
            <HugeiconsIcon icon={PauseIcon} size={14} color="currentColor" />
          </span>
        ) : (
          <>
            <span className="block text-sm tabular-nums text-on-surface-muted group-hover:hidden">
              {index + 1}
            </span>
            <span className="hidden text-on-surface group-hover:block" aria-hidden>
              <HugeiconsIcon icon={PlayIcon} size={14} color="currentColor" />
            </span>
          </>
        )}
      </div>

      {/* Cover art */}
      <CoverArt src={track.artwork_url} alt={track.title} size={40} />

      {/* Title + artist */}
      <div data-slot="track-info" className="min-w-0 flex-1">
        <p
          data-slot="track-title"
          className={`truncate text-sm font-medium ${isActive ? "text-accent" : "text-on-surface"}`}
        >
          {track.title}
        </p>
        <p
          data-slot="track-artist"
          className="truncate text-xs text-on-surface-muted"
        >
          {track.user.username}
        </p>
      </div>

      {/* Duration */}
      <span
        data-slot="track-duration"
        className="shrink-0 text-sm tabular-nums text-on-surface-muted"
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}
