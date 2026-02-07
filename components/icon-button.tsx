import { type ComponentProps } from "react";

const sizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
} as const;

interface IconButtonProps extends ComponentProps<"button"> {
  "aria-label": string;
  size?: keyof typeof sizes;
}

export function IconButton({
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-muted transition-colors hover:text-on-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 ${sizes[size]} ${className ?? ""}`}
      {...props}
    />
  );
}
