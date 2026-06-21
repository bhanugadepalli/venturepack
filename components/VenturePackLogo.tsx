import Image from "next/image";
import { BRAND } from "@/src/lib/brand";

type VenturePackLogoProps = {
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function VenturePackLogo({
  className = "h-12 w-auto md:h-14",
  priority = false,
  width = 250,
  height = 84,
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
