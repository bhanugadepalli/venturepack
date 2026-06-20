import Image from "next/image";
import { BRAND } from "@/src/lib/brand";

type VenturePackLogoProps = {
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function VenturePackLogo({
  className = "h-10 w-auto",
  priority = false,
  width = 190,
  height = 64,
}: VenturePackLogoProps) {
  return (
    <Image
      src={BRAND.logo}
      alt={BRAND.name}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
