import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms governing use of the TheraViva website.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/legal/terms" updated="October 2026">
      <p>
        By using this website you agree to these terms. If you do not agree,
        please do not use the site.
      </p>

      <h2>Information, not medical advice</h2>
      <p>
        The content on this website is general information for education. It is
        not a diagnosis, not medical advice, and not a substitute for assessment
        by a qualified professional. Always seek individual assessment for your
        own or your child&apos;s circumstances.
      </p>

      <h2>No doctor–patient relationship</h2>
      <p>
        Using this website, sending a request, or exchanging messages does not
        create a therapist–client relationship. That relationship begins only
        after an appointment has been confirmed and a session has taken place.
      </p>

      <h2>Requests are not bookings</h2>
      <p>
        Submitting the appointment request form sends an enquiry. It does not
        reserve a slot, confirm an appointment, or take a payment. Appointments
        are confirmed by the practice directly.
      </p>

      <h2>Emergencies</h2>
      <p>
        This practice does not provide emergency care and this website is not
        monitored continuously. If you or someone else is in immediate danger,
        contact local emergency services or a crisis helpline immediately.
      </p>

      <h2>Accuracy</h2>
      <p>
        We try to keep information accurate and up to date, but we make no
        warranty that everything on the site is complete or current. Prices,
        services and availability may change.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Text, images, video and other content on this site belong to the practice
        or are used with permission, and may not be reproduced without consent.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and any dispute is subject
        to the jurisdiction of the courts of Delhi.
      </p>
    </LegalPage>
  );
}
