"use client";

import { Slider } from "@base-ui/react/slider";
import { formatSeconds } from "@/lib/format";
import { usePlayback } from "@/hooks/use-playback";

export function SeekSlider() {
  const { currentTime, duration, seek } = usePlayback();

  return (
    <div data-slot="seek" className="flex items-center gap-2">
      <span
        data-slot="time-current"
        className="w-10 text-right font-mono text-xs tabular-nums text-on-surface-muted"
      >
        {formatSeconds(currentTime)}
      </span>
      <Slider.Root
        value={currentTime}
        min={0}
        max={duration || 1}
        step={0.1}
        onValueCommitted={(value) => seek(value as number)}
        aria-label="Seek"
        className="group relative flex h-5 flex-1 items-center"
      >
        <Slider.Control className="flex h-full w-full items-center">
          <Slider.Track className="relative h-1 w-full rounded-full bg-border">
            <Slider.Indicator className="absolute h-full rounded-full bg-on-surface transition-[width] duration-100" />
          </Slider.Track>
          <Slider.Thumb
            className="size-3 rounded-full bg-on-surface opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          />
        </Slider.Control>
      </Slider.Root>
      <span
        data-slot="time-duration"
        className="w-10 font-mono text-xs tabular-nums text-on-surface-muted"
      >
        {formatSeconds(duration)}
      </span>
    </div>
  );
}
