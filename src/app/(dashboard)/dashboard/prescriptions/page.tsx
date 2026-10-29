"use client";

import { FileText, Upload } from "lucide-react";
import * as React from "react";

import {
  AuthGuard,
  DataTable,
  EmptyState,
  PageHeader,
  type Column,
} from "@/components/dashboard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Field,
  Select,
  Spinner,
} from "@/components/ui";
import { useDocuments } from "@/features/dashboard/queries";
import type { DocumentItem } from "@/features/dashboard/types";
import { ApiError, api } from "@/lib/api";

const KIND_OPTIONS = [
  { value: "prescription", label: "Prescription" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PatientPrescriptions() {
  const { data, loading, error, reload } = useDocuments();
  const [kind, setKind] = React.useState("prescription");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [opening, setOpening] = React.useState<string | null>(null);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    setNotice(null);
    try {
      await api.documents.upload(file, { kind });
      setFile(null);
      setNotice("Uploaded. The clinic can now see this document.");
      reload();
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Could not upload the file.");
    } finally {
      setBusy(false);
    }
  };

  const open = async (id: string) => {
    setOpening(id);
    try {
      const url = await api.documents.objectUrl(id);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Could not open the file.");
    } finally {
      setOpening(null);
    }
  };

  const columns: Column<DocumentItem>[] = [
    { key: "filename", header: "File" },
    { key: "kind", header: "Type" },
    {
      key: "sizeBytes",
      header: "Size",
      render: (row) => formatSize(row.sizeBytes),
    },
    {
      key: "createdAt",
      header: "Uploaded",
      render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={opening === row.id}
          onClick={() => void open(row.id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Prescriptions & reports"
        description="Upload prescriptions or reports so the clinic can review them before your session."
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={upload} className="grid gap-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
            <Field id="prescription-file" label="Choose a file (PDF or image, max 10 MB)">
              <input
                id="prescription-file"
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              />
            </Field>
            <Field id="prescription-kind" label="Document type">
              <Select options={KIND_OPTIONS} value={kind} onValueChange={setKind} />
            </Field>
            <Button type="submit" loading={busy} disabled={!file}>
              <Upload className="size-4" aria-hidden="true" />
              Upload
            </Button>
          </form>

          {uploadError ? (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Upload failed</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          ) : null}
          {notice ? (
            <Alert variant="info" className="mt-4">
              <AlertDescription>{notice}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load your documents</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading documents" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No documents uploaded yet."
            />
          )}
          {!loading && (data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={FileText}
                title="No documents yet"
                description="Upload a prescription or report above and it will appear here."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PatientPrescriptionsPage() {
  return (
    <AuthGuard requireRoles={["patient"]}>
      <PatientPrescriptions />
    </AuthGuard>
  );
}
