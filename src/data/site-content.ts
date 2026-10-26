/**
 * General marketing content for the practice.
 */

import {
  Baby,
  CalendarCheck,
  ClipboardList,
  HeartHandshake,
  Home,
  LineChart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { TrustSignal } from "@/types";

export const mission = {
  eyebrow: "Who we are",
  title: "Two specialists, one goal: helping people take part in everyday life",
  paragraphs: [
    "TheraViva is a small Delhi-based practice bringing together occupational therapy and speech-and-language-and-audiology expertise. We work with children and adults whose daily life is made harder by a developmental, neurological or sensory difficulty.",
    "Being a small team is deliberate. Sessions are one-to-one, goals are set with the family rather than for them, and the therapist you meet is the therapist who stays with you.",
    "We offer sessions in clinic, at home across Delhi NCR, and online by secure video — so support fits around your life rather than the other way round.",
  ],
};

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const valueProps: ValueProp[] = [
  {
    icon: ClipboardList,
    title: "Assessment before assumptions",
    description:
      "Every programme starts with a proper assessment, so goals are based on what we actually find — not guesswork.",
  },
  {
    icon: Users,
    title: "Families are part of the plan",
    description:
      "Parents and caregivers are coached throughout. The progress that sticks happens at home, between sessions.",
  },
  {
    icon: Home,
    title: "Clinic, home or online",
    description:
      "Delivered in clinic, as home visits across Delhi NCR, or by secure video — whichever suits the person and the goals.",
  },
  {
    icon: LineChart,
    title: "Progress you can see",
    description:
      "Goals are practical and reviewed openly, so you always know what is improving and what needs adjusting.",
  },
  {
    icon: ShieldCheck,
    title: "Handled with care",
    description:
      "This is sensitive work. Information is treated confidentially, and nothing is shared without consent.",
  },
  {
    icon: HeartHandshake,
    title: "Small team, consistent care",
    description:
      "You see the same specialist each time, so nothing gets lost between appointments.",
  },
];

export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const howItWorks: HowItWorksStep[] = [
  {
    icon: MessageCircle,
    title: "Get in touch",
    description:
      "Send a request or message on WhatsApp. Tell us what you are noticing — there is no charge for the first conversation.",
  },
  {
    icon: ClipboardList,
    title: "Assessment",
    description:
      "A one-to-one assessment establishes what is hard, what is working, and what the priorities should be.",
  },
  {
    icon: Sparkles,
    title: "A plan that fits",
    description:
      "You get a clear therapy plan and a home programme, with goals you have agreed to.",
  },
  {
    icon: CalendarCheck,
    title: "Regular sessions",
    description:
      "Sessions run weekly or fortnightly, in clinic, at home or online — reviewed as progress is made.",
  },
];

export const trustSignals: TrustSignal[] = [
  {
    label: "Master's in Occupational Therapy",
    detail: "Paediatrics — Jamia Hamdard University, New Delhi",
  },
  {
    label: "4+ years in speech & language",
    detail: "Clinical, NGO and community settings",
  },
  {
    label: "Hospital clinical experience",
    detail: "GB Pant, Indira Gandhi and Lok Nayak hospitals",
  },
  {
    label: "Delhi NCR & online",
    detail: "Clinic, home visits and secure video sessions",
  },
];

export const sessionModes: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Users,
    title: "In clinic",
    description: "Hands-on assessment and therapy at the New Delhi clinic.",
  },
  {
    icon: Home,
    title: "Home visits",
    description: "Therapy delivered in your home, across Delhi NCR.",
  },
  {
    icon: Video,
    title: "Online video",
    description: "Secure video sessions, with a parent present for younger children.",
  },
  {
    icon: Baby,
    title: "Phone / WhatsApp",
    description: "Short reviews, coaching and follow-ups by phone.",
  },
];
