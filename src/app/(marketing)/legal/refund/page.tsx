import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cancellations & refunds",
  description: "Cancellation and refund policy for TheraViva appointments.",
  path: "/legal/refund",
});

export default function RefundPage() {
  return (
    <LegalPage
      title="Cancellations & refunds"
      path="/legal/refund"
      updated="October 2026"
    >
      <p>
        Therapy sessions are time reserved specifically for you. Please read this
        policy before booking. The final policy will be confirmed by the practice
        at the time of booking.
      </p>

      <h2>Rescheduling</h2>
      <p>
        Sessions can usually be rescheduled at no cost if you give at least 24
        hours&apos; notice. Please message the practice on WhatsApp or call to
        rearrange.
      </p>

      <h2>Late cancellations and missed sessions</h2>
      <p>
        Cancellations with less than 24 hours&apos; notice, or missed sessions
        without notice, may be charged in full, as the time cannot be offered to
        another client. The practice will always consider genuine emergencies.
      </p>

      <h2>Refunds</h2>
      <p>
        Where a prepaid session is cancelled within the notice period, the amount
        is either carried forward to a future session or refunded. Refunds are
        processed by the practice to the original payment method.
      </p>

      <h2>Session packages</h2>
      <p>
        Unused sessions in a package remain valid for the agreed period. Any
        request to refund unused sessions is considered case by case.
      </p>

      <h2>Practice cancellations</h2>
      <p>
        If the practice has to cancel a session, you will be offered an
        alternative time or a full refund of that session.
      </p>

      <h2>Payments</h2>
      <p>
        This website does not process payments. Payment arrangements are made
        directly with the practice, and any refund is handled by the practice.
      </p>
    </LegalPage>
  );
}
