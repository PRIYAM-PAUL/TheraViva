/**
 * Condition pages — the SEO backbone of the site.
 *
 * Each entry becomes `/conditions/<slug>`. Content is written for parents and
 * caregivers in plain language. Medical claims are deliberately general; this
 * is educational information, not a diagnosis.
 */

import type { Condition } from "@/types";

export const conditions: Condition[] = [
  {
    slug: "autism-spectrum-disorder",
    title: "Autism Spectrum Disorder (ASD) — Support & Therapy",
    shortTitle: "Autism (ASD)",
    disciplines: ["occupational-therapy", "speech-language"],
    ageGroup: "child",
    summary:
      "Early, consistent therapy can make a meaningful difference to communication, sensory regulation and everyday independence for children with autism.",
    body: [
      "Autism is a developmental difference that affects how a child communicates, interacts socially, and processes sensory information. Every child is different: some are non-speaking, some have rich language but find social interaction hard, and many experience sensory overload.",
      "Therapy is most effective when it starts early and is consistent. Occupational therapy focuses on sensory regulation, play and daily-living skills; speech and language therapy builds functional communication — whether that is spoken language, signs, or a communication aid.",
      "At this practice, both disciplines work together so goals reinforce each other, and parents are coached to carry strategies into everyday routines at home.",
    ],
    signs: [
      "Little or no response to their name by 12 months",
      "Few or no words by 18–24 months, or loss of language already acquired",
      "Repetitive movements or intense focus on particular objects",
      "Difficulty with changes to routine or transitions",
      "Over- or under-reaction to sounds, textures, lights or touch",
      "Limited eye contact, pointing, or shared attention",
    ],
    approach: [
      "A joint occupational therapy and speech-language assessment to establish a baseline",
      "Individualised goals agreed with the family, reviewed regularly",
      "Sensory regulation and play-based skill building",
      "Functional communication work, including parent coaching and home programmes",
    ],
    faq: [
      {
        question: "At what age should therapy start?",
        answer:
          "As early as concerns arise. Early intervention takes advantage of the brain's fastest period of development, so it is never too early to have a child assessed.",
      },
      {
        question: "Can therapy be delivered online?",
        answer:
          "Much of it can. Early-intervention and language work is often delivered effectively online with a parent present, while sensory-integration work is usually best in person.",
      },
      {
        question: "Will my child be 'cured'?",
        answer:
          "Therapy does not remove autism, and we do not frame it that way. The goal is to build skills, reduce distress, and improve participation in daily life — on the child's terms.",
      },
    ],
    services: [
      "paediatric-occupational-therapy",
      "sensory-integration-therapy",
      "early-intervention",
      "social-communication-therapy",
    ],
    professionalIds: ["md-irfan", "abhishek-kumar"],
  },
  {
    slug: "adhd",
    title: "ADHD — Occupational & Speech Therapy Support",
    shortTitle: "ADHD",
    disciplines: ["occupational-therapy", "speech-language"],
    ageGroup: "child",
    summary:
      "Practical strategies for attention, organisation, impulse control and the everyday demands of home and school.",
    body: [
      "Children with ADHD often find it hard to sustain attention, organise themselves, wait their turn, or manage the pace of a classroom. This is not a matter of effort or discipline — it reflects how the brain regulates attention and impulses.",
      "Occupational therapy works on the functional side: routines, organisation, sensory regulation and the skills needed to complete daily tasks. Speech and language therapy supports the language demands that ADHD can complicate, such as following multi-step instructions and organising what to say.",
      "The most effective plans involve the people around the child. Sessions therefore include practical coaching for parents and, where useful, strategies that can be shared with school.",
    ],
    signs: [
      "Difficulty sustaining attention on tasks, especially ones that are not preferred",
      "Frequent losing of items, or forgetfulness in daily routines",
      "Trouble waiting, interrupting, or acting before thinking",
      "Restlessness, fidgeting, or constant movement",
      "Difficulty following multi-step instructions",
      "Handwriting that is rushed, uneven or hard to read",
    ],
    approach: [
      "Functional assessment of attention, organisation and daily routines",
      "Sensory and movement strategies that support regulation",
      "Handwriting and school-readiness work where needed",
      "Parent coaching and school liaison strategies",
    ],
    faq: [
      {
        question: "Does my child need a diagnosis before therapy?",
        answer:
          "No. Therapy can start from the difficulties you are seeing day to day, and an assessment can help clarify what is going on.",
      },
      {
        question: "Is therapy a replacement for medication?",
        answer:
          "No. Therapy and medication are separate decisions made with the treating doctor. We work on functional skills and strategies, and never advise on medication.",
      },
      {
        question: "How long does support usually last?",
        answer:
          "It varies. Some families need a short block of sessions and a strong home plan; others benefit from ongoing support across school years.",
      },
    ],
    services: [
      "paediatric-occupational-therapy",
      "handwriting-and-school-readiness",
      "sensory-integration-therapy",
      "social-communication-therapy",
    ],
    professionalIds: ["md-irfan", "abhishek-kumar"],
  },
  {
    slug: "cerebral-palsy",
    title: "Cerebral Palsy — Therapy for Movement & Daily Life",
    shortTitle: "Cerebral Palsy",
    disciplines: ["occupational-therapy", "speech-language"],
    ageGroup: "all",
    summary:
      "Supporting movement, self-care, communication and participation for children and adults with cerebral palsy.",
    body: [
      "Cerebral palsy affects movement and posture, and often co-occurs with difficulties in speech, feeding and daily self-care. Its impact varies widely from person to person.",
      "Occupational therapy focuses on what the person wants and needs to do: dressing, eating, playing, learning, and moving around their environment. Where speech is affected, speech and language therapy builds the most functional communication available — spoken, signed, or aided.",
      "Progress is measured against practical goals, and equipment or environmental adaptations are recommended where they make daily life genuinely easier.",
    ],
    signs: [
      "Delayed motor milestones such as sitting, rolling or walking",
      "Stiff or floppy muscle tone, or asymmetric movement",
      "Difficulty with fine-motor tasks such as grasping or feeding",
      "Speech that is difficult to understand",
      "Difficulty with self-care routines such as dressing",
      "Fatigue or frustration during everyday activities",
    ],
    approach: [
      "Assessment of movement, self-care and communication goals",
      "Goal-directed therapy focused on functional daily activities",
      "Positioning, handling and equipment recommendations",
      "Communication support, including parent/caregiver training",
    ],
    faq: [
      {
        question: "Can therapy help if cerebral palsy is lifelong?",
        answer:
          "Yes. While cerebral palsy is not curable, therapy meaningfully improves function, comfort, independence and participation at every stage of life.",
      },
      {
        question: "Should therapy be in person or online?",
        answer:
          "Hands-on occupational therapy is usually in person. Communication work and home-programme reviews can work well online.",
      },
      {
        question: "Do you work with schools?",
        answer:
          "Where it helps, yes. Practical strategies can be shared with teachers and support staff so progress carries into the classroom.",
      },
    ],
    services: [
      "paediatric-occupational-therapy",
      "speech-sound-therapy",
      "language-therapy",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan", "abhishek-kumar"],
  },
  {
    slug: "sensory-processing",
    title: "Sensory Processing Difficulties — Sensory Integration Therapy",
    shortTitle: "Sensory Processing",
    disciplines: ["occupational-therapy"],
    ageGroup: "child",
    summary:
      "For children who find everyday sensations overwhelming, distracting or not enough to feel settled.",
    body: [
      "Some children react strongly to ordinary sensations — loud rooms, certain fabrics, messy play — while others seek out movement and pressure to feel regulated. Both patterns can make everyday life and learning harder than it needs to be.",
      "Sensory integration therapy helps the nervous system organise and respond to sensory information more effectively. Sessions are playful but purposeful, gradually building tolerance and regulation.",
      "Therapy is paired with a 'sensory diet': practical strategies woven into home and school routines so regulation improves outside the clinic too.",
    ],
    signs: [
      "Distress or avoidance around noise, textures, or messy play",
      "Constant movement, crashing, or seeking pressure",
      "Difficulty settling to sleep or to sit still for meals",
      "Over- or under-reaction to pain, temperature or touch",
      "Meltdowns that seem out of proportion to the trigger",
      "Difficulty with transitions and unfamiliar environments",
    ],
    approach: [
      "Sensory profile and functional assessment",
      "Individualised sensory integration sessions",
      "A practical sensory diet for home and school",
      "Regular review and adjustment as regulation improves",
    ],
    faq: [
      {
        question: "Is sensory processing a real diagnosis?",
        answer:
          "Sensory processing differences are widely recognised clinically and often occur alongside autism, ADHD and developmental delay. An assessment clarifies your child's specific pattern.",
      },
      {
        question: "Can this be done online?",
        answer:
          "Sensory integration therapy itself is hands-on and in person. Coaching on the home sensory diet can be done online.",
      },
      {
        question: "How soon will we see change?",
        answer:
          "Many families notice small changes within a few weeks, but regulation builds gradually. Consistent home strategies make the biggest difference.",
      },
    ],
    services: ["sensory-integration-therapy", "paediatric-occupational-therapy"],
    professionalIds: ["md-irfan"],
  },
  {
    slug: "handwriting",
    title: "Handwriting Difficulties — Assessment & Therapy",
    shortTitle: "Handwriting",
    disciplines: ["occupational-therapy"],
    ageGroup: "child",
    summary:
      "When handwriting is slow, painful or hard to read, targeted therapy can make writing easier and schoolwork less stressful.",
    body: [
      "Handwriting is a complex skill: it depends on posture, shoulder and hand strength, fine-motor control, visual perception and attention. When one of these is weak, writing becomes tiring and legibility suffers.",
      "Occupational therapy breaks the skill down and builds the pieces that are missing — rather than simply asking a child to 'try harder' or practise more.",
      "Work typically covers grip and posture, letter formation and spacing, speed and endurance, and the organisational skills that support written work in class.",
    ],
    signs: [
      "Writing that is slow, tiring or avoided",
      "Uneven letter size, spacing or alignment",
      "An awkward or painful pencil grip",
      "Letters formed from the bottom up or reversed",
      "Complaints of hand pain or fatigue during writing",
      "A large gap between what a child can say and what they can write",
    ],
    approach: [
      "Assessment of posture, grip, motor control and visual perception",
      "Targeted strengthening and fine-motor activities",
      "Letter-formation and spacing practice with feedback",
      "Classroom accommodations where they help",
    ],
    faq: [
      {
        question: "Is handwriting still important in a digital age?",
        answer:
          "Yes. Handwriting underpins spelling, note-taking and written expression at school, and remains a core daily task for years.",
      },
      {
        question: "My child just needs more practice — is that enough?",
        answer:
          "Practice helps once the underlying skills are in place. If posture, grip or motor control is the limiting factor, more practice alone often increases frustration.",
      },
      {
        question: "How long before handwriting improves?",
        answer:
          "Most children show clear change within 8–12 weeks of consistent work, with home practice making a real difference.",
      },
    ],
    services: [
      "handwriting-and-school-readiness",
      "occupational-therapy-assessment",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan"],
  },
  {
    slug: "developmental-delay",
    title: "Developmental Delay — Early Intervention",
    shortTitle: "Developmental Delay",
    disciplines: ["occupational-therapy", "speech-language"],
    ageGroup: "child",
    summary:
      "When a child is behind on milestones, early therapy can change the trajectory.",
    body: [
      "Developmental delay means a child is not meeting expected milestones in one or more areas — movement, speech, play, self-care or learning. Early identification matters, because the first years are when intervention has the greatest effect.",
      "Therapy targets the specific skills that are behind, using play and daily routines as the vehicle. Occupational therapy addresses motor, sensory and self-care skills; speech and language therapy addresses communication.",
      "Parents are central to the plan. Much of the progress happens at home, so sessions include coaching and a clear home programme.",
    ],
    signs: [
      "Not sitting, crawling or walking within the expected age range",
      "Few or no words by 18–24 months",
      "Difficulty with feeding, dressing or self-care for their age",
      "Limited pretend play or interest in other children",
      "Difficulty following simple instructions",
      "Loss of skills the child previously had",
    ],
    approach: [
      "Developmental assessment across motor, sensory, communication and self-care domains",
      "Prioritised goals set with the family",
      "Play-based therapy that builds specific skills",
      "Parent coaching and regular progress review",
    ],
    faq: [
      {
        question: "Is my child just a late bloomer?",
        answer:
          "Some children do catch up on their own. An assessment is the only reliable way to tell the difference, and early input is never wasted.",
      },
      {
        question: "Which therapy does my child need first?",
        answer:
          "That depends on the assessment. Many children benefit from more than one discipline, and the team coordinates goals so they reinforce each other.",
      },
      {
        question: "Can we start online?",
        answer:
          "Yes, particularly for communication and home-programme work. Motor and sensory work is usually best assessed in person first.",
      },
    ],
    services: [
      "occupational-therapy-assessment",
      "early-intervention",
      "paediatric-occupational-therapy",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan", "abhishek-kumar"],
  },
  {
    slug: "down-syndrome",
    title: "Down Syndrome — Speech & Occupational Therapy",
    shortTitle: "Down Syndrome",
    disciplines: ["speech-language", "occupational-therapy"],
    ageGroup: "child",
    summary:
      "Building communication, motor skills and independence with steady, consistent therapy.",
    body: [
      "Children with Down syndrome develop skills at their own pace and benefit enormously from early, consistent therapy. Communication and independence are usually the highest priorities.",
      "Speech and language therapy builds vocabulary, sentence formation and clarity of speech, often supported by signs or visual supports in the early years. Occupational therapy develops fine-motor skills, self-care and school readiness.",
      "Progress is steady rather than fast, and consistency — at the clinic and at home — is what makes the difference.",
    ],
    signs: [
      "Delayed first words or limited vocabulary for age",
      "Speech that is difficult to understand",
      "Difficulty with fine-motor tasks such as fastening buttons",
      "Delayed self-care skills such as feeding or dressing",
      "Difficulty with attention and following instructions",
      "Low muscle tone affecting posture and movement",
    ],
    approach: [
      "Assessment of communication, motor and self-care skills",
      "Individualised, pace-appropriate therapy goals",
      "Visual supports and signing where they help communication",
      "Parent coaching for consistent home practice",
    ],
    faq: [
      {
        question: "Is there an age limit for starting therapy?",
        answer:
          "No. Therapy is valuable at every age. Earlier is generally better, but meaningful progress happens whenever you start.",
      },
      {
        question: "Will my child learn to talk?",
        answer:
          "Many children do develop useful spoken language; others communicate best with a combination of speech, signs and visual supports. The goal is functional communication.",
      },
      {
        question: "How often should sessions be?",
        answer:
          "Usually once or twice a week, reviewed regularly. Consistency matters more than intensity.",
      },
    ],
    services: ["early-intervention", "language-therapy", "paediatric-occupational-therapy"],
    professionalIds: ["abhishek-kumar", "md-irfan"],
  },
  {
    slug: "speech-language-delay",
    title: "Speech & Language Delay — When Should You Worry?",
    shortTitle: "Speech & Language Delay",
    disciplines: ["speech-language"],
    ageGroup: "child",
    summary:
      "Most children follow a predictable path to talking. When they don't, early assessment and therapy help.",
    body: [
      "A speech and language delay means a child is developing communication skills more slowly than expected for their age — fewer words, limited understanding, or difficulty putting sentences together.",
      "Delays can be caused by many things, from hearing difficulties to developmental conditions, and sometimes there is no clear cause at all. An assessment identifies what is behind the delay and what to do about it.",
      "Early intervention works. Therapy builds communication through play and daily routines, and coaches parents on the small, frequent interactions that drive progress at this age.",
    ],
    signs: [
      "No babbling or gesture by 12 months",
      "No words by 18 months, or no two-word phrases by 24 months",
      "Difficulty understanding simple instructions",
      "Speech that is much harder to understand than peers'",
      "Frustration or behaviour changes when trying to communicate",
      "Loss of words or skills the child previously had",
    ],
    approach: [
      "Speech, language and hearing assessment",
      "Individualised communication goals",
      "Play-based therapy with parent coaching",
      "Regular review and home programme updates",
    ],
    faq: [
      {
        question: "Should I wait until my child is older?",
        answer:
          "Waiting is the one thing we would not recommend. If you have concerns, an assessment either reassures you or gets support started early.",
      },
      {
        question: "Does my child need a hearing test?",
        answer:
          "Yes — hearing is one of the first things to rule out, because undetected hearing loss is a common and treatable cause of speech delay.",
      },
      {
        question: "How quickly can we get started?",
        answer:
          "Send a request and the practice will confirm a time, usually within a few working days.",
      },
    ],
    services: [
      "speech-and-language-assessment",
      "early-intervention",
      "language-therapy",
      "hearing-assessment",
    ],
    professionalIds: ["abhishek-kumar"],
  },
  {
    slug: "speech-sound-disorder",
    title: "Speech Sound & Articulation Difficulties",
    shortTitle: "Speech Sounds",
    disciplines: ["speech-language"],
    ageGroup: "child",
    summary:
      "When sounds are missed, swapped or distorted, speech can be hard to understand — and therapy fixes it.",
    body: [
      "Speech sound difficulties include substituting one sound for another, leaving sounds out, or distorting them. Some patterns are normal at certain ages and resolve on their own; others persist and need therapy.",
      "An assessment identifies which sounds are affected and whether the pattern is age-appropriate. Therapy then targets those sounds systematically, moving from isolated sounds to words, sentences and conversation.",
      "Short daily practice at home is a major part of progress, and families are given a simple routine to follow.",
    ],
    signs: [
      "Speech that unfamiliar listeners cannot understand",
      "Specific sounds consistently missing or swapped",
      "A lisp or distorted 's', 'z', 'sh' or 'ch'",
      "Speech that improved and then plateaued",
      "Avoidance of speaking or frustration when misunderstood",
      "Difficulty being understood by teachers or peers",
    ],
    approach: [
      "Speech sound assessment and error-pattern analysis",
      "Systematic therapy from sounds to conversation",
      "Daily home practice routine for families",
      "Regular review of generalisation into everyday speech",
    ],
    faq: [
      {
        question: "Is it just baby talk that will pass?",
        answer:
          "Some patterns do resolve with age. Others do not, and the only way to know is an assessment of which sounds are affected at your child's age.",
      },
      {
        question: "How long does therapy take?",
        answer:
          "It depends on the number and type of sounds. Many children resolve a single sound in a few months of consistent practice.",
      },
      {
        question: "Can this be done online?",
        answer:
          "Yes, articulation therapy works well online with a parent nearby to support practice.",
      },
    ],
    services: ["speech-sound-therapy", "speech-and-language-assessment"],
    professionalIds: ["abhishek-kumar"],
  },
  {
    slug: "stuttering",
    title: "Stuttering / Fluency — Therapy for Children & Adults",
    shortTitle: "Stuttering",
    disciplines: ["speech-language"],
    ageGroup: "all",
    summary:
      "Practical, evidence-informed support for smoother speech and greater confidence.",
    body: [
      "Stuttering affects the flow of speech — repetitions, prolongations and blocks. It varies day to day and can be affected by stress, fatigue and situation.",
      "Therapy combines fluency techniques with work on confidence and communication, because the impact of stuttering is often as much social as it is physical.",
      "For young children, early intervention can prevent a pattern from becoming established. For adults, therapy focuses on control, acceptance and real-world communication.",
    ],
    signs: [
      "Repetition of sounds, syllables or words",
      "Stretching or prolonging sounds",
      "Blocks where no sound comes out",
      "Physical tension in the face or neck while speaking",
      "Avoidance of certain words, situations or speaking at all",
      "Anxiety about speaking in class, at work or on the phone",
    ],
    approach: [
      "Assessment of fluency pattern, severity and impact",
      "Fluency techniques matched to age and goals",
      "Confidence and communication work",
      "Practice strategies for real-world situations",
    ],
    faq: [
      {
        question: "Can stuttering be cured?",
        answer:
          "Many children respond very well to early therapy; adults can achieve significant, lasting improvement. We are honest about what to expect rather than promising a cure.",
      },
      {
        question: "Is online therapy effective for stuttering?",
        answer:
          "Yes. Fluency therapy is well suited to video sessions, and many adults prefer them.",
      },
      {
        question: "At what age should we start?",
        answer:
          "If stuttering persists beyond about six months, runs in the family, or is causing distress, get an assessment early.",
      },
    ],
    services: ["fluency-therapy", "speech-and-language-assessment"],
    professionalIds: ["abhishek-kumar"],
  },
  {
    slug: "hearing-loss",
    title: "Hearing Loss — Assessment, Hearing Aids & Counselling",
    shortTitle: "Hearing Loss",
    disciplines: ["audiology"],
    ageGroup: "all",
    summary:
      "From hearing assessment to a properly fitted, properly tuned hearing aid.",
    body: [
      "Hearing loss can affect communication, learning and confidence, and it often develops gradually enough that it goes unnoticed. It is one of the first things to check when speech or learning is delayed.",
      "Audiology services cover basic hearing assessment and evaluation, hearing-aid selection and fitting, and programming and fine-tuning after fitting.",
      "A hearing aid only helps if it is comfortable, correctly tuned and actually worn. Counselling and follow-up are therefore treated as part of the service, not an afterthought.",
    ],
    signs: [
      "Frequently asking people to repeat themselves",
      "Difficulty following conversation in background noise",
      "Turning the television or phone volume up high",
      "Speech or language delay in a young child",
      "Ringing or discomfort in the ears",
      "Withdrawal from conversations or social situations",
    ],
    approach: [
      "Basic audiological assessment and hearing evaluation",
      "Hearing-aid selection matched to needs and budget",
      "Fitting, programming and fine-tuning",
      "Counselling, care instructions and follow-up",
    ],
    faq: [
      {
        question: "Do you sell hearing aids?",
        answer:
          "This practice provides assessment, selection guidance, fitting and programming. Device pricing and supply are confirmed at the appointment.",
      },
      {
        question: "How long does a hearing-aid fitting take?",
        answer:
          "The fitting appointment is about an hour, with a follow-up tuning session usually within a few weeks.",
      },
      {
        question: "Can my child be assessed?",
        answer:
          "Yes. Hearing assessment is appropriate for children and is an important part of investigating speech and language delay.",
      },
    ],
    services: [
      "hearing-assessment",
      "hearing-aid-fitting",
      "hearing-aid-programming",
      "hearing-aid-counselling",
    ],
    professionalIds: ["abhishek-kumar"],
  },
  {
    slug: "stroke",
    title: "Stroke Rehabilitation — Occupational Therapy",
    shortTitle: "Stroke Rehabilitation",
    disciplines: ["occupational-therapy"],
    ageGroup: "adult",
    summary:
      "Rebuilding independence in daily life after a stroke, one practical goal at a time.",
    body: [
      "After a stroke, ordinary tasks — dressing, eating, washing, moving safely around the home — can become difficult. Occupational therapy addresses exactly those tasks.",
      "Therapy is goal-directed: what does the person most want to get back to? Sessions then build the strength, coordination and strategies needed to get there, and adapt the environment where that helps.",
      "Caregivers are trained too, because recovery continues between sessions and at home.",
    ],
    signs: [
      "Weakness or reduced control on one side of the body",
      "Difficulty with dressing, eating or personal care",
      "Reduced coordination or hand function",
      "Difficulty with attention, planning or memory",
      "Fatigue during everyday tasks",
      "Reduced confidence or low mood after the stroke",
    ],
    approach: [
      "Functional assessment of daily activities and home environment",
      "Goal-directed therapy for the tasks that matter most",
      "Adaptation strategies and equipment recommendations",
      "Caregiver training and home programme",
    ],
    faq: [
      {
        question: "How soon after a stroke should therapy start?",
        answer:
          "As soon as it is medically safe. Early rehabilitation is linked to better functional outcomes.",
      },
      {
        question: "Can therapy be done at home?",
        answer:
          "Yes — home-based occupational therapy is often the most practical setting, because that is where the tasks actually happen.",
      },
      {
        question: "How long does rehabilitation take?",
        answer:
          "It varies widely. Many people continue to make gains for months and even years with consistent input.",
      },
    ],
    services: [
      "adult-neuro-rehabilitation",
      "occupational-therapy-assessment",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan"],
  },
  {
    slug: "parkinsons-disease",
    title: "Parkinson's Disease — Occupational Therapy Support",
    shortTitle: "Parkinson's Disease",
    disciplines: ["occupational-therapy"],
    ageGroup: "adult",
    summary:
      "Practical strategies to keep daily life manageable as Parkinson's progresses.",
    body: [
      "Parkinson's affects movement, but its impact is felt most in daily routines — dressing, eating, writing, and moving safely around the home.",
      "Occupational therapy works on those routines: breaking tasks down, building strategies that reduce effort, and adapting the environment so independence is maintained for as long as possible.",
      "Because Parkinson's changes over time, therapy is reviewed regularly and adjusted as needs shift.",
    ],
    signs: [
      "Slowness of movement or difficulty starting movements",
      "Tremor affecting writing, eating or dressing",
      "Small, cramped handwriting",
      "Difficulty with buttons, zips or cutlery",
      "Balance problems and fear of falling",
      "Reduced energy for daily tasks",
    ],
    approach: [
      "Functional assessment of daily routines and safety",
      "Strategies to simplify and sequence tasks",
      "Home adaptations and equipment recommendations",
      "Regular review as needs change over time",
    ],
    faq: [
      {
        question: "Is therapy useful in the early stages?",
        answer:
          "Yes. Early strategies help maintain independence and establish habits that make later stages easier.",
      },
      {
        question: "Can therapy help with handwriting?",
        answer:
          "Yes. Micrographia often responds to specific occupational therapy strategies and practice.",
      },
      {
        question: "Do you work alongside a neurologist?",
        answer:
          "Occupational therapy complements medical management. We work on function and daily life, not medication.",
      },
    ],
    services: [
      "adult-neuro-rehabilitation",
      "occupational-therapy-assessment",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan"],
  },
  {
    slug: "dementia",
    title: "Dementia & Cognitive Decline — Functional Support",
    shortTitle: "Dementia",
    disciplines: ["occupational-therapy"],
    ageGroup: "adult",
    summary:
      "Maintaining function, safety and dignity through practical, everyday strategies.",
    body: [
      "Dementia affects memory, thinking and the ability to carry out daily tasks. Occupational therapy focuses on keeping daily life working for as long as possible.",
      "Sessions identify the routines that are becoming difficult and put practical strategies in place — simplifying tasks, using visual cues, and making the home safer.",
      "Family and caregivers are central to the plan, and much of the work is coaching them on how to support independence without taking over.",
    ],
    signs: [
      "Forgetting recent events or repeating questions",
      "Difficulty with familiar tasks such as cooking or paying bills",
      "Getting lost in familiar places",
      "Problems with sequencing everyday activities",
      "Changes in mood, judgement or behaviour",
      "Increased risk of falls or household accidents",
    ],
    approach: [
      "Functional assessment of daily routines and safety",
      "Task simplification and environmental adaptation",
      "Caregiver coaching and routine building",
      "Review as needs change over time",
    ],
    faq: [
      {
        question: "Can therapy slow dementia?",
        answer:
          "Therapy does not reverse dementia. It maintains function, reduces risk, and improves quality of life for the person and their family.",
      },
      {
        question: "Is this mostly for the caregiver?",
        answer:
          "A large part of the work is coaching caregivers, because consistent support at home is what sustains function.",
      },
      {
        question: "Can sessions happen at home?",
        answer:
          "Yes — home-based sessions are often the most useful, because that is where the routines take place.",
      },
    ],
    services: ["adult-neuro-rehabilitation", "occupational-therapy-assessment"],
    professionalIds: ["md-irfan"],
  },
  {
    slug: "guillain-barre",
    title: "Guillain–Barré Syndrome (GBS) — Rehabilitation",
    shortTitle: "Guillain–Barré Syndrome",
    disciplines: ["occupational-therapy"],
    ageGroup: "adult",
    summary:
      "Rebuilding strength, function and independence during and after recovery from GBS.",
    body: [
      "Guillain–Barré syndrome causes rapid-onset weakness that can affect movement, self-care and, at its most severe, breathing. Recovery is usually gradual and can take months.",
      "Occupational therapy supports that recovery: rebuilding hand function and strength, retraining daily tasks, managing fatigue, and adapting routines during the period of greatest weakness.",
      "Because recovery is long, therapy focuses on steady, measurable gains and on keeping the person as independent as possible at every stage.",
    ],
    signs: [
      "Weakness or tingling starting in the feet and legs",
      "Difficulty walking, standing or climbing stairs",
      "Reduced hand grip or fine-motor control",
      "Difficulty with dressing, eating or personal care",
      "Profound fatigue during recovery",
      "Reduced independence in daily routines",
    ],
    approach: [
      "Functional assessment of strength and daily activities",
      "Graded retraining of daily tasks as strength returns",
      "Fatigue management and energy conservation strategies",
      "Home adaptation and caregiver training",
    ],
    faq: [
      {
        question: "How long does recovery take?",
        answer:
          "Recovery varies from weeks to well over a year. Consistent rehabilitation is a major factor in functional outcomes.",
      },
      {
        question: "Can therapy start while I am still weak?",
        answer:
          "Yes. Therapy is graded to current ability, focusing on what is possible now while protecting against fatigue.",
      },
      {
        question: "Will I get back to normal?",
        answer:
          "Many people recover most function, though timelines differ. Therapy aims to maximise independence and quality of life throughout.",
      },
    ],
    services: [
      "adult-neuro-rehabilitation",
      "occupational-therapy-assessment",
      "home-programme-and-parent-coaching",
    ],
    professionalIds: ["md-irfan"],
  },
];

export function getConditionBySlug(slug: string): Condition | undefined {
  return conditions.find((condition) => condition.slug === slug);
}

export function getConditionsByDiscipline(discipline: string): Condition[] {
  return conditions.filter((condition) =>
    condition.disciplines.includes(discipline as never),
  );
}

export function getConditionsByProfessional(professionalId: string): Condition[] {
  return conditions.filter((condition) =>
    condition.professionalIds.includes(professionalId),
  );
}
