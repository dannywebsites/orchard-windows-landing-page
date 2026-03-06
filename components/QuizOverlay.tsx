"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicIcon } from "./DynamicIcon";
import data from "../TEMPLATE.json";

export default function QuizOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const steps = data.quiz.steps;
  const current = steps[step];

  const saveAnswer = (label: string) => {
    const answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
    answers[current.question] = label;
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
  };

  const next = (label: string) => {
    saveAnswer(label);
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  // Lock body scroll when quiz is open; clear previous answers on mount
  useEffect(() => {
    sessionStorage.removeItem("quizAnswers");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Header */}
      <header className="py-1 md:py-1.5 flex justify-center bg-white shrink-0">
        <div className="flex items-center">
          {data.header.logoImage ? (
            <img
              src={data.header.logoImage}
              alt={data.metadata.name}
              width={549}
              height={209}
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

      {/* Progress */}
      <div className="text-center py-4 shrink-0">
        <span className="text-sm text-slate-500">
          Question {step + 1} of{" "}
          <span className="text-primary font-bold">{steps.length}</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto px-6 py-6 md:py-10 w-full"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-center leading-tight">
              {current.question}
            </h2>
            {"subtext" in current && current.subtext && (
              <p className="text-primary text-center mb-8 text-sm underline">
                {current.subtext}
              </p>
            )}
            {!("subtext" in current) && <div className="mb-8" />}

            {/* ── Image Grid ── */}
            {current.type === "image-grid" && "options" in current && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-items-center">
                {current.options?.map((opt, i) => {
                  const isLastOdd =
                    i === current.options!.length - 1 &&
                    current.options!.length % 2 !== 0;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => next(opt.label)}
                      className={`rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:shadow-lg group cursor-pointer w-full ${
                        isLastOdd ? "col-span-2 md:col-span-4 max-w-[180px]" : ""
                      }`}
                    >
                      {"image" in opt && (
                        <img
                          src={opt.image as string}
                          alt={opt.label}
                          width={624}
                          height={624}
                          className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="bg-black text-white p-2.5 text-xs font-bold uppercase tracking-wider text-center">
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── List (Dark pill buttons) ── */}
            {current.type === "list" && "options" in current && (
              <div className="max-w-lg mx-auto space-y-3">
                {current.options?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => next(opt.label)}
                    className="w-full p-5 rounded-2xl text-white text-left font-semibold text-lg transition-all cursor-pointer"
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── Binary (Large circle icons) ── */}
            {current.type === "binary" && "options" in current && (
              <div className="flex justify-center gap-8">
                {current.options?.map((opt) => {
                  const isYes = opt.id === "yes";
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        saveAnswer(opt.label);
                        if (isYes) {
                          router.push("/thank-you");
                        } else {
                          router.push("/not-in-area");
                        }
                      }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-3 transition-colors"
                        style={{
                          border: `4px solid ${isYes ? "#16a34a" : "#dc2626"}`,
                        }}
                      >
                        <DynamicIcon
                          name={isYes ? "Check" : "X"}
                          className="w-16 h-16 md:w-20 md:h-20"
                          style={{ color: isYes ? "#16a34a" : "#dc2626" }}
                        />
                      </div>
                      <span
                        className="font-bold text-lg px-10 py-3 rounded-lg transition-colors text-white"
                        style={{
                          backgroundColor: isYes ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center shrink-0">
        <div className="flex justify-center items-center gap-2">
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
      </footer>
    </div>
  );
}
