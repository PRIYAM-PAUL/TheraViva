/**
 * Practice services.
 *
 * TODO(pricing): the `prices` below are INDICATIVE placeholders. Replace them
 * with the practice's confirmed price list before launch. They are centralised
 * here so a single edit updates the site.
 */

import type { Service } from "@/types";

export const services: Service[] = [
  // ---------------------------------------------------------------- OT -----
  {
    id: "ot-assessment",
    slug: "occupational-therapy-assessment",
    discipline: "occupational-therapy",
    title: "Occupational Therapy Assessment",
    summary:
      "A structured baseline assessment that identifies strengths, difficulties and therapy priorities.",
    description: [
      "A first appointment to understand what is hard and why. It combines clinical observation with standardised and functional assessment appropriate to the person's age and needs.",
      "You leave with a clear picture of priorities, a recommended therapy plan, and practical next steps — including whether ongoing therapy is needed at all.",
    ],
    durationMinutes: 60,
    modes: ["in-person", "video"],
    conditions: [
      "cerebral-palsy",
      "autism-spectrum-disorder",
      "adhd",
      "sensory-processing",
      "developmental-delay",
      "handwriting",
    ],
    professionalIds: ["md-irfan"],
    prices: [
      { mode: "in-person", amountInr: 1200 },
      { mode: "video", amountInr: 1200 },
    ],
    priceNote: "Includes a written summary and home recommendations.",
    featured: true,
  },
  {
    id: "paediatric-ot",
    slug: "paediatric-occupational-therapy",
    discipline: "occupational-therapy",
    title: "Paediatric Occupational Therapy",
    summary:
      "Ongoing one-to-one therapy for children, built around play and everyday goals.",
    description: [
      "Regular sessions that develop the underlying skills a child needs for daily life — motor control, coordination, attention, self-care and independence.",
      "Progress is reviewed openly against goals you agree together, with activities you can continue at home between sessions.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: [
      "autism-spectrum-disorder",
      "adhd",
      "cerebral-palsy",
      "developmental-delay",
      "down-syndrome",
    ],
    professionalIds: ["md-irfan"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
    featured: true,
  },
  {
    id: "sensory-integration",
    slug: "sensory-integration-therapy",
    discipline: "occupational-therapy",
    title: "Sensory Integration Therapy",
    summary:
      "Support for children who find everyday sensations overwhelming or underwhelming.",
    description: [
      "A therapy approach that helps the nervous system organise and respond to sensory information — touch, movement, sound and body awareness.",
      "Sessions are delivered in a sensory-rich environment and paired with a 'sensory diet' of strategies that fit into home and school routines.",
    ],
    durationMinutes: 45,
    modes: ["in-person"],
    conditions: ["sensory-processing", "autism-spectrum-disorder", "adhd"],
    professionalIds: ["md-irfan"],
    prices: [{ mode: "in-person", amountInr: 1000 }],
  },
  {
    id: "handwriting-school-readiness",
    slug: "handwriting-and-school-readiness",
    discipline: "occupational-therapy",
    title: "Handwriting & School Readiness",
    summary:
      "Targeted work on pencil control, letter formation, posture and classroom skills.",
    description: [
      "For children whose handwriting is slow, tiring or hard to read, or who are not yet ready for the demands of a classroom.",
      "Work covers grip and posture, fine-motor strength, letter formation, spacing, and the attention and organisation skills school requires.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["handwriting", "adhd", "developmental-delay"],
    professionalIds: ["md-irfan"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
  },
  {
    id: "adult-neuro-rehab-ot",
    slug: "adult-neuro-rehabilitation",
    discipline: "occupational-therapy",
    title: "Adult Neuro Rehabilitation (OT)",
    summary:
      "Regaining independence after stroke, Parkinson's, GBS or other neurological events.",
    description: [
      "Rehabilitation focused on real daily tasks: dressing, eating, mobility around the home, and returning to the activities that matter.",
      "Includes adaptation strategies and caregiver training, so progress holds up in the home environment.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["stroke", "parkinsons-disease", "guillain-barre", "dementia"],
    professionalIds: ["md-irfan"],
    prices: [
      { mode: "in-person", amountInr: 1000 },
      { mode: "video", amountInr: 1000 },
    ],
  },
  {
    id: "home-programme-coaching",
    slug: "home-programme-and-parent-coaching",
    discipline: "occupational-therapy",
    title: "Home Programme & Parent Coaching",
    summary:
      "Short review sessions to keep therapy working between appointments.",
    description: [
      "A focused session for reviewing progress, adjusting the home programme, and coaching parents or caregivers on what to do next.",
      "Useful as a regular touchpoint between full therapy sessions, or for families who live far from the clinic.",
    ],
    durationMinutes: 30,
    modes: ["video", "phone"],
    conditions: ["developmental-delay", "handwriting"],
    professionalIds: ["md-irfan"],
    prices: [
      { mode: "video", amountInr: 600 },
      { mode: "phone", amountInr: 600 },
    ],
  },

  // ------------------------------------------------------ Speech & language -
  {
    id: "speech-language-assessment",
    slug: "speech-and-language-assessment",
    discipline: "speech-language",
    title: "Speech & Language Assessment",
    summary:
      "A clear picture of speech, language, and communication strengths and needs.",
    description: [
      "A structured assessment of understanding, expression, speech sounds and social communication, appropriate to the child's age.",
      "You receive a plain-language summary with prioritised goals and a recommended therapy plan.",
    ],
    durationMinutes: 60,
    modes: ["in-person", "video"],
    conditions: [
      "speech-language-delay",
      "speech-sound-disorder",
      "autism-spectrum-disorder",
      "stuttering",
    ],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 1200 },
      { mode: "video", amountInr: 1200 },
    ],
    priceNote: "Includes a written summary and home suggestions.",
    featured: true,
  },
  {
    id: "early-intervention",
    slug: "early-intervention",
    discipline: "speech-language",
    title: "Early Intervention (0–6 years)",
    summary:
      "Early, play-based support when a child is late to talk or communicate.",
    description: [
      "The earliest years matter most. This programme supports first sounds, first words, attention and turn-taking through play and daily routines.",
      "Parents are coached throughout, because progress at this age happens mostly at home.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["speech-language-delay", "autism-spectrum-disorder", "down-syndrome"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
    featured: true,
  },
  {
    id: "speech-sound-therapy",
    slug: "speech-sound-therapy",
    discipline: "speech-language",
    title: "Speech Sound & Articulation Therapy",
    summary:
      "Clearer speech when sounds are missed, swapped or distorted.",
    description: [
      "Targeted work on specific sounds and sound patterns, so speech becomes easier to understand.",
      "Includes practice routines families can run in a few minutes a day.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["speech-sound-disorder", "cerebral-palsy", "down-syndrome"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
  },
  {
    id: "language-therapy",
    slug: "language-therapy",
    discipline: "speech-language",
    title: "Language Therapy (Receptive & Expressive)",
    summary:
      "Building vocabulary, sentence formation, and understanding.",
    description: [
      "For children who struggle to understand language, express themselves, or put sentences together.",
      "Work covers vocabulary, concepts, following directions, sentence building, and comprehension in real conversations.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["speech-language-delay", "autism-spectrum-disorder", "down-syndrome"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
  },
  {
    id: "fluency-therapy",
    slug: "fluency-therapy",
    discipline: "speech-language",
    title: "Fluency / Stuttering Therapy",
    summary:
      "Practical strategies for smoother, more confident speech.",
    description: [
      "Evidence-informed work on fluency, plus the confidence and communication skills that go with it.",
      "Suitable for children and adults, with strategies for everyday situations such as school, work and phone calls.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["stuttering"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
  },
  {
    id: "social-communication",
    slug: "social-communication-therapy",
    discipline: "speech-language",
    title: "Social Communication Therapy",
    summary:
      "Building functional communication for real-life interaction.",
    description: [
      "Support for children who find it hard to use language socially — starting conversations, taking turns, and understanding social cues.",
      "Goals are practical and shaped around the child's daily settings, including school and family life.",
    ],
    durationMinutes: 45,
    modes: ["in-person", "video"],
    conditions: ["autism-spectrum-disorder", "adhd"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 900 },
      { mode: "video", amountInr: 900 },
    ],
  },

  // ------------------------------------------------------------ Audiology --
  {
    id: "hearing-assessment",
    slug: "hearing-assessment",
    discipline: "audiology",
    title: "Hearing Assessment & Evaluation",
    summary:
      "Basic audiological assessment to understand hearing across the speech range.",
    description: [
      "A structured hearing evaluation to establish whether hearing is contributing to communication or learning difficulties.",
      "Results are explained in plain language, with clear recommendations on what to do next.",
    ],
    durationMinutes: 45,
    modes: ["in-person"],
    conditions: ["hearing-loss", "speech-language-delay"],
    professionalIds: ["abhishek-kumar"],
    prices: [{ mode: "in-person", amountInr: 1000 }],
    featured: true,
  },
  {
    id: "hearing-aid-fitting",
    slug: "hearing-aid-fitting",
    discipline: "audiology",
    title: "Hearing Aid Selection & Fitting",
    summary:
      "Choosing the right device and fitting it properly for daily life.",
    description: [
      "Guidance on selecting a hearing aid suited to the person's hearing profile, lifestyle and budget.",
      "Includes fitting, real-world adjustment, and clear instruction on care and use.",
    ],
    durationMinutes: 60,
    modes: ["in-person"],
    conditions: ["hearing-loss"],
    professionalIds: ["abhishek-kumar"],
    prices: [{ mode: "in-person", amountInr: 1500 }],
  },
  {
    id: "hearing-aid-programming",
    slug: "hearing-aid-programming",
    discipline: "audiology",
    title: "Hearing Aid Programming & Fine-Tuning",
    summary:
      "Adjusting a device so it actually works in the situations that matter.",
    description: [
      "Follow-up tuning after fitting, based on how the device performs at home, at work and in noisy places.",
      "Small adjustments often make the difference between a device that is worn and one that is left in a drawer.",
    ],
    durationMinutes: 30,
    modes: ["in-person"],
    conditions: ["hearing-loss"],
    professionalIds: ["abhishek-kumar"],
    prices: [{ mode: "in-person", amountInr: 700 }],
  },
  {
    id: "hearing-aid-counselling",
    slug: "hearing-aid-counselling",
    discipline: "audiology",
    title: "Hearing Aid Troubleshooting & Counselling",
    summary:
      "Solving everyday device problems and building confidence in using it.",
    description: [
      "Practical help with common issues — whistling, comfort, batteries, cleaning and connectivity.",
      "Includes counselling for the user and their family on getting the most from the device.",
    ],
    durationMinutes: 30,
    modes: ["in-person", "phone"],
    conditions: ["hearing-loss"],
    professionalIds: ["abhishek-kumar"],
    prices: [
      { mode: "in-person", amountInr: 500 },
      { mode: "phone", amountInr: 500 },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesByDiscipline(discipline: string): Service[] {
  return services.filter((service) => service.discipline === discipline);
}

export function getServicesByCondition(conditionSlug: string): Service[] {
  return services.filter((service) => service.conditions.includes(conditionSlug));
}
