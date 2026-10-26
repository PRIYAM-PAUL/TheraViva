import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Accessibility",
  description:
    "Our commitment to making this website usable by everyone, and how to report a problem.",
  path: "/legal/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility statement"
      path="/legal/accessibility"
      updated="October 2026"
    >
      <p>
        We want this website to be usable by everyone, including people using
        screen readers, keyboard navigation, magnification, or reduced-motion
        settings.
      </p>

      <h2>What we aim for</h2>
      <ul>
        <li>Meeting the Web Content Accessibility Guidelines (WCAG) 2.2 at AA level.</li>
        <li>Semantic HTML with a clear heading structure and landmarks.</li>
        <li>Full keyboard operability, with visible focus indicators.</li>
        <li>Text alternatives for images, and captions or transcripts for video where available.</li>
        <li>Sufficient colour contrast, and layouts that work when text is enlarged.</li>
        <li>Respecting the operating system&apos;s reduced-motion preference.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        Some portfolio media has not been published yet. When videos are added, we
        will caption them. If you find an area that is difficult to use, please
        tell us — it helps us fix it.
      </p>

      <h2>Tell us about a problem</h2>
      <p>
        If you have difficulty using any part of this website, please contact the
        practice using the details on the Contact page and describe what happened.
        We will do our best to help and to fix the issue.
      </p>

      <h2>Alternative ways to reach us</h2>
      <p>
        If a form or page is not working for you, you can always reach the
        practice by phone or WhatsApp. You never need to use this website to
        access care.
      </p>
    </LegalPage>
  );
}
