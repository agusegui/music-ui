import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { MusicNote01Icon } from "@hugeicons/core-free-icons";

interface CoverArtProps {
  src: string | null;
  alt: string;
  size: number;
  className?: string;
}

export function CoverArt({ src, alt, size, className }: CoverArtProps) {
  if (!src) {
    return (
      <div
        data-slot="cover-art"
        className={`flex shrink-0 items-center justify-center rounded-md bg-surface-raised text-on-surface-muted ${className ?? ""}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={alt}
      >
        <HugeiconsIcon icon={MusicNote01Icon} size={size * 0.4} />
      </div>
    );
  }

  return (
    <Image
      data-slot="cover-art"
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-md ${className ?? ""}`}
    />
  );
}
