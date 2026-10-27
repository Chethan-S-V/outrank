import type { ReactNode } from "react";
import { PageHeading } from "@/components/ui/page-heading";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-4xl flex-col justify-center px-6 py-16 sm:px-8">
      <div className="space-y-8 border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-9">
        <PageHeading title={title} description={description} />
        {children}
      </div>
    </main>
  );
}
