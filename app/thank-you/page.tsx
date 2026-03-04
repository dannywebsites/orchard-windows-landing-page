"use client";

import { useState, type FormEvent } from "react";
import { DynamicIcon } from "@/components/DynamicIcon";
import data from "@/TEMPLATE.json";

export default function ThankYouPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    postCode: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function validate(values: typeof form) {
    const newErrors: Record<string, string> = {};

    if (!values.name.trim()) newErrors.name = "First name is required";
    if (!values.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\+\-()]{7,15}$/.test(values.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!values.postCode.trim()) {
      newErrors.postCode = "Post code is required";
    }
    if (!consent) {
      newErrors.consent = "You must agree before submitting";
    }

    return newErrors;
  }

  function handleChange(field: keyof typeof form, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (submitted) {
      setErrors(validate(next));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("submitting");

    try {
      const webhookUrl = data.pages.thankYou.webhookUrl;
      if (!webhookUrl || webhookUrl === "WEBHOOK_URL_HERE") {
        console.warn("Webhook URL not configured in TEMPLATE.json");
        setStatus("success");
        return;
      }

      const quizAnswers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          postCode: form.postCode.trim(),
          submittedAt: new Date().toISOString(),
          quizAnswers,
        }),
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const thankYou = data.pages.thankYou;
  const primaryColor = data.theme.colors.primary;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="py-1 md:py-1.5 flex justify-center bg-white shrink-0">
        <div className="flex items-center">
          {data.header.logoImage ? (
            <img
              src={data.header.logoImage}
              alt={data.metadata.name}
              className="h-[93px] md:h-[116px] w-auto object-contain"
            />
          ) : (
            <DynamicIcon
              name={data.header.logoIcon}
              className="w-16 h-16"
              style={{ color: "#111827" }}
            />
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full py-12">
          {status === "success" ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
                <DynamicIcon name="Check" className="w-14 h-14 text-green-500" />
              </div>
              <h1 className="text-3xl font-black mb-4">{thankYou.successHeading}</h1>
              <p className="text-slate-500 text-lg mb-8">{thankYou.successMessage}</p>
              <a href="/" className="text-primary underline font-semibold">
                Back to home
              </a>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto mb-4"
                  style={{ borderColor: primaryColor }}
                >
                  <DynamicIcon name="ClipboardList" className="w-9 h-9" style={{ color: primaryColor }} />
                </div>
                <h1 className="text-3xl font-black mb-2">{thankYou.heading}</h1>
                <p className="text-slate-500 text-base">{thankYou.message}</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="e.g. John"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:ring-2 ${
                      errors.name ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-300 focus:ring-orange-200 focus:border-orange-400"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. 07700 900123"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:ring-2 ${
                      errors.phone ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-300 focus:ring-orange-200 focus:border-orange-400"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:ring-2 ${
                      errors.email ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-300 focus:ring-orange-200 focus:border-orange-400"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Post Code */}
                <div>
                  <label htmlFor="postCode" className="block text-sm font-semibold text-slate-700 mb-1">
                    Post Code
                  </label>
                  <input
                    id="postCode"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="e.g. PR1 1AA"
                    value={form.postCode}
                    onChange={(e) => handleChange("postCode", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:ring-2 ${
                      errors.postCode ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-300 focus:ring-orange-200 focus:border-orange-400"
                    }`}
                  />
                  {errors.postCode && <p className="text-red-500 text-sm mt-1">{errors.postCode}</p>}
                </div>

                {/* Consent checkbox */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (submitted) {
                          const next = { ...form };
                          const newErrors = validate(next);
                          if (e.target.checked) delete newErrors.consent;
                          setErrors(newErrors);
                        }
                      }}
                      className="mt-1 w-4 h-4 shrink-0 accent-primary"
                    />
                    <span className="text-sm text-slate-600 leading-snug">
                      I agree to be contacted by phone or SMS regarding my enquiry and accept the{" "}
                      <a href="/privacy-policy.html" target="_blank" className="text-primary underline">privacy policy</a>.
                    </span>
                  </label>
                  {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
                </div>

                {/* Error banner */}
                {status === "error" && (
                  <p className="text-red-600 text-sm text-center bg-red-50 rounded-xl py-3 px-4">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full text-white font-bold text-lg py-4 rounded-xl transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: primaryColor }}
                >
                  {status === "submitting" ? "Submitting…" : thankYou.submitLabel}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center shrink-0">
        <div className="flex justify-center items-center gap-2">
          {data.footer.links.map((l, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300">&middot;</span>}
              <a
                href={l.href}
                className="text-sm text-slate-400 hover:text-primary transition-colors underline"
              >
                {l.label}
              </a>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-300 mt-2">{data.footer.copyright}</p>
      </footer>
    </div>
  );
}
