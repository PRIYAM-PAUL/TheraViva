"use client";

import { AuthGuard, ChatPanel, PageHeader } from "@/components/dashboard";

export default function StaffMessagesPage() {
  return (
    <AuthGuard requireRoles={["reception", "therapist", "admin"]}>
      <div className="space-y-8">
        <PageHeader
          title="Inbox"
          description="Conversations with patients. Reply here and the patient sees it instantly."
        />
        <ChatPanel asStaff />
      </div>
    </AuthGuard>
  );
}
