import Image from "next/image";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <Image
      src="/brand/greenpark-properties-logo.png"
      alt=""
      width={500}
      height={387}
      priority
      className={`object-contain ${className}`}
    />
  );
}
