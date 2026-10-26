import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How TheraViva handles information submitted through this website.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" path="/legal/privacy" updated="October 2026">
      <p>
        This policy explains how information is handled when you use the TheraViva
        website. We keep this deliberately simple: this website collects as little
        as possible.
      </p>

      <h2>What this website collects</h2>
      <ul>
        <li>
          <strong>Appointment requests.</strong> When you complete the request
          form, the details you enter are composed into a message and sent to the
          practice through <em>WhatsApp</em> or your own <em>email client</em>.
          This website does not store that information on a server.
        </li>
        <li>
          <strong>Analytics (only with consent).</strong> If you accept the
          analytics banner, we use Google Analytics to understand which pages are
          useful. No health information is included in analytics, and IP
          addresses are anonymised. If you decline, no analytics run.
        </li>
        <li>
          <strong>Consent preference.</strong> Your accept/decline choice is
          stored in your browser&apos;s local storage so we don&apos;t ask again.
        </li>
      </ul>

      <h2>What this website does not do</h2>
      <ul>
        <li>It does not take payments or store card details.</li>
        <li>It does not create patient accounts or store clinical records.</li>
        <li>It does not sell or share your information with advertisers.</li>
      </ul>

      <h2>Information you send us</h2>
      <p>
        Once your message reaches the practice (by WhatsApp or email), it is
        handled as confidential clinical correspondence. Please avoid sending
        detailed medical records through the website form — a short description is
        enough, and we can request anything else securely.
      </p>

      <h2>Children&apos;s information</h2>
      <p>
        Many of our clients are children. Where information relates to a child,
        it must be provided by a parent or legal guardian, and we rely on their
        consent to hold and use it.
      </p>

      <h2>Your rights</h2>
      <p>
        Under India&apos;s Digital Personal Data Protection Act, 2023, you can ask
        to access, correct or erase personal data the practice holds about you, and
        you can withdraw consent for us to contact you. To make a request, contact
        the practice using the details on the Contact page.
      </p>

      <h2>How long we keep information</h2>
      <p>
        Clinical records are retained for the period required by professional and
        legal obligations. Website enquiries that do not lead to an appointment
        are deleted once they are no longer needed.
      </p>

      <h2>Cookies</h2>
      <p>
        This site uses no advertising cookies. Analytics cookies are set only
        after you accept them.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy question, contact the practice using the details on the
        Contact page.
      </p>
    </LegalPage>
  );
}
