"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import Hls from "hls.js";
import type { SCTrack, SCPlaylist } from "@/types/soundcloud";
import type {
  PlaybackContextValue,
  PlaybackState,
  RepeatMode,
} from "@/types/playback";

// --- Fisher-Yates shuffle ---
function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Reducer ---
type Action =
  | {
      type: "PLAY_TRACK";
      track: SCTrack;
      playlist?: SCPlaylist;
      index: number;
    }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "SET_TIME"; currentTime: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SET_BUFFERING"; isBuffering: boolean }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "CYCLE_REPEAT" }
  | {
      type: "TOGGLE_SHUFFLE";
      shuffleOrder: number[];
    }
  | {
      type: "GO_TO_INDEX";
      index: number;
      track: SCTrack;
    };

const initialState: PlaybackState = {
  currentTrack: null,
  currentPlaylist: null,
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isBuffering: false,
  repeatMode: "off",
  isShuffled: false,
  shuffleOrder: [],
};

const repeatCycle: RepeatMode[] = ["off", "all", "one"];

function reducer(state: PlaybackState, action: Action): PlaybackState {
  switch (action.type) {
    case "PLAY_TRACK":
      return {
        ...state,
        currentTrack: action.track,
        currentPlaylist: action.playlist ?? state.currentPlaylist,
        currentIndex: action.index,
        isPlaying: true,
        currentTime: 0,
        duration: action.track.duration / 1000,
        isBuffering: false,
      };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.isPlaying };
    case "SET_TIME":
      return { ...state, currentTime: action.currentTime };
    case "SET_DURATION":
      return { ...state, duration: action.duration };
    case "SET_BUFFERING":
      return { ...state, isBuffering: action.isBuffering };
    case "SET_VOLUME":
      return { ...state, volume: action.volume, isMuted: false };
    case "TOGGLE_MUTE":
      return { ...state, isMuted: !state.isMuted };
    case "CYCLE_REPEAT": {
      const idx = repeatCycle.indexOf(state.repeatMode);
      return {
        ...state,
        repeatMode: repeatCycle[(idx + 1) % repeatCycle.length],
      };
    }
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        isShuffled: !state.isShuffled,
        shuffleOrder: !state.isShuffled ? action.shuffleOrder : [],
      };
    case "GO_TO_INDEX":
      return {
        ...state,
        currentIndex: action.index,
        currentTrack: action.track,
        isPlaying: true,
        currentTime: 0,
        duration: action.track.duration / 1000,
      };
    default:
      return state;
  }
}

