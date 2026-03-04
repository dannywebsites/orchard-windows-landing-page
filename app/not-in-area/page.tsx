"use client";

import { DynamicIcon } from "@/components/DynamicIcon";
import data from "@/TEMPLATE.json";

function getInstagramUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  const cleanHandle = handle.replace(/^@/, "");
  return `https://www.instagram.com/${cleanHandle}`;
}

export default function NotInAreaPage() {
  const instagramUrl = getInstagramUrl(data.metadata.instagramHandle);

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
        <div className="max-w-xl text-center py-16">
          <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto mb-6">
            <DynamicIcon name="X" className="w-14 h-14 text-red-500" />
          </div>
          <h1 className="text-3xl font-black mb-4">
            {data.pages.notInArea.heading}
          </h1>
          <p className="text-slate-500 text-lg mb-8">
            {data.pages.notInArea.message}
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <DynamicIcon name="Instagram" className="w-5 h-5" />
            {data.pages.notInArea.ctaLabel}
          </a>
          <div className="mt-6">
            <a
              href="/"
              className="text-primary underline font-semibold text-sm"
            >
              Back to home
            </a>
          </div>
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
