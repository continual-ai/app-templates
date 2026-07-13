import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function Gallery({
  images,
  columns = 3,
  heading,
  subheading,
}: {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className={cn("grid gap-6", columnClasses[columns])}>
          {images.map((image) => (
            <figure key={image.src} className="overflow-hidden rounded-xl border bg-muted">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
              {image.caption && (
                <figcaption className="p-4 text-sm text-pretty text-muted-foreground">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
