/**
 * Portfolio media.
 *
 * TODO(media): no `src` values are set yet, so the UI renders branded
 * placeholders. Add real photo/video URLs (with consent for anyone
 * identifiable) and the gallery fills in automatically.
 */

import type { Album, MediaAsset } from "@/types";

export const mediaAssets: MediaAsset[] = [
  // ---- Paediatric therapy -------------------------------------------------
  {
    id: "paed-1",
    kind: "image",
    alt: "Therapist guiding a child through a fine-motor stacking activity",
    caption: "Fine-motor work, built through play",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
  },
  {
    id: "paed-2",
    kind: "image",
    alt: "Child practising handwriting with a guided grip",
    caption: "Handwriting and pencil control",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
  },
  {
    id: "paed-3",
    kind: "video",
    alt: "Short clip of a paediatric therapy session",
    caption: "A paediatric session in progress",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
    durationSeconds: 45,
  },
  {
    id: "paed-4",
    kind: "image",
    alt: "Therapist and parent reviewing a home programme together",
    caption: "Parent coaching and home programmes",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
  },

  // ---- Sensory integration ------------------------------------------------
  {
    id: "sensory-1",
    kind: "image",
    alt: "Child on a swing during a sensory integration session",
    caption: "Sensory integration: movement and regulation",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
  },
  {
    id: "sensory-2",
    kind: "image",
    alt: "Sensory play with textured materials",
    caption: "Building tolerance through messy play",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
  },
  {
    id: "sensory-3",
    kind: "video",
    alt: "Clip of an obstacle course used in sensory therapy",
    caption: "Obstacle courses for motor planning",
    discipline: "occupational-therapy",
    professionalId: "md-irfan",
    durationSeconds: 38,
  },

  // ---- Speech & language --------------------------------------------------
  {
    id: "speech-1",
    kind: "image",
    alt: "Speech therapist working on sounds with a child at a table",
    caption: "Speech sound practice",
    discipline: "speech-language",
    professionalId: "abhishek-kumar",
  },
  {
    id: "speech-2",
    kind: "image",
    alt: "Child using picture cards during a language session",
    caption: "Vocabulary and sentence building",
    discipline: "speech-language",
    professionalId: "abhishek-kumar",
  },
  {
    id: "speech-3",
    kind: "video",
    alt: "Short clip of an early-intervention speech session",
    caption: "Early intervention through play",
    discipline: "speech-language",
    professionalId: "abhishek-kumar",
    durationSeconds: 52,
  },
  {
    id: "speech-4",
    kind: "image",
    alt: "Parent and therapist practising communication strategies together",
    caption: "Coaching parents to carry practice home",
    discipline: "speech-language",
    professionalId: "abhishek-kumar",
  },

  // ---- Audiology ----------------------------------------------------------
  {
    id: "audio-1",
    kind: "image",
    alt: "Audiological assessment equipment set up for a hearing evaluation",
    caption: "Hearing assessment and evaluation",
    discipline: "audiology",
    professionalId: "abhishek-kumar",
  },
  {
    id: "audio-2",
    kind: "image",
    alt: "Hearing aid being fitted and adjusted",
    caption: "Hearing-aid selection and fitting",
    discipline: "audiology",
    professionalId: "abhishek-kumar",
  },
  {
    id: "audio-3",
    kind: "image",
    alt: "Hearing aid being programmed on a computer",
    caption: "Programming and fine-tuning",
    discipline: "audiology",
    professionalId: "abhishek-kumar",
  },

  // ---- Community & outreach ----------------------------------------------
  {
    id: "outreach-1",
    kind: "image",
    alt: "Therapy session at an NGO community setting",
    caption: "Community outreach sessions",
    professionalId: "md-irfan",
  },
  {
    id: "outreach-2",
    kind: "image",
    alt: "Group awareness session with parents and caregivers",
    caption: "Parent and caregiver awareness sessions",
    professionalId: "abhishek-kumar",
  },
];

export const albums: Album[] = [
  {
    slug: "paediatric-therapy",
    title: "Paediatric Therapy",
    description:
      "Play-based occupational therapy sessions building motor, sensory and daily-living skills.",
    discipline: "occupational-therapy",
    mediaIds: ["paed-1", "paed-2", "paed-3", "paed-4"],
  },
  {
    slug: "sensory-integration",
    title: "Sensory Integration & Play",
    description:
      "Sensory-rich sessions that help children regulate and engage with the world around them.",
    discipline: "occupational-therapy",
    mediaIds: ["sensory-1", "sensory-2", "sensory-3"],
  },
  {
    slug: "speech-and-language",
    title: "Speech & Language Sessions",
    description:
      "Communication work from first words to confident conversation.",
    discipline: "speech-language",
    mediaIds: ["speech-1", "speech-2", "speech-3", "speech-4"],
  },
  {
    slug: "audiology",
    title: "Audiology & Hearing Care",
    description:
      "Hearing assessment, hearing-aid fitting, programming and counselling.",
    discipline: "audiology",
    mediaIds: ["audio-1", "audio-2", "audio-3"],
  },
  {
    slug: "community-outreach",
    title: "Community & NGO Outreach",
    description:
      "Therapy and awareness work delivered in community and NGO settings.",
    mediaIds: ["outreach-1", "outreach-2"],
  },
];

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

export function getMediaById(id: string): MediaAsset | undefined {
  return mediaAssets.find((asset) => asset.id === id);
}

export function getMediaForAlbum(album: Album): MediaAsset[] {
  return album.mediaIds
    .map((id) => getMediaById(id))
    .filter((asset): asset is MediaAsset => Boolean(asset));
}

export const portfolioDisclaimer =
  "Photographs and videos are shared with the consent of the families involved. Faces may be blurred where consent for identifiable images has not been given.";
