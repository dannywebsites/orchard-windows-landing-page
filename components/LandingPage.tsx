"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Star } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";
import data from "../TEMPLATE.json";

const QuizOverlay = dynamic(() => import("./QuizOverlay"), { ssr: false });

export default function LandingPage() {
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const init = () => {
      const pixelId = data.metadata.metaPixelId;
      if (!pixelId || pixelId === "XXXXXXXXXXXXXXXXX") return;
      const w = window as any;
      if (!w.fbq) {
        const n = (w.fbq = function () {
          // eslint-disable-next-line prefer-rest-params
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        }) as any;
        w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        const s = document.createElement("script");
        s.async = true;
        s.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(s);
      }
      w.fbq("init", pixelId);
      w.fbq("track", "PageView");
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(init);
    } else {
      setTimeout(init, 1);
    }
  }, []);

  return (
    <>
      <main className="min-h-screen flex flex-col bg-surface">
        {/* ── Header ── */}
        <header className="py-1 md:py-1.5 flex justify-center bg-white">
          <div className="flex items-center">
            {data.header.logoImage ? (
              <img
                src={data.header.logoImage}
                alt={data.metadata.name}
                width={549}
                height={209}
                className="h-[65px] md:h-[81px] w-auto object-contain"
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

        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-4 mt-1 md:mt-2 pb-2 text-center flex flex-col">
          <h1
            className="text-base md:text-3xl lg:text-4xl font-black mb-1 md:mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: data.hero.headline }}
          />

          <p className="text-sm md:text-lg font-black md:font-semibold text-primary mb-0 md:mb-3">
            Windows, Doors and Conservatories
          </p>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden shadow-xl mb-0 md:mb-4">
            <img
              src={data.hero.mainImage}
              alt={data.metadata.name}
              fetchPriority="high"
              width={1200}
              height={670}
              className="block w-full h-auto md:h-[281px] lg:h-[338px] md:object-cover"
            />
          </div>

          {/* Avatars + Star rating */}
          <div className="flex items-center justify-center gap-2 mt-1 md:mt-8 order-2 md:order-5 mb-8 md:mb-0">
            <div className="flex -space-x-2">
              {[
                "https://i.pravatar.cc/40?img=1",
                "https://i.pravatar.cc/40?img=2",
                "https://i.pravatar.cc/40?img=3",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Customer"
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-black font-semibold">
              {data.hero.subheadline}
            </span>
          </div>

          {/* CTA — Large circle icons */}
          <div className="mb-4 order-1 md:order-4">
            <h2
              className="text-sm md:text-2xl font-black mb-0.5 md:mb-1"
              dangerouslySetInnerHTML={{ __html: data.hero.cta.headline }}
            />
            <p className="text-slate-400 text-sm mb-1 md:mb-4">
              {data.hero.cta.subtext}
            </p>
            <div className="flex justify-center gap-5">
              {/* Yes */}
              <button
                onClick={() => setQuizOpen(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className="w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center mb-1.5 md:mb-2 group-hover:bg-green-50 transition-colors"
                  style={{ border: "4px solid #16a34a" }}
                >
                  <DynamicIcon
                    name="Check"
                    className="w-10 h-10 md:w-18 md:h-18"
                    style={{ color: "#16a34a" }}
                  />
                </div>
                <span
                  className="font-bold text-sm md:text-base px-5 py-1.5 md:px-8 md:py-2.5 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  {data.hero.cta.yesLabel}
                </span>
              </button>
              {/* No — also opens quiz */}
              <button
                onClick={() => setQuizOpen(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className="w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center mb-1.5 md:mb-2 group-hover:bg-red-50 transition-colors"
                  style={{ border: "4px solid #dc2626" }}
                >
                  <DynamicIcon
                    name="X"
                    className="w-10 h-10 md:w-18 md:h-18"
                    style={{ color: "#dc2626" }}
                  />
                </div>
                <span
                  className="font-bold text-sm md:text-base px-5 py-1.5 md:px-8 md:py-2.5 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {data.hero.cta.noLabel}
                </span>
              </button>
            </div>
          </div>

          {/* ── Mobile CTA (below stars, above reviews) ── */}
          <div className="md:hidden text-center mb-4 order-3">
            <button
              onClick={() => setQuizOpen(true)}
              className="inline-block text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors cursor-pointer w-full"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              {data.whyChooseUs.cta}
            </button>
          </div>

          {/* ── Inline Reviews (below the fold) ── */}
          <div className="space-y-3 mb-8 order-4 md:order-7">
            {data.socialProof.reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-accent text-accent"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Secondary image */}
          <div className="hidden md:block rounded-2xl overflow-hidden shadow-xl mb-8 md:order-6">
            <img
              src={data.hero.secondaryImage}
              alt={data.metadata.name}
              loading="lazy"
              decoding="async"
              width={800}
              height={838}
              className="w-full object-contain"
            />
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-10 md:py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-6">
              {data.whyChooseUs.introHeading}
            </h2>
            <div className="text-center text-slate-600 leading-relaxed mb-10 space-y-4">
              {data.whyChooseUs.intro.map((paragraph, i) => (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-center mb-8">
              {data.whyChooseUs.headline}
            </h2>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {data.whyChooseUs.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <DynamicIcon
                    name={item.icon}
                    className="text-primary w-5 h-5 mt-0.5 shrink-0"
                  />
                  <p
                    className="text-slate-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mb-10">
              <button
                onClick={() => setQuizOpen(true)}
                className="inline-block text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors cursor-pointer"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                {data.whyChooseUs.cta}
              </button>
            </div>

            {/* Tertiary image */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={data.hero.tertiaryImage}
                alt={data.metadata.name}
                loading="lazy"
                decoding="async"
                width={1170}
                height={1555}
                className="w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* ── Secondary image (mobile) ── */}
        <div className="md:hidden px-4 mb-8">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={data.hero.secondaryImage}
              alt={data.metadata.name}
              loading="lazy"
              decoding="async"
              width={800}
              height={838}
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-auto py-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            {data.footer.links.map((l, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-300">·</span>}
                <a
                  href={l.href}
                  className="text-sm text-slate-400 hover:text-primary transition-colors underline"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-300">{data.footer.copyright}</p>
        </footer>
      </main>

      {/* ── Quiz Overlay ── */}
      {quizOpen && <QuizOverlay onClose={() => setQuizOpen(false)} />}
    </>
  );
}
