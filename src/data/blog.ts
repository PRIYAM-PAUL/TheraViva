/**
 * Blog posts (static content — no CMS in this phase).
 *
 * These are educational articles written for parents and caregivers. They are
 * not a diagnosis and do not replace individual clinical assessment.
 */

import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "signs-your-child-may-benefit-from-occupational-therapy",
    title: "Signs your child may benefit from occupational therapy",
    description:
      "A practical checklist of the everyday difficulties that suggest a paediatric occupational therapy assessment is worth considering.",
    date: "2026-09-12",
    readingMinutes: 5,
    category: "Occupational Therapy",
    tags: ["paediatric", "assessment", "early intervention"],
    authorId: "md-irfan",
    related: ["developmental-delay", "handwriting", "sensory-processing"],
    sections: [
      {
        paragraphs: [
          "Occupational therapy is about the everyday things a child needs to do — dressing, eating, writing, playing and learning. When those things are consistently harder than they should be, an assessment can explain why.",
          "Parents often sense something is off long before anyone else. This article lists the difficulties that most often prompt a referral, so you can decide whether to seek advice.",
        ],
      },
      {
        heading: "Fine motor and handwriting signs",
        bullets: [
          "Avoids drawing, colouring or writing, or tires very quickly doing it",
          "Holds a pencil in an awkward or painful grip",
          "Letters are uneven, spaced oddly, or frequently reversed",
          "Struggles with buttons, zips, cutlery or scissors",
        ],
        paragraphs: [
          "These difficulties usually point to underlying issues with hand strength, coordination or visual-motor control rather than a lack of effort.",
        ],
      },
      {
        heading: "Sensory and regulation signs",
        bullets: [
          "Strong reactions to ordinary sounds, textures or labels in clothing",
          "Constant movement, crashing into things, or difficulty sitting at a meal",
          "Meltdowns that seem out of proportion to what triggered them",
          "Difficulty settling to sleep or transitioning between activities",
        ],
      },
      {
        heading: "Daily living and play signs",
        bullets: [
          "Noticeably behind peers in self-care skills such as dressing",
          "Finds it hard to copy actions or follow a sequence of steps",
          "Play is repetitive, or your child struggles to join in with others",
          "Easily frustrated when a task does not work the first time",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "If several of these feel familiar, the sensible next step is an assessment. It is not a commitment to long-term therapy — often it simply gives you a clear picture and a few practical strategies you can start using at home.",
          "Bring what you have noticed in everyday life. Parent observations are one of the most useful things a therapist can hear.",
        ],
      },
      {
        quote:
          "Assessment is not about labelling a child. It is about understanding what is hard, and what will make it easier.",
      },
    ],
  },
  {
    slug: "speech-and-language-milestones",
    title: "Speech and language milestones: what to expect from 1 to 5 years",
    description:
      "A parent-friendly guide to the communication milestones that matter, and the signs that warrant an early speech and language assessment.",
    date: "2026-09-20",
    readingMinutes: 6,
    category: "Speech & Language",
    tags: ["milestones", "early intervention", "speech delay"],
    authorId: "abhishek-kumar",
    related: ["speech-language-delay", "speech-sound-disorder", "stuttering"],
    sections: [
      {
        paragraphs: [
          "Milestones are a guide, not a test. Children develop at different rates, and a slightly later start is often nothing to worry about. But some patterns are worth acting on early, because the first years are when intervention has the greatest effect.",
        ],
      },
      {
        heading: "Around 12–18 months",
        bullets: [
          "Babbling with a range of sounds, and using gestures such as pointing",
          "Responding to their name and to simple words like 'no'",
          "First words usually appear between 12 and 18 months",
        ],
      },
      {
        heading: "Around 2 years",
        bullets: [
          "Using around 50 words and beginning to join two words together",
          "Following simple two-step instructions",
          "Being understood by familiar adults about half the time",
        ],
      },
      {
        heading: "Around 3 years",
        bullets: [
          "Short sentences of three or four words",
          "Asking simple questions",
          "Being understood by unfamiliar adults most of the time",
        ],
      },
      {
        heading: "Around 4–5 years",
        bullets: [
          "Telling simple stories and holding a conversation",
          "Speech that is clear to almost everyone",
          "Following longer instructions and understanding why/what/where questions",
        ],
      },
      {
        heading: "When to seek an assessment",
        bullets: [
          "No words by 18 months, or no two-word phrases by 24 months",
          "Speech that is much harder to understand than other children the same age",
          "Difficulty understanding instructions, or seeming not to hear",
          "Loss of words or skills your child previously had",
          "Frustration, withdrawal or behaviour changes around communication",
        ],
        paragraphs: [
          "Hearing should always be checked as part of this. Undetected hearing loss is a common and treatable cause of speech delay.",
        ],
      },
      {
        heading: "The good news",
        paragraphs: [
          "Early intervention works. Therapy at this age looks a lot like play, and much of the progress happens at home with the small interactions you already have every day.",
        ],
      },
    ],
  },
  {
    slug: "sensory-processing-why-meltdowns-happen",
    title: "Sensory processing: why the sock seam causes a meltdown",
    description:
      "Understanding sensory processing differences, and what actually helps a child who is overwhelmed by everyday sensations.",
    date: "2026-10-02",
    readingMinutes: 5,
    category: "Occupational Therapy",
    tags: ["sensory", "regulation", "autism"],
    authorId: "md-irfan",
    related: ["sensory-processing", "autism-spectrum-disorder", "adhd"],
    sections: [
      {
        paragraphs: [
          "To most of us, a sock seam is nothing. To a child with sensory processing differences, it can be genuinely unbearable. The sensation is not exaggerated — the nervous system is registering it differently.",
          "Sensory processing is how the brain takes in and organises information from touch, movement, sound, sight and body awareness. When that process is inefficient, ordinary environments can feel overwhelming — or underwhelming, which is why some children constantly seek movement.",
        ],
      },
      {
        heading: "Two patterns, same underlying issue",
        bullets: [
          "Over-responsive: avoids noise, textures, messy play; startles easily",
          "Under-responsive: seems not to notice sensations, or seeks intense input",
          "Seeking: constantly moving, crashing, chewing, or touching everything",
          "Fluctuating: regulated in one environment and overwhelmed in another",
        ],
      },
      {
        heading: "What actually helps",
        bullets: [
          "Identify the specific triggers rather than removing all stimulation",
          "Build movement and pressure breaks into the day, before dysregulation peaks",
          "Give advance warning of transitions and changes",
          "Reduce competing sensory input at demanding times such as homework",
        ],
        paragraphs: [
          "This is the idea behind a 'sensory diet' — a planned pattern of sensory input across the day that keeps regulation steadier.",
        ],
      },
      {
        heading: "Where therapy fits",
        paragraphs: [
          "An occupational therapist assesses your child's sensory profile and designs both clinic sessions and a home sensory diet. The goal is not to make a child tolerate everything, but to give them — and you — reliable ways to stay regulated.",
        ],
      },
    ],
  },
  {
    slug: "hearing-loss-in-children-early-signs",
    title: "Hearing loss in children: early signs parents often miss",
    description:
      "Hearing loss can be subtle and easy to miss. Here are the signs that should prompt a hearing assessment.",
    date: "2026-10-14",
    readingMinutes: 4,
    category: "Audiology",
    tags: ["hearing", "assessment", "early intervention"],
    authorId: "abhishek-kumar",
    related: ["hearing-loss", "speech-language-delay"],
    sections: [
      {
        paragraphs: [
          "Hearing loss in children is often gradual, and children adapt so quietly that parents rarely notice the hearing itself — they notice behaviour instead.",
          "Because hearing underpins speech, language and learning, it is one of the first things to check whenever communication is delayed.",
        ],
      },
      {
        heading: "Signs to watch for",
        bullets: [
          "Turning the television or device volume up higher than others need",
          "Frequently asking for things to be repeated",
          "Watching faces closely, or relying on lip-reading without realising it",
          "Speech that is unclear, or missing particular sounds",
          "Struggling in group settings but managing one-to-one",
          "Withdrawal, inattention or tiredness at the end of the school day",
        ],
      },
      {
        heading: "Why early matters",
        paragraphs: [
          "The first years are critical for language development. When hearing is addressed early, the impact on speech and learning is far smaller.",
        ],
      },
      {
        heading: "What an assessment involves",
        paragraphs: [
          "A basic audiological assessment evaluates hearing across the speech range. Results are explained in plain language, with clear recommendations — whether that is monitoring, medical referral, or a hearing-aid fitting.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByAuthor(professionalId: string): BlogPost[] {
  return blogPosts.filter((post) => post.authorId === professionalId);
}

/** Newest first. */
export const sortedPosts = [...blogPosts].sort((a, b) =>
  b.date.localeCompare(a.date),
);
