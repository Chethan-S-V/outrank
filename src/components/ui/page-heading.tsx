type PageHeadingProps = {
  title: string;
  description?: string;
};

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-foreground/70">
          {description}
        </p>
      ) : null}
    </header>
  );
}
