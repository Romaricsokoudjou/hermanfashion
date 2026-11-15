import { resize } from "@/lib/images";

type Props = {
  src: string;
  alt: string;
  className?: string;
  w?: number;
  priority?: boolean;
};

// Image légère : largeur adaptée via le CDN, chargement différé et décodage asynchrone.
export default function Img({ src, alt, className, w, priority }: Props) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={w ? resize(src, w) : src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
