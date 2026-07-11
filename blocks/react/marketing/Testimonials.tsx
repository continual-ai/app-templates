import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import { SectionHeading } from "./SectionHeading";

export interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
}

export function Testimonials({
  items,
  heading,
  subheading,
}: {
  items: TestimonialItem[];
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.name}>
              <figure className="flex flex-1 flex-col p-6">
                <blockquote className="text-pretty">&ldquo;{item.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-4">
                  <Avatar>
                    {item.avatar && <AvatarImage src={item.avatar} alt="" />}
                    <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.role && <span className="text-sm text-muted-foreground">{item.role}</span>}
                  </div>
                </figcaption>
              </figure>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
