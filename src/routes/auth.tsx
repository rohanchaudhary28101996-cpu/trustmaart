import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordInput } from "@/components/PasswordInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Phone, ArrowLeft } from "lucide-react";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in to TrustMaart" },
      { name: "description", content: "Sign in or create your TrustMaart account to buy, sell and chat." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<"email" | "phone">("email");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Phone fields
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const goNext = () => navigate({ to: redirect && redirect.startsWith("/") ? redirect : "/" });

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
  };

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    goNext();
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
    goNext();
  }

  async function onSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return toast.error("Enter your phone number");
    setLoading(true);
    const formatted = formatPhone(phone);
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    setLoading(false);
    if (error) return toast.error(error.message);
    setOtpSent(true);
    toast.success(`OTP sent to ${formatted}`);
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    const formatted = formatPhone(phone);
    const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: "sms" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome to TrustMaart!");
    goNext();
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirect && redirect.startsWith("/") ? redirect : "/"}`,
        },
      });
      if (error) {
        toast.error(error.message ?? "Google sign-in failed");
        setLoading(false);
      }
    } catch (e) {
      toast.error((e as Error).message ?? "Google sign-in failed");
      setLoading(false);
    }
  }

  async function onForgot() {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent");
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="TrustMaart" className="h-10 w-auto object-contain" />
        </Link>
        <div className="rounded-3xl border bg-card p-6 shadow-elevated">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "signin" | "signup"); setMethod("email"); setOtpSent(false); setOtp(""); }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            {/* Google */}
            <Button type="button" variant="outline" className="mt-5 w-full" onClick={onGoogle} disabled={loading}>
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            {/* Method toggle */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setMethod("email"); setOtpSent(false); setOtp(""); }}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${method === "email" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                <Mail className="h-4 w-4" /> Email
              </button>
              <button
                type="button"
                onClick={() => { setMethod("phone"); setOtpSent(false); setOtp(""); }}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${method === "phone" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                <Phone className="h-4 w-4" /> Phone OTP
              </button>
            </div>

            {/* SIGN IN */}
            <TabsContent value="signin">
              {method === "email" ? (
                <form onSubmit={onSignIn} className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button type="button" onClick={onForgot} className="text-xs text-primary hover:underline">Forgot?</button>
                    </div>
                    <PasswordInput id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="mr-2 h-4 w-4" /> Sign in</>}
                  </Button>
                </form>
              ) : (
                <PhoneOtpForm
                  phone={phone} setPhone={setPhone}
                  otp={otp} setOtp={setOtp}
                  otpSent={otpSent} setOtpSent={setOtpSent}
                  loading={loading}
                  onSendOtp={onSendOtp}
                  onVerifyOtp={onVerifyOtp}
                />
              )}
            </TabsContent>

            {/* SIGN UP */}
            <TabsContent value="signup">
              {method === "email" ? (
                <form onSubmit={onSignUp} className="space-y-3">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email-s">Email</Label>
                    <Input id="email-s" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="password-s">Password</Label>
                    <PasswordInput id="password-s" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">No separate signup needed — enter your phone number and we'll create your account automatically.</p>
                  <PhoneOtpForm
                    phone={phone} setPhone={setPhone}
                    otp={otp} setOtp={setOtp}
                    otpSent={otpSent} setOtpSent={setOtpSent}
                    loading={loading}
                    onSendOtp={onSendOtp}
                    onVerifyOtp={onVerifyOtp}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to TrustMaart's Terms & Privacy.
        </p>
      </div>
    </div>
  );
}

function PhoneOtpForm({ phone, setPhone, otp, setOtp, otpSent, setOtpSent, loading, onSendOtp, onVerifyOtp }: {
  phone: string; setPhone: (v: string) => void;
  otp: string; setOtp: (v: string) => void;
  otpSent: boolean; setOtpSent: (v: boolean) => void;
  loading: boolean;
  onSendOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
}) {
  if (!otpSent) {
    return (
      <form onSubmit={onSendOtp} className="space-y-3">
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <div className="flex items-center gap-2">
            <span className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
            <Input
              id="phone"
              type="tel"
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading || phone.length !== 10}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Phone className="mr-2 h-4 w-4" /> Send OTP</>}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onVerifyOtp} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }} className="hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </button>
        OTP sent to +91{phone}
      </div>
      <div>
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          placeholder="6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          required
          autoFocus
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP & Sign in"}
      </Button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
