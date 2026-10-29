"use client";

import { Receipt, RotateCcw } from "lucide-react";
import * as React from "react";

import {
  AuthGuard,
  DataTable,
  EmptyState,
  PageHeader,
  PayOnlineButton,
  StatusBadge,
  type Column,
} from "@/components/dashboard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Spinner,
} from "@/components/ui";
import { useInvoices, usePayments } from "@/features/dashboard/queries";
import type { Invoice, Payment } from "@/features/dashboard/types";
import { ApiError, api } from "@/lib/api";
import { formatDateShort, formatRupees } from "@/lib/format";

function StaffPayments() {
  const invoices = useInvoices();
  const payments = usePayments();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [patientId, setPatientId] = React.useState("");

  const refresh = () => {
    invoices.reload();
    payments.reload();
  };

  const createInvoice = async (event: React.FormEvent) => {
    event.preventDefault();
    const totalInr = Number.parseInt(amount, 10);
    if (!description.trim() || !Number.isFinite(totalInr) || totalInr <= 0) {
      setError("Enter a description and a positive amount.");
      return;
    }
    setBusy("create");
    setError(null);
    setNotice(null);
    try {
      await api.billing.createInvoice({
        description: description.trim(),
        totalInr,
        ...(patientId.trim() ? { patientUserId: patientId.trim() } : {}),
      });
      setDescription("");
      setAmount("");
      setPatientId("");
      setNotice("Invoice created.");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the invoice.");
    } finally {
      setBusy(null);
    }
  };

  const recordPayment = async (invoice: Invoice) => {
    setBusy(invoice.id);
    setError(null);
    try {
      await api.billing.recordPayment({
        invoiceId: invoice.id,
        amountInr: invoice.totalInr,
        method: "upi",
      });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not record the payment.");
    } finally {
      setBusy(null);
    }
  };

  const refund = async (payment: Payment) => {
    setBusy(payment.id);
    setError(null);
    try {
      await api.billing.refund({
        paymentId: payment.id,
        amountInr: payment.amountInr,
        reason: "Refunded by staff",
      });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not refund the payment.");
    } finally {
      setBusy(null);
    }
  };

  const invoiceColumns: Column<Invoice>[] = [
    { key: "number", header: "Invoice" },
    { key: "description", header: "For" },
    { key: "totalInr", header: "Total", align: "right", render: (row) => formatRupees(row.totalInr) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex flex-wrap items-end justify-end gap-2">
          {row.status !== "paid" && row.status !== "void" ? (
            <>
              <PayOnlineButton
                invoiceId={row.id}
                amountInr={row.totalInr}
                onPaid={() => {
                  setNotice("Payment captured.");
                  refresh();
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={busy === row.id}
                onClick={() => void recordPayment(row)}
              >
                Record offline
              </Button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const paymentColumns: Column<Payment>[] = [
    { key: "createdAt", header: "Date", render: (row) => formatDateShort(new Date(row.createdAt)) },
    { key: "provider", header: "Provider" },
    { key: "method", header: "Method", render: (row) => row.method ?? "—" },
    { key: "amountInr", header: "Amount", align: "right", render: (row) => formatRupees(row.amountInr) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) =>
        row.status === "captured" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            loading={busy === row.id}
            onClick={() => void refund(row)}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Refund
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Create invoices, take payments (offline or online) and issue refunds."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {notice ? (
        <Alert variant="info">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-5 text-primary" aria-hidden="true" />
            New invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createInvoice} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <Field id="invoice-description" label="Description">
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Occupational therapy session"
                required
              />
            </Field>
            <Field id="invoice-amount" label="Amount (₹, GST inclusive)">
              <Input
                type="number"
                min={1}
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </Field>
            <Field id="invoice-patient" label="Patient user ID (optional)">
              <Input
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                placeholder="Link to a patient account"
              />
            </Field>
            <Button type="submit" loading={busy === "create"}>
              Create invoice
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.loading ? (
            <div className="flex justify-center py-12">
              <Spinner label="Loading invoices" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={invoiceColumns}
              rows={invoices.data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No invoices yet."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.loading ? (
            <div className="flex justify-center py-12">
              <Spinner label="Loading payments" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={paymentColumns}
              rows={payments.data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No payments recorded yet."
            />
          )}
          {!payments.loading && (payments.data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={Receipt}
                title="No payments yet"
                description="Record an offline payment or take one online from an invoice."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffPaymentsPage() {
  return (
    <AuthGuard requireRoles={["reception", "admin"]}>
      <StaffPayments />
    </AuthGuard>
  );
}
