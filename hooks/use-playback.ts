"use client";

import { useContext } from "react";
import { PlaybackContext } from "@/providers/playback-provider";
import type { PlaybackContextValue } from "@/types/playback";

export function usePlayback(): PlaybackContextValue {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return ctx;
}
