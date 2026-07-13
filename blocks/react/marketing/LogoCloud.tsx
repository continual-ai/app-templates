export interface LogoItem {
  name: string;
  src?: string;
}

export function LogoCloud({ logos, heading }: { logos: LogoItem[]; heading?: string }) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <p className="mb-10 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {heading}
          </p>
        )}
        <div className="grid grid-cols-2 place-items-center gap-x-12 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo) =>
            logo.src ? (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100"
                loading="lazy"
              />
            ) : (
              <span key={logo.name} className="text-lg font-medium text-muted-foreground">
                {logo.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default LogoCloud;
