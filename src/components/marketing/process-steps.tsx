import { howItWorks } from "@/data";

/** Numbered "how it works" steps. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {howItWorks.map((step, index) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-3xl font-semibold text-primary/25">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm text-pretty text-muted-foreground">
              {step.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
