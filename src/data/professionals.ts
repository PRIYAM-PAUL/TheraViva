/**
 * Practice professionals — authored from the practitioners' own CVs.
 *
 * TODO(verify) items are marked inline and listed in `PROFESSIONALS.md`:
 *  - `languages` — confirm with the practice (assumed English + Hindi).
 *  - `registrations` — RCI / OTR registration numbers were not supplied.
 *  - `yearsExperience` for MD Irfan — derived from the CV (not stated directly).
 *  - `photo` / `heroVideo` — placeholder paths until real media is supplied.
 */

import type { Professional } from "@/types";

export const professionals: Professional[] = [
  {
    id: "md-irfan",
    slug: "md-irfan",
    name: "MD Irfan",
    headline: "Occupational Therapist · Paediatrics & Neuro-Rehabilitation",
    summary:
      "Master's-qualified occupational therapist helping children and adults build the everyday skills that make independence possible.",
    bio: [
      "MD Irfan is an occupational therapist with a Master's in Occupational Therapy (Paediatrics) from Jamia Hamdard University, New Delhi. He works across paediatric, neurological, orthopaedic and psychiatric rehabilitation.",
      "His clinical work centres on paediatric assessment, sensory integration, fine-motor and handwriting development, school readiness, and activities-of-daily-living (ADL) training — always paired with clear, practical parent and caregiver counselling.",
      "He has delivered therapy in hospital, NGO and clinic settings, including child development centres, and works collaboratively with multidisciplinary teams to set functional, measurable goals that improve participation and quality of life.",
    ],
    disciplines: ["occupational-therapy"],
    conditions: [
      "cerebral-palsy",
      "autism-spectrum-disorder",
      "adhd",
      "sensory-processing",
      "handwriting",
      "developmental-delay",
      "stroke",
      "parkinsons-disease",
      "dementia",
      "guillain-barre",
    ],
    skills: [
      "Paediatric assessment",
      "Sensory integration",
      "Fine motor skill development",
      "Handwriting intervention",
      "School readiness",
      "Activities of daily living (ADL) training",
      "Individualised therapy planning",
      "Patient assessment",
      "Parent & caregiver counselling",
      "Progress evaluation",
      "Clinical documentation",
      "Communication skills",
      "Time management",
      "Multidisciplinary team collaboration",
    ],
    // TODO(verify): confirm languages with the practice.
    languages: ["English", "Hindi"],
    yearsExperience: 2,
    credentials: [
      {
        title: "Master of Occupational Therapy (Paediatrics)",
        institution: "Jamia Hamdard University, New Delhi",
        period: "2024 – 2026",
      },
      {
        title: "Bachelor of Occupational Therapy",
        institution: "Jamia Hamdard University, New Delhi",
        period: "2019 – 2024",
      },
      {
        title: "Senior Secondary (12th, Science)",
        institution: "CBSE Board, New Delhi",
        period: "2019",
      },
      {
        title: "Secondary (10th)",
        institution: "CBSE Board, New Delhi",
        period: "2017",
      },
    ],
    registrations: [
      // TODO(verify): add the verified AIOTA / state registration number.
      { label: "Professional registration", value: "On request" },
    ],
    experience: [
      {
        role: "Consultant Occupational Therapist",
        organisation: "Air Force Families Welfare Association (AFFWA)",
        period: "Nov 2025 – Present",
        location: "New Delhi",
        points: [
          "Assesses and treats paediatric and neurological clients through individualised occupational therapy programmes.",
          "Develops treatment plans that improve functional independence and quality of life.",
          "Educates patients and caregivers on therapy goals, home programmes and rehabilitation strategies.",
        ],
      },
      {
        role: "Consultant Occupational Therapist",
        organisation: "NGO Samadhan",
        period: "Jun 2025 – Present",
        location: "New Delhi",
        points: [
          "Provides occupational therapy to children with developmental and neurological conditions.",
          "Conducts functional assessments and monitors progress over time.",
          "Collaborates with families to achieve individualised therapy goals.",
        ],
      },
      {
        role: "Occupational Therapist",
        organisation: "Neuromotion (Pedigym)",
        period: "Jan 2025 – Apr 2025",
        location: "New Delhi",
        points: [
          "Delivered occupational therapy interventions for paediatric clients.",
          "Implemented evidence-based techniques to improve motor, sensory and cognitive skills.",
          "Maintained patient documentation and progress reports.",
        ],
      },
      {
        role: "Intern — Neurology & Psychiatry",
        organisation: "GB Pant Hospital",
        period: "Jun 2024 – Jul 2024",
        location: "New Delhi",
        points: [
          "Assisted in the assessment and rehabilitation of neurological and psychiatric patients.",
          "Observed and implemented individualised occupational therapy treatment plans.",
          "Worked alongside multidisciplinary healthcare professionals.",
        ],
      },
      {
        role: "Intern — Orthopaedics",
        organisation: "Indira Gandhi Hospital",
        period: "Apr 2024 – May 2024",
        location: "New Delhi",
        points: [
          "Supported rehabilitation for patients recovering from injuries and surgery.",
          "Assisted patients in improving mobility, strength and activities of daily living.",
          "Participated in assessment and progress documentation.",
        ],
      },
      {
        role: "Intern — Paediatrics (Child Development Centre)",
        organisation: "Lok Nayak Hospital",
        period: "Feb 2024 – Mar 2024",
        location: "New Delhi",
        points: [
          "Worked with children experiencing developmental and neurological disorders.",
          "Observed paediatric assessments and therapeutic interventions.",
          "Supported sessions focused on motor, sensory and cognitive skills.",
        ],
      },
    ],
    volunteering: [
      {
        role: "Volunteer Occupational Therapist",
        organisation: "Moms Belief Samvedna",
        period: "Jan 2023 – Jan 2024",
        points: [
          "Worked with children diagnosed with Autism Spectrum Disorder (ASD), ADHD and Cerebral Palsy.",
          "Assisted in therapy planning and parent counselling under professional supervision.",
        ],
        volunteer: true,
      },
      {
        role: "Volunteer Occupational Therapist",
        organisation: "Moms Belief Milestone",
        period: "Jun 2022 – Dec 2022",
        points: [
          "Supported therapy sessions for children with developmental delays.",
          "Assisted therapists in planning and conducting rehabilitation activities.",
        ],
        volunteer: true,
      },
    ],
    email: "78609910mdirfan@gmail.com",
    phone: "+91 7838696558",
    photo: "/media/team/md-irfan.jpg",
  },
  {
    id: "abhishek-kumar",
    slug: "abhishek-kumar",
    name: "Abhishek Kumar",
    headline: "Speech Therapist · Audiologist (ASLP)",
    summary:
      "Speech-language therapist and audiology professional with 4+ years of experience supporting children's communication and hearing needs.",
    bio: [
      "Abhishek Kumar is a qualified ASLP professional with a Diploma in Hearing, Language and Speech (DHLS) and 4+ years of experience across speech-language therapy and audiology services.",
      "He works with children and families on early intervention, communication development and functional speech-language goals — from first sounds and vocabulary to sentence formation, comprehension and social communication.",
      "Alongside therapy, he provides audiological assessment, hearing-aid selection, fitting, programming and fine-tuning, with practical counselling for clients and caregivers.",
    ],
    disciplines: ["speech-language", "audiology"],
    // TODO(verify): the CV's "conditions handled" list does not name stuttering
    // or hearing loss — both are inferred from his speech-language scope and
    // audiology practice. Confirm before launch (see PROFESSIONALS.md).
    conditions: [
      "autism-spectrum-disorder",
      "adhd",
      "down-syndrome",
      "cerebral-palsy",
      "speech-language-delay",
      "speech-sound-disorder",
      "stuttering",
      "hearing-loss",
    ],
    skills: [
      "Speech and language assessment",
      "Individualised therapy planning and intervention",
      "Early intervention & developmental communication support",
      "Speech, language and communication skill development",
      "Receptive and expressive language intervention",
      "Functional and social communication training",
      "Vocabulary, sentence formation and concept development",
      "Following directions and auditory/verbal comprehension activities",
      "Parent/caregiver guidance and home-based therapy support",
      "Clinical documentation and progress monitoring",
      "Basic audiological assessment and hearing evaluation",
      "Hearing-aid selection and fitting",
      "Hearing-aid programming / fine-tuning",
      "Hearing-aid troubleshooting and user guidance",
      "Client counselling and hearing-aid care instructions",
    ],
    // TODO(verify): confirm languages with the practice.
    languages: ["English", "Hindi"],
    yearsExperience: 4,
    credentials: [
      {
        title: "Diploma in Hearing, Language and Speech (DHLS)",
        // TODO(verify): add the awarding institution.
        period: "Completed",
      },
    ],
    registrations: [
      // TODO(verify): add the verified RCI registration number.
      { label: "RCI registration", value: "On request" },
    ],
    experience: [
      {
        role: "Speech Therapist",
        organisation: "Samadhan NGO, Delhi",
        period: "Present",
        location: "Delhi",
        points: [
          "Provides speech-language therapy and individualised intervention for children with communication and developmental needs.",
        ],
      },
      {
        role: "Speech Therapist",
        organisation: "DCWA — Delhi Commonwealth Women Association, Greater Kailash",
        period: "2 years",
        location: "New Delhi",
        points: [
          "Delivered structured speech-language intervention, assessment support, therapy planning and progress-oriented clinical services.",
        ],
      },
      {
        role: "Speech Therapist",
        organisation: "Mom's Belief",
        period: "1 year",
        points: [
          "Provided speech and language therapy with a focus on communication and functional language development.",
        ],
      },
      {
        role: "Audiology Services",
        organisation: "Clinical practice",
        period: "2 years",
        points: [
          "Practical experience in hearing assessment and evaluation.",
          "Hearing-aid selection, fitting, programming and fine-tuning.",
          "Device troubleshooting, user guidance and client counselling.",
        ],
      },
    ],
    volunteering: [],
    email: "ak9478010797@gmail.com",
    phone: "+91 9478010797",
    photo: "/media/team/abhishek-kumar.jpg",
  },
];

/** Look up a professional by id. */
export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find((professional) => professional.id === id);
}

/** Look up a professional by URL slug. */
export function getProfessionalBySlug(slug: string): Professional | undefined {
  return professionals.find((professional) => professional.slug === slug);
}
