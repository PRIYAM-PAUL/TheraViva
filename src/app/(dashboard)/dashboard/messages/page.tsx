"use client";

import { AuthGuard, ChatPanel, PageHeader } from "@/components/dashboard";

export default function PatientMessagesPage() {
  return (
    <AuthGuard requireRoles={["patient"]}>
      <div className="space-y-8">
        <PageHeader
          title="Messages"
          description="Chat with the clinic about appointments, prescriptions or anything else."
        />
        <ChatPanel />
      </div>
    </AuthGuard>
  );
}
