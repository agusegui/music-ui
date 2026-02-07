"use client";

import { Slider } from "@base-ui/react/slider";
import { Volume2, VolumeX } from "lucide-react";
import { usePlayback } from "@/hooks/use-playback";
import { IconButton } from "@/components/icon-button";

export function VolumeSlider() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayback();

  return (
    <div data-slot="volume" className="flex items-center gap-1">
      <IconButton
        aria-label={isMuted ? "Unmute" : "Mute"}
        size="sm"
        onClick={toggleMute}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={16} />
        ) : (
          <Volume2 size={16} />
        )}
      </IconButton>
      <Slider.Root
        value={isMuted ? 0 : volume}
        min={0}
        max={1}
        step={0.01}
        onValueChange={(value) => setVolume(value as number)}
        aria-label="Volume"
        className="group relative flex h-5 w-24 items-center"
      >
        <Slider.Control className="flex h-full w-full items-center">
          <Slider.Track className="relative h-1 w-full rounded-full bg-border">
            <Slider.Indicator className="absolute h-full rounded-full bg-on-surface" />
          </Slider.Track>
          <Slider.Thumb
            className="size-3 rounded-full bg-on-surface opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          />
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
