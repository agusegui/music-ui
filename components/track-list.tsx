"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { SCPlaylist } from "@/types/soundcloud";
import { TrackRow } from "@/components/track-row";

interface TrackListProps {
  playlist: SCPlaylist;
}

const VIRTUAL_THRESHOLD = 50;
const ROW_HEIGHT = 56;

function VirtualizedTrackList({ playlist }: TrackListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: playlist.tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <div
      ref={parentRef}
      role="list"
      aria-label={`Tracks in ${playlist.title}`}
      className="max-h-[70vh] overflow-y-auto overscroll-contain"
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const track = playlist.tracks[virtualRow.index];
          return (
            <div
              key={track.urn}
              role="listitem"
              className="absolute left-0 top-0 w-full"
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TrackRow
                track={track}
                index={virtualRow.index}
                playlist={playlist}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlainTrackList({ playlist }: TrackListProps) {
  return (
    <div role="list" aria-label={`Tracks in ${playlist.title}`}>
      {playlist.tracks.map((track, index) => (
        <div key={track.urn} role="listitem">
          <TrackRow track={track} index={index} playlist={playlist} />
        </div>
      ))}
    </div>
  );
}

export function TrackList({ playlist }: TrackListProps) {
  if (playlist.tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-on-surface-muted">
        <p className="text-lg">No tracks</p>
        <p className="text-sm">This playlist is empty.</p>
      </div>
    );
  }

  if (playlist.tracks.length > VIRTUAL_THRESHOLD) {
    return <VirtualizedTrackList playlist={playlist} />;
  }

  return <PlainTrackList playlist={playlist} />;
}
