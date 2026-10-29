"use client";

import { KeyRound, Loader2, LogIn, ShieldCheck, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Field,
  Input,
} from "@/components/ui";
import { apiBaseUrl, isApiConfigured } from "@/config/api";
import { useAuth } from "@/features/dashboard/auth-context";
import { homePathForRole } from "@/features/dashboard/roles";
import { ApiError, api } from "@/lib/api";

type Mode = "patient" | "staff";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInPatient, signInStaff } = useAuth();
  const [mode, setMode] = React.useState<Mode>("patient");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Patient OTP flow state.
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [codeSent, setCodeSent] = React.useState(false);
  const [devCode, setDevCode] = React.useState<string | null>(null);

  // Staff flow state.
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    if (user) router.replace(homePathForRole(user.role));
  }, [user, router]);

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await api.auth.requestOtp(phone);
      setCodeSent(true);
      setDevCode(result.devCode);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send a code.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const me = await signInPatient(phone, code, name || undefined);
      router.replace(homePathForRole(me.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not verify the code.");
    } finally {
      setBusy(false);
    }
  };

  const handleStaffLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const me = await signInStaff(email, password);
      router.replace(homePathForRole(me.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Patients sign in with a phone code. Practice staff sign in with their email.
        </p>      </div>

      {!isApiConfigured ? (
        <Alert variant="warning">
          <AlertTitle>Backend not configured</AlertTitle>
          <AlertDescription>
            Set <code>NEXT_PUBLIC_API_URL</code> to your backend origin. Currently
            pointing at {apiBaseUrl}.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => {
            setMode("patient");
            setError(null);
          }}
          aria-pressed={mode === "patient"}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "patient" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          <Smartphone className="size-4" aria-hidden="true" />
          Patient
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("staff");
            setError(null);
          }}
          aria-pressed={mode === "staff"}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "staff" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          Practice staff
        </button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not sign in</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          {mode === "patient" ? (
            codeSent ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                <p className="text-sm text-muted-foreground">
                  We sent a code to {phone}.
                  {devCode ? (
                    <>
                      {" "}
                      Development code: <strong>{devCode}</strong>
                    </>
                  ) : null}
                </p>
                <Field id="otp-code" label="Verification code">
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    required
                  />
                </Field>
                <Field id="otp-name" label="Your name (optional)">
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Button type="submit" loading={busy} className="w-full">
                  <LogIn className="size-4" aria-hidden="true" />
                  Verify and continue
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  onClick={() => {
                    setCodeSent(false);
                    setCode("");
                  }}
                >
                  Use a different number
                </button>
              </form>
            ) : (
              <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
                <Field id="otp-phone" label="Mobile number">
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </Field>
                <Button type="submit" loading={busy} className="w-full">
                  <KeyRound className="size-4" aria-hidden="true" />
                  Send code
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleStaffLogin} className="space-y-4" noValidate>
              <Field id="staff-email" label="Email">
                <Input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field id="staff-password" label="Password">
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Button type="submit" loading={busy} className="w-full">
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                Sign in
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
