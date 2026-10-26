/**
 * Discipline metadata — the three clinical areas the practice covers.
 */

import { Ear, Hand, Speech, type LucideIcon } from "lucide-react";

import type { Discipline } from "@/types";

export interface DisciplineInfo {
  id: Discipline;
  title: string;
  /** Short label for chips/nav. */
  short: string;
  /** One-line promise. */
  tagline: string;
  description: string[];
  icon: LucideIcon;
  /** Tailwind text colour utility for accents. */
  accent: string;
  professionalIds: string[];
}

export const disciplines: DisciplineInfo[] = [
  {
    id: "occupational-therapy",
    title: "Occupational Therapy",
    short: "Occupational Therapy",
    tagline: "Building the everyday skills that make independence possible.",
    description: [
      "Occupational therapy helps children and adults do the everyday things that matter — dressing, eating, writing, playing, working — when a condition, injury or developmental difference makes those things hard.",
      "Sessions are practical and goal-led: fine-motor and handwriting work, sensory regulation, school readiness, and activities-of-daily-living training, with clear home programmes for families.",
    ],
    icon: Hand,
    accent: "text-teal-600 dark:text-teal-400",
    professionalIds: ["md-irfan"],
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
    icon: Speech,
    accent: "text-amber-600 dark:text-amber-400",
    professionalIds: ["abhishek-kumar"],
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
    icon: Ear,
    accent: "text-indigo-600 dark:text-indigo-400",
    professionalIds: ["abhishek-kumar"],
  },
];

export function getDiscipline(id: string): DisciplineInfo | undefined {
  return disciplines.find((discipline) => discipline.id === id);
}
