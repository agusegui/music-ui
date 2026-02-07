"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { usePlayback } from "@/hooks/use-playback";
import { useMediaSession } from "@/hooks/use-media-session";
import { IconButton } from "@/components/icon-button";
import { CoverArt } from "@/components/cover-art";
import { SeekSlider } from "@/components/playback-bar-seek-slider";
import { VolumeSlider } from "@/components/playback-bar-volume-slider";

export function PlaybackBar() {
  const playback = usePlayback();
  useMediaSession(playback);

  const {
    currentTrack,
    isPlaying,
    repeatMode,
    isShuffled,
    togglePlayPause,
    nextTrack,
    previousTrack,
    cycleRepeatMode,
    toggleShuffle,
  } = playback;

  if (!currentTrack) return null;

  return (
    <div
      data-slot="playback-bar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm"
    >
      <div
        data-slot="playback-bar-inner"
        className="mx-auto flex h-20 max-w-screen-2xl items-center gap-4 px-4"
      >
        {/* Track info */}
        <div
          data-slot="track-info"
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <CoverArt
            src={currentTrack.artwork_url}
            alt={currentTrack.title}
            size={48}
          />
          <div data-slot="track-meta" className="min-w-0">
            <p
              data-slot="track-title"
              className="truncate text-sm font-medium text-on-surface"
            >
              {currentTrack.title}
            </p>
            <p
              data-slot="track-artist"
              className="truncate text-xs text-on-surface-muted"
            >
              {currentTrack.user.username}
            </p>
          </div>
        </div>

        {/* Controls + seek */}
        <div
          data-slot="controls"
          className="flex w-full max-w-md flex-col items-center gap-1"
        >
          <div data-slot="buttons" className="flex items-center gap-1">
            <IconButton
              aria-label={`Shuffle ${isShuffled ? "on" : "off"}`}
              size="sm"
              onClick={toggleShuffle}
              className={isShuffled ? "!text-accent" : ""}
            >
              <Shuffle size={16} />
            </IconButton>
            <IconButton
              aria-label="Previous track"
              size="sm"
              onClick={previousTrack}
            >
              <SkipBack size={16} />
            </IconButton>
            <IconButton
              aria-label={isPlaying ? "Pause" : "Play"}
              size="lg"
              onClick={togglePlayPause}
              className="!text-on-surface"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </IconButton>
            <IconButton
              aria-label="Next track"
              size="sm"
              onClick={nextTrack}
            >
              <SkipForward size={16} />
            </IconButton>
            <IconButton
              aria-label={`Repeat ${repeatMode}`}
              size="sm"
              onClick={cycleRepeatMode}
              className={repeatMode !== "off" ? "!text-accent" : ""}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={16} />
              ) : (
                <Repeat size={16} />
              )}
            </IconButton>
          </div>
          <SeekSlider />
        </div>

        {/* Volume */}
        <div
          data-slot="right-controls"
          className="hidden flex-1 items-center justify-end md:flex"
        >
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
