"use client";

import { useEffect } from "react";
import type { PlaybackContextValue } from "@/types/playback";

export function useMediaSession(playback: PlaybackContextValue) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const { currentTrack } = playback;
    if (!currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.user.username,
      artwork: currentTrack.artwork_url
        ? [{ src: currentTrack.artwork_url, sizes: "500x500", type: "image/jpeg" }]
        : [],
    });
  }, [playback.currentTrack]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.playbackState = playback.isPlaying
      ? "playing"
      : "paused";
  }, [playback.isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => playback.togglePlayPause()],
      ["pause", () => playback.togglePlayPause()],
      ["previoustrack", () => playback.previousTrack()],
      ["nexttrack", () => playback.nextTrack()],
      ["seekto", (details) => {
        if (details.seekTime !== undefined) playback.seek(details.seekTime);
      }],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Action not supported
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Action not supported
        }
      }
    };
  }, [playback.togglePlayPause, playback.previousTrack, playback.nextTrack, playback.seek]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    if (!playback.currentTrack || !playback.duration) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: playback.duration,
        playbackRate: 1,
        position: Math.min(playback.currentTime, playback.duration),
      });
    } catch {
      // Invalid state
    }
  }, [playback.currentTime, playback.duration, playback.currentTrack]);
}
