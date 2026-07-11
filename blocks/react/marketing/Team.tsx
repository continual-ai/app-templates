import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { SectionHeading } from "./SectionHeading";

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  links?: Array<{ label: string; href: string }>;
}

export function Team({
  members,
  heading,
  subheading,
}: {
  members: TeamMember[];
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.name}>
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <Avatar className="size-20">
                  {member.image && <AvatarImage src={member.image} alt={member.name} />}
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                {member.bio && <p className="text-sm text-pretty text-muted-foreground">{member.bio}</p>}
                {member.links && member.links.length > 0 && (
                  <ul className="flex flex-wrap items-center justify-center gap-3">
                    {member.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="text-sm text-primary hover:underline">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
