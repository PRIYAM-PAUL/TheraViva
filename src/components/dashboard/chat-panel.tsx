"use client";

import { MessageSquarePlus, Send } from "lucide-react";
import * as React from "react";

import { Button, Card, CardContent, Field, Input, Spinner, Textarea } from "@/components/ui";
import { useChatMessages, useChatThreads } from "@/features/dashboard/queries";
import { ApiError, api } from "@/lib/api";
import { cn } from "@/lib/utils";

const POLL_MS = 5000;

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface ChatPanelProps {
  /** Staff see every thread and can reply to any; patients see only their own. */
  asStaff?: boolean;
}

/**
 * Live chat between a patient and the clinic.
 *
 * Messages are polled (`?after=` would be the optimisation); a new thread is
 * started by the patient. The clinic inbox lists every thread.
 */
export function ChatPanel({ asStaff = false }: ChatPanelProps) {
  const threads = useChatThreads();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  const activeThreadId = activeId ?? threads.data?.items[0]?.id ?? null;
  const messages = useChatMessages(activeThreadId);
  const reloadMessages = messages.reload;
  const reloadThreads = threads.reload;

  // Poll for new messages while a thread is open.
  React.useEffect(() => {
    if (!activeThreadId) return;
    const timer = window.setInterval(() => reloadMessages(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [activeThreadId, reloadMessages]);

  // Mark the open thread read whenever it changes.
  React.useEffect(() => {
    if (!activeThreadId) return;
    void api.chat.markRead(activeThreadId).then(() => reloadThreads()).catch(() => undefined);
  }, [activeThreadId, reloadThreads]);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeThreadId || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.chat.post(activeThreadId, draft.trim());
      setDraft("");
      messages.reload();
      threads.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send the message.");
    } finally {
      setBusy(false);
    }
  };

  const createThread = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const thread = await api.chat.createThread(subject.trim() || "General enquiry");
      setSubject("");
      setCreating(false);
      setActiveId(thread.id);
      threads.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the conversation.");
    } finally {
      setBusy(false);
    }
  };

  const list = threads.data?.items ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <Card className="h-fit">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">
              {asStaff ? "Conversations" : "Your conversations"}
            </h2>
            {!asStaff ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setCreating((value) => !value)}
              >
                <MessageSquarePlus className="size-4" aria-hidden="true" />
                New
              </Button>
            ) : null}
          </div>

          {creating ? (
            <form onSubmit={createThread} className="space-y-2 rounded-lg border border-border p-3">
              <Field id="thread-subject" label="What is this about?">
                <Input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Question about my child's sessions"
                />
              </Field>
              <Button type="submit" size="sm" loading={busy} className="w-full">
                Start conversation
              </Button>
            </form>
          ) : null}

          {threads.loading ? (
            <div className="flex justify-center py-6">
              <Spinner label="Loading conversations" className="size-5" />
            </div>
          ) : null}

          {!threads.loading && list.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {asStaff ? "No conversations yet." : "Start a conversation with the clinic."}
            </p>
          ) : null}

          <ul className="space-y-1">
            {list.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  aria-current={thread.id === activeThreadId ? "true" : undefined}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left transition-colors",
                    thread.id === activeThreadId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{thread.subject}</span>
                    {thread.unreadCount > 0 ? (
                      <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </span>
                  {thread.lastMessageAt ? (
                    <span className="text-xs text-muted-foreground">
                      {formatWhen(thread.lastMessageAt)}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="flex min-h-[28rem] flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 pt-6">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!activeThreadId ? (
            <p className="m-auto text-center text-sm text-muted-foreground">
              Select or start a conversation to see messages.
            </p>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {messages.loading && !messages.data ? (
                  <div className="flex justify-center py-6">
                    <Spinner label="Loading messages" className="size-5" />
                  </div>
                ) : null}
                {(messages.data ?? []).map((message) => {
                  const mine = asStaff ? message.senderRole !== "patient" : message.senderRole === "patient";
                  return (
                    <div
                      key={message.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                          mine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.body}</p>
                        <p
                          className={cn(
                            "mt-1 text-[10px]",
                            mine ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {message.senderRole === "patient" ? "Patient" : "Clinic"} ·{" "}
                          {formatWhen(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {messages.data && messages.data.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    No messages yet. Say hello.
                  </p>
                ) : null}
              </div>

              <form onSubmit={send} className="flex items-end gap-2 border-t border-border pt-4">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message…"
                  rows={2}
                  className="flex-1 resize-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void send(event);
                    }
                  }}
                />
                <Button type="submit" loading={busy} disabled={!draft.trim()}>
                  <Send className="size-4" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Send</span>
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
