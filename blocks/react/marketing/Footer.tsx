export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export function Footer({
  brand,
  tagline,
  columns = [],
  note,
}: {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  note?: string;
}) {
  const copyright = note ?? (brand ? `© ${brand}` : undefined);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col justify-between gap-10 sm:flex-row">
        {(brand || tagline) && (
          <div className="flex max-w-xs flex-col gap-2">
            {brand && <span className="font-semibold tracking-normal text-foreground">{brand}</span>}
            {tagline && <p className="text-sm text-pretty text-muted-foreground">{tagline}</p>}
          </div>
        )}
        {columns.length > 0 && (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-sm font-medium text-foreground">{col.title}</span>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      {copyright && <p className="mt-10 border-t pt-6 text-xs text-muted-foreground">{copyright}</p>}
    </div>
  );
}

export default Footer;
