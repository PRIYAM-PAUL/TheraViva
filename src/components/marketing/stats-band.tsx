import { Container, Stat } from "@/components/ui";
import { conditions, disciplines, professionals, services } from "@/data";

/**
 * Figures derived from the site's own content — never invented. Counts update
 * automatically as services and conditions are added.
 */
export function StatsBand() {
  const maxYears = Math.max(...professionals.map((p) => p.yearsExperience));

  const stats = [
    { value: String(disciplines.length), label: "Clinical disciplines" },
    { value: String(services.length), label: "Therapy services" },
    { value: `${conditions.length}`, label: "Conditions supported" },
    { value: `${maxYears}+`, label: "Years of clinical experience" },
  ];

  return (
    <div className="border-y border-border bg-surface-teal/60">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </Container>
    </div>
  );
}
