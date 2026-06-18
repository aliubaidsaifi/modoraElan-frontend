"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { auth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // email | otp | password | reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const boxes = useRef([]);

  useEffect(() => { if (timer <= 0) return; const t = setTimeout(() => setTimer((s) => s - 1), 1000); return () => clearTimeout(t); }, [timer]);

  const finishAuth = (token, user) => {
    userAuth.setSession(token, user);
    if (user.role === "admin") { auth.setSession(token, user); router.push("/admin"); }
    else router.push("/");
  };

  const sendOtp = async (purpose) => {
    setError(""); setInfo(""); setLoading(true);
    try {
      await userAuth.sendOtp(email.trim(), purpose);
      setInfo("Code sent to your email"); setTimer(30); setCode(["", "", "", "", "", ""]);
      setStep(purpose === "reset" ? "reset" : "otp");
      setTimeout(() => boxes.current[0]?.focus(), 50);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  const onCodeChange = (i, v) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) { const n = [...code]; n[i] = ""; setCode(n); return; }
    if (digits.length === 1) {
      const n = [...code]; n[i] = digits; setCode(n);
      if (i < 5) boxes.current[i + 1]?.focus();
    } else {
      const n = [...code];
      digits.split("").slice(0, 6 - i).forEach((d, k) => (n[i + k] = d));
      setCode(n);
      const last = Math.min(i + digits.length, 6) - 1;
      boxes.current[last]?.focus();
    }
  };
  const onCodeKey = (i, e) => { if (e.key === "Backspace" && !code[i] && i > 0) boxes.current[i - 1]?.focus(); };
  const onCodePaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    const n = ["", "", "", "", "", ""];
    digits.forEach((d, k) => (n[k] = d));
    setCode(n);
    boxes.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const verify = async () => { setError(""); setLoading(true); try { const { token, user } = await userAuth.verifyOtp(email.trim(), code.join("")); finishAuth(token, user); } catch (e) { setError(e.message); setLoading(false); } };
  const loginPassword = async () => { setError(""); setLoading(true); try { const { token, user } = await userAuth.login(email.trim(), password); finishAuth(token, user); } catch (e) { setError(e.message); setLoading(false); } };
  const doReset = async () => { setError(""); setLoading(true); try { const { token, user } = await userAuth.resetPassword(email.trim(), code.join(""), newPass); finishAuth(token, user); } catch (e) { setError(e.message); setLoading(false); } };

   const OtpBoxes = () => (
    <div className="flex gap-2 justify-between">
      {code.map((c, i) => (
        <input key={i} ref={(el) => (boxes.current[i] = el)} value={c} inputMode="numeric" maxLength={1}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          onChange={(e) => onCodeChange(i, e.target.value)} onKeyDown={(e) => onCodeKey(i, e)} onPaste={onCodePaste}
          className="w-12 h-14 text-center text-xl border border-ink/20 outline-none focus:border-ink" />
      ))}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-ink/10 bg-white/60 p-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          {step === "reset" ? "Reset Password" : <>Login <span className="text-ink/40">or</span> Signup</>}
        </h1>
        <p className="text-sm text-ink/50 mt-1">
          {step === "email" && "Enter your email to continue"}
          {step === "otp" && `Code sent to ${email}`}
          {step === "password" && "Login with your password"}
          {step === "reset" && `Enter the code sent to ${email}`}
        </p>

        <div className="mt-6">
          {step === "email" && (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
                className="w-full border border-ink/20 px-3 py-3 bg-white outline-none focus:border-ink" />
              <button onClick={() => sendOtp("login")} disabled={loading || !email}
                className="w-full mt-4 py-3 bg-ink text-sand tracking-widest uppercase text-sm hover:bg-clay transition-colors disabled:opacity-50">
                {loading ? "Sending..." : "Continue"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <OtpBoxes />
              <button onClick={verify} disabled={loading || code.join("").length < 6}
                className="w-full mt-5 py-3 bg-ink text-sand tracking-widest uppercase text-sm hover:bg-clay transition-colors disabled:opacity-50">
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <div className="mt-4 text-sm text-ink/60">
                {timer > 0 ? <>Resend OTP in <b>00:{String(timer).padStart(2, "0")}</b></>
                  : <button onClick={() => sendOtp("login")} className="text-clay hover:underline">Resend OTP</button>}
              </div>
              <button onClick={() => { setStep("password"); setError(""); }} className="mt-4 text-sm">
                Log in using <span className="text-clay font-medium">Password</span>
              </button>
            </>
          )}

          {step === "password" && (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                className="w-full border border-ink/20 px-3 py-3 bg-white outline-none focus:border-ink" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                className="w-full border border-ink/20 px-3 py-3 bg-white outline-none focus:border-ink mt-3" />
              <button onClick={loginPassword} disabled={loading || !password}
                className="w-full mt-4 py-3 bg-ink text-sand tracking-widest uppercase text-sm hover:bg-clay transition-colors disabled:opacity-50">
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="flex justify-between mt-4 text-sm">
                <button onClick={() => { setStep("email"); setError(""); }} className="text-clay hover:underline">Use OTP instead</button>
                <button onClick={() => sendOtp("reset")} className="text-clay hover:underline">Forgot password?</button>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <OtpBoxes />
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password (min 6)"
                className="w-full border border-ink/20 px-3 py-3 bg-white outline-none focus:border-ink mt-4" />
              <button onClick={doReset} disabled={loading || code.join("").length < 6 || newPass.length < 6}
                className="w-full mt-4 py-3 bg-ink text-sand tracking-widest uppercase text-sm hover:bg-clay transition-colors disabled:opacity-50">
                {loading ? "Resetting..." : "Reset & Login"}
              </button>
              <div className="mt-4 text-sm text-ink/60">
                {timer > 0 ? <>Resend OTP in <b>00:{String(timer).padStart(2, "0")}</b></>
                  : <button onClick={() => sendOtp("reset")} className="text-clay hover:underline">Resend OTP</button>}
              </div>
            </>
          )}

          {error && <p className="text-red-700 text-sm mt-4">{error}</p>}
          {info && !error && <p className="text-green-700 text-sm mt-4">{info}</p>}

          <p className="mt-6 text-xs text-ink/50">By continuing, you agree to our Terms &amp; Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}