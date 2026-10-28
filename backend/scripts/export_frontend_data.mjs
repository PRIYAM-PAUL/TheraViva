/**
 * Export the frontend's authored content (src/data/*) to a JSON snapshot the
 * backend seeds from.
 *
 * Run from the backend directory:
 *   npx --yes tsx scripts/export_frontend_data.mjs
 *
 * The frontend data modules use type-only imports (`import type …`), which
 * esbuild (via tsx) erases, so they can be imported directly in Node without a
 * build step or path-alias configuration.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const outFile = resolve(here, "..", "app", "seed", "content.json");

const load = async (relativePath) => import(resolve(repoRoot, relativePath));

const { services } = await load("src/data/services.ts");
const { professionals } = await load("src/data/professionals.ts");
const { conditions } = await load("src/data/conditions.ts");
const { packages } = await load("src/data/pricing.ts");
const { faqs } = await load("src/data/faqs.ts");
const { blogPosts } = await load("src/data/blog.ts");
const { locations } = await load("src/data/locations.ts");

// disciplines.ts imports lucide-react icons, so it is mirrored here instead of
// imported (the icon components are not serializable anyway).
const disciplines = [
  {
    id: "occupational-therapy",
    title: "Occupational Therapy",
    short: "Occupational Therapy",
    tagline: "Building the everyday skills that make independence possible.",
    description: [
      "Occupational therapy helps children and adults do the everyday things that matter — dressing, eating, writing, playing, working — when a condition, injury or developmental difference makes those things hard.",
      "Sessions are practical and goal-led: fine-motor and handwriting work, sensory regulation, school readiness, and activities-of-daily-living training, with clear home programmes for families.",
    ],
  },
  {
    id: "speech-language",
    title: "Speech & Language Therapy",
    short: "Speech & Language",
    tagline: "Helping every child find their voice, at their own pace.",
    description: [
      "Speech and language therapy supports children who are late to talk, hard to understand, or struggling with understanding and using language in everyday situations.",
      "Work spans early intervention, speech sounds and articulation, receptive and expressive language, fluency, and social communication — with parents coached to carry practice into daily routines.",
    ],
  },
  {
    id: "audiology",
    title: "Audiology & Hearing Care",
    short: "Audiology",
    tagline: "Clear hearing, properly assessed and properly fitted.",
    description: [
      "Audiology services cover hearing assessment and evaluation, hearing-aid selection and fitting, and device programming and fine-tuning.",
      "The focus is on practical outcomes: a hearing aid that is comfortable, correctly tuned, and understood — with ongoing guidance for the client and their family.",
    ],
  },
];

const snapshot = {
  generatedAt: new Date().toISOString(),
  source: "frontend/src/data",
  services,
  professionals,
  conditions,
  disciplines,
  faqs,
  blog: blogPosts,
  locations,
  pricing: packages,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

const counts = Object.fromEntries(
  Object.entries(snapshot)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => [key, value.length]),
);
console.log(`Wrote ${outFile}`);
console.log(counts);
