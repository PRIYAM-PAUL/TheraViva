import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Medical disclaimer",
  description:
    "Important information about the limits of the information published on this website.",
  path: "/legal/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Medical disclaimer"
      path="/legal/disclaimer"
      updated="October 2026"
    >
      <p>
        Please read this page carefully. It explains the limits of the
        information on this website.
      </p>

      <h2>General information only</h2>
      <p>
        All content on this website — including condition pages, blog articles,
        and FAQs — is provided for general information and education. It is not
        medical advice, not a diagnosis, and not a treatment plan.
      </p>

      <h2>Individual assessment is essential</h2>
      <p>
        Occupational therapy, speech and language therapy, and audiology decisions
        depend on an individual assessment. Two people with the same diagnosis can
        need very different support. Please do not act on general information from
        this website in place of professional assessment.
      </p>

      <h2>No therapist–client relationship</h2>
      <p>
        Reading this website or sending a request does not create a
        therapist–client relationship.
      </p>

      <h2>Not for emergencies</h2>
      <p>
        This practice does not provide emergency or crisis care, and this website
        is not monitored continuously. If you or someone else is in immediate
        danger, contact local emergency services or a crisis helpline right away.
      </p>

      <h2>External links</h2>
      <p>
        Where this site links to external resources, we do not control and are not
        responsible for their content.
      </p>

      <h2>Accuracy and changes</h2>
      <p>
        Information may become out of date. We aim to keep it accurate but make no
        guarantees, and we may change content at any time.
      </p>
    </LegalPage>
  );
}