export const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // --- Stream loader: fetch stream URL and set up HLS/progressive playback ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = state.currentTrack;
    if (!track) return;

    // Skip blocked tracks
    if (track.access === "blocked") {
      nextTrackInternal();
      return;
    }

    let cancelled = false;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Find best transcoding: prefer HLS, fallback to progressive
    const transcodings = track.media.transcodings;
    const hlsTranscoding = transcodings.find(
      (t) => t.format.protocol === "hls",
    );
    const progressiveTranscoding = transcodings.find(
      (t) => t.format.protocol === "progressive",
    );
    const transcoding = hlsTranscoding ?? progressiveTranscoding;

    if (!transcoding) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/stream?url=${encodeURIComponent(transcoding.url)}`,
        );
        if (cancelled || !res.ok) return;
        const { url } = (await res.json()) as { url: string };
        if (cancelled) return;

        if (
          transcoding.format.protocol === "hls" &&
          Hls.isSupported()
        ) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!cancelled) audio.play().catch(() => {});
          });
        } else if (
          transcoding.format.protocol === "hls" &&
          audio.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Safari native HLS
          audio.src = url;
          audio.play().catch(() => {});
        } else {
          // Progressive fallback
          audio.src = url;
          audio.play().catch(() => {});
        }
      } catch {
        // Network error — skip silently
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTrack?.urn]);

  // --- Sync volume ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  // --- Time update ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () =>
      dispatch({ type: "SET_TIME", currentTime: audio.currentTime });
    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        dispatch({ type: "SET_DURATION", duration: audio.duration });
      }
    };
    const onWaiting = () =>
      dispatch({ type: "SET_BUFFERING", isBuffering: true });
    const onPlaying = () =>
      dispatch({ type: "SET_BUFFERING", isBuffering: false });
    const onEnded = () => {
      if (state.repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrackInternal();
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.repeatMode, state.currentPlaylist, state.currentIndex, state.isShuffled, state.shuffleOrder]);

  const getAdjacentIndex = useCallback(
    (direction: 1 | -1): number | null => {
      const playlist = state.currentPlaylist;
      if (!playlist) return null;

      const trackCount = playlist.tracks.length;
      if (trackCount === 0) return null;

      if (state.isShuffled && state.shuffleOrder.length > 0) {
        const shufflePos = state.shuffleOrder.indexOf(state.currentIndex);
        const nextShufflePos = shufflePos + direction;
        if (nextShufflePos >= 0 && nextShufflePos < state.shuffleOrder.length) {
          return state.shuffleOrder[nextShufflePos];
        }
        if (state.repeatMode === "all") {
          return state.shuffleOrder[
            direction === 1 ? 0 : state.shuffleOrder.length - 1
          ];
        }
        return null;
      }

      const nextIndex = state.currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < trackCount) {
        return nextIndex;
      }
      if (state.repeatMode === "all") {
        return direction === 1 ? 0 : trackCount - 1;
      }
      return null;
    },
    [state.currentPlaylist, state.currentIndex, state.isShuffled, state.shuffleOrder, state.repeatMode],
  );

  const nextTrackInternal = useCallback(() => {
    const nextIdx = getAdjacentIndex(1);
    if (nextIdx !== null && state.currentPlaylist) {
      dispatch({
        type: "GO_TO_INDEX",
        index: nextIdx,
        track: state.currentPlaylist.tracks[nextIdx],
      });
    } else {
      dispatch({ type: "SET_PLAYING", isPlaying: false });
    }
  }, [getAdjacentIndex, state.currentPlaylist]);

  // --- Actions ---
  const playTrack = useCallback(
    (track: SCTrack, playlist?: SCPlaylist, index?: number) => {
      dispatch({
        type: "PLAY_TRACK",
        track,
        playlist,
        index: index ?? 0,
      });
    },
    [],
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    if (state.isPlaying) {
      audio.pause();
      dispatch({ type: "SET_PLAYING", isPlaying: false });
    } else {
      audio.play().catch(() => {});
      dispatch({ type: "SET_PLAYING", isPlaying: true });
    }
  }, [state.isPlaying, state.currentTrack]);

  const nextTrack = useCallback(() => {
    nextTrackInternal();
  }, [nextTrackInternal]);

  const previousTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      dispatch({ type: "SET_TIME", currentTime: 0 });
      return;
    }
    const prevIdx = getAdjacentIndex(-1);
    if (prevIdx !== null && state.currentPlaylist) {
      dispatch({
        type: "GO_TO_INDEX",
        index: prevIdx,
        track: state.currentPlaylist.tracks[prevIdx],
      });
    }
  }, [getAdjacentIndex, state.currentPlaylist]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      dispatch({ type: "SET_TIME", currentTime: time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: "SET_VOLUME", volume });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: "TOGGLE_MUTE" });
  }, []);

  const cycleRepeatMode = useCallback(() => {
    dispatch({ type: "CYCLE_REPEAT" });
  }, []);

  const toggleShuffle = useCallback(() => {
    const trackCount = state.currentPlaylist?.tracks.length ?? 0;
    dispatch({
      type: "TOGGLE_SHUFFLE",
      shuffleOrder: shuffleIndices(trackCount),
    });
  }, [state.currentPlaylist]);

  const value = useMemo<PlaybackContextValue>(
    () => ({
      ...state,
      playTrack,
      togglePlayPause,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      toggleMute,
      cycleRepeatMode,
      toggleShuffle,
    }),
    [
      state,
      playTrack,
      togglePlayPause,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      toggleMute,
      cycleRepeatMode,
      toggleShuffle,
    ],
  );

  return (
    <PlaybackContext.Provider value={value}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="none" />
    </PlaybackContext.Provider>
  );
}
