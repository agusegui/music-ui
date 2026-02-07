import type { SCTrack, SCPlaylist } from "./soundcloud";

export type RepeatMode = "off" | "all" | "one";

export interface PlaybackState {
  currentTrack: SCTrack | null;
  currentPlaylist: SCPlaylist | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  shuffleOrder: number[];
}

export interface PlaybackActions {
  playTrack: (track: SCTrack, playlist?: SCPlaylist, index?: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
}

export type PlaybackContextValue = PlaybackState & PlaybackActions;
