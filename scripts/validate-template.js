#!/usr/bin/env node

/**
 * TEMPLATE.json Validator
 *
 * Validates the TEMPLATE.json file for a client landing page deployment.
 * Run with: npm run validate
 *
 * Exit code 0 = all checks passed (warnings are OK)
 * Exit code 1 = one or more checks failed
 */

const fs = require("fs");
const path = require("path");

// ── Results tracking ──

let passes = 0;
let fails = 0;
let warnings = 0;
const failedChecks = [];

function pass(msg) {
  passes++;
  console.log(`  \x1b[32m✓ PASS\x1b[0m  ${msg}`);
}

function fail(msg) {
  fails++;
  failedChecks.push(msg);
  console.log(`  \x1b[31m✗ FAIL\x1b[0m  ${msg}`);
}

function warn(msg) {
  warnings++;
  console.log(`  \x1b[33m⚠ WARN\x1b[0m  ${msg}`);
}

function section(title) {
  console.log(`\n── ${title} ──`);
}

// ── Helpers ──

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const UNSPLASH_RE = /^https:\/\/images\.unsplash\.com\/photo-.+/;
const LOCAL_IMAGE_RE = /^\/images\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i;
const INSTAGRAM_HANDLE_RE = /^@[a-zA-Z0-9_.]+$/;
const INSTAGRAM_URL_RE = /^https?:\/\/(www\.)?instagram\.com\//;
const FACEBOOK_URL_RE = /^https?:\/\/(www\.)?facebook\.com\//;
const PIXEL_PLACEHOLDER = "XXXXXXXXXXXXXXXXX";

function exists(obj, key) {
  return obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "";
}

function checkRequired(obj, key, label) {
  if (exists(obj, key)) {
    pass(`${label} is set: "${String(obj[key]).substring(0, 50)}"`);
    return true;
  } else {
    fail(`${label} is missing or empty`);
    return false;
  }
}

function checkHex(obj, key, label) {
  if (!exists(obj, key)) {
    fail(`${label} is missing`);
    return false;
  }
  if (HEX_RE.test(obj[key])) {
    pass(`${label} is valid hex: "${obj[key]}"`);
    return true;
  } else {
    fail(`${label} is not a valid hex color: "${obj[key]}" (expected #RGB or #RRGGBB)`);
    return false;
  }
}

function checkImageUrl(url, label) {
  if (!url || url === "") {
    fail(`${label} is missing`);
    return false;
  }
  if (UNSPLASH_RE.test(url)) {
    pass(`${label} is valid Unsplash URL`);
    return true;
  }
  if (LOCAL_IMAGE_RE.test(url)) {
    // Verify local image exists in public/
    const localPath = path.join(__dirname, "..", "public", url);
    if (fs.existsSync(localPath)) {
      pass(`${label} is valid local image: "${url}"`);
    } else {
      fail(`${label} references missing local file: "${url}"`);
    }
    return true;
  }
  fail(`${label} is not a valid image URL: "${String(url).substring(0, 60)}..." (expected Unsplash URL or /images/filename.jpg)`);
  return false;
}

function checkSpanBalance(html, label) {
  if (!html || typeof html !== "string") return;
  const opens = (html.match(/<span/g) || []).length;
  const closes = (html.match(/<\/span>/g) || []).length;
  if (opens !== closes) {
    fail(`${label} has unbalanced HTML: ${opens} <span> opens vs ${closes} </span> closes`);
  } else if (opens > 0) {
    pass(`${label} HTML is balanced (${opens} span tags)`);
  }
}

// ── Load TEMPLATE.json ──

console.log("");
console.log("╔══════════════════════════════════════════════╗");
console.log("║       TEMPLATE.json Validation Report        ║");
console.log("╚══════════════════════════════════════════════╝");

section("JSON Structure");

const templatePath = path.join(__dirname, "..", "TEMPLATE.json");

if (!fs.existsSync(templatePath)) {
  fail("TEMPLATE.json not found at project root");
  printSummary();
  process.exit(1);
}
pass("TEMPLATE.json exists");

let data;
try {
  const raw = fs.readFileSync(templatePath, "utf-8");
  data = JSON.parse(raw);
  pass("TEMPLATE.json is valid JSON");
} catch (e) {
  fail(`TEMPLATE.json is not valid JSON: ${e.message}`);
  printSummary();
  process.exit(1);
}

// ── Load valid Lucide icon names ──

let validIcons;
try {
  const lucide = require(path.join(
    __dirname,
    "..",
    "node_modules",
    "lucide-react",
    "dist",
    "cjs",
    "lucide-react.js"
  ));
  validIcons = new Set(
    Object.keys(lucide).filter(
      (k) => k[0] === k[0].toUpperCase() && typeof lucide[k] === "object" && k !== "default"
    )
  );
  pass(`Loaded ${validIcons.size} valid Lucide icon names`);
} catch (e) {
  warn(`Could not load lucide-react icons: ${e.message}. Icon validation will be skipped.`);
  validIcons = null;
}

function checkIcon(name, label) {
  if (!name || name === "") {
    fail(`${label} icon is missing`);
    return false;
  }
  if (!validIcons) {
    warn(`${label} icon "${name}" — skipped (lucide-react not loaded)`);
    return true;
  }
  if (validIcons.has(name)) {
    pass(`${label} icon "${name}" is valid`);
    return true;
  } else {
    fail(`${label} icon "${name}" is not a valid Lucide icon name`);
    return false;
  }
}

// ── Section: Metadata ──

section("Metadata");

if (!data.metadata) {
  fail("metadata object is missing");
} else {
  checkRequired(data.metadata, "name", "metadata.name");
  checkRequired(data.metadata, "description", "metadata.description");
  checkRequired(data.metadata, "currency", "metadata.currency");
  checkRequired(data.metadata, "company", "metadata.company");
  checkRequired(data.metadata, "pageTitle", "metadata.pageTitle");
  checkRequired(data.metadata, "pageDescription", "metadata.pageDescription");

  // Meta Pixel ID
  if (!exists(data.metadata, "metaPixelId")) {
    fail("metadata.metaPixelId is missing");
  } else if (data.metadata.metaPixelId === PIXEL_PLACEHOLDER) {
    warn("metadata.metaPixelId is placeholder — replace with real Pixel ID before go-live");
  } else if (/^\d+$/.test(data.metadata.metaPixelId)) {
    pass(`metadata.metaPixelId is valid: "${data.metadata.metaPixelId}"`);
  } else {
    fail(`metadata.metaPixelId has invalid format: "${data.metadata.metaPixelId}" (expected digits only)`);
  }

  // Social handle (Instagram or Facebook)
  if (!exists(data.metadata, "instagramHandle")) {
    fail("metadata.instagramHandle is missing");
  } else if (
    INSTAGRAM_HANDLE_RE.test(data.metadata.instagramHandle) ||
    INSTAGRAM_URL_RE.test(data.metadata.instagramHandle) ||
    FACEBOOK_URL_RE.test(data.metadata.instagramHandle)
  ) {
    pass(`metadata.instagramHandle is valid: "${data.metadata.instagramHandle}"`);
  } else {
    fail(
      `metadata.instagramHandle has invalid format: "${data.metadata.instagramHandle}" (expected @handle, Instagram URL, or Facebook URL)`
    );
  }
}

// ── Section: Theme ──

section("Theme");

if (!data.theme) {
  fail("theme object is missing");
} else {
  if (!data.theme.colors) {
    fail("theme.colors object is missing");
  } else {
    checkHex(data.theme.colors, "primary", "theme.colors.primary");
    checkHex(data.theme.colors, "secondary", "theme.colors.secondary");
    checkHex(data.theme.colors, "accent", "theme.colors.accent");
    checkHex(data.theme.colors, "surface", "theme.colors.surface");
    checkHex(data.theme.colors, "text", "theme.colors.text");
  }
  checkRequired(data.theme, "radius", "theme.radius");
  checkRequired(data.theme, "font", "theme.font");
}

// ── Section: Header ──

section("Header");

if (!data.header) {
  fail("header object is missing");
} else {
  checkIcon(data.header.logoIcon, "header.logoIcon");
  checkRequired(data.header, "label", "header.label");
  checkRequired(data.header, "subLabel", "header.subLabel");
}

// ── Section: Hero ──

section("Hero");

if (!data.hero) {
  fail("hero object is missing");
} else {
  if (checkRequired(data.hero, "headline", "hero.headline")) {
    checkSpanBalance(data.hero.headline, "hero.headline");
  }
  checkRequired(data.hero, "subheadline", "hero.subheadline");

  checkImageUrl(data.hero.mainImage, "hero.mainImage");
  checkImageUrl(data.hero.secondaryImage, "hero.secondaryImage");
  checkImageUrl(data.hero.tertiaryImage, "hero.tertiaryImage");

  // CTA
  if (!data.hero.cta) {
    fail("hero.cta object is missing");
  } else {
    checkRequired(data.hero.cta, "headline", "hero.cta.headline");
    checkRequired(data.hero.cta, "subtext", "hero.cta.subtext");
    checkRequired(data.hero.cta, "yesLabel", "hero.cta.yesLabel");
    checkRequired(data.hero.cta, "noLabel", "hero.cta.noLabel");
  }

  // Benefits
  if (!Array.isArray(data.hero.benefits) || data.hero.benefits.length === 0) {
    fail("hero.benefits is missing or empty (expected at least 1 item)");
  } else {
    pass(`hero.benefits has ${data.hero.benefits.length} items`);
    data.hero.benefits.forEach((b, i) => {
      checkRequired(b, "title", `hero.benefits[${i}].title`);
      checkRequired(b, "text", `hero.benefits[${i}].text`);
      checkIcon(b.icon, `hero.benefits[${i}].icon`);
    });
  }
}

// ── Section: Why Choose Us ──

section("Why Choose Us");

if (!data.whyChooseUs) {
  fail("whyChooseUs object is missing");
} else {
  checkRequired(data.whyChooseUs, "introHeading", "whyChooseUs.introHeading");
  checkRequired(data.whyChooseUs, "headline", "whyChooseUs.headline");
  checkRequired(data.whyChooseUs, "cta", "whyChooseUs.cta");

  if (!Array.isArray(data.whyChooseUs.intro) || data.whyChooseUs.intro.length === 0) {
    fail("whyChooseUs.intro is missing or empty (expected at least 1 paragraph)");
  } else {
    pass(`whyChooseUs.intro has ${data.whyChooseUs.intro.length} paragraphs`);
    data.whyChooseUs.intro.forEach((p, i) => {
      checkSpanBalance(p, `whyChooseUs.intro[${i}]`);
    });
  }

  if (!Array.isArray(data.whyChooseUs.items) || data.whyChooseUs.items.length === 0) {
    fail("whyChooseUs.items is missing or empty (expected at least 1 item)");
  } else {
    pass(`whyChooseUs.items has ${data.whyChooseUs.items.length} items`);
    data.whyChooseUs.items.forEach((item, i) => {
      checkRequired(item, "text", `whyChooseUs.items[${i}].text`);
      checkSpanBalance(item.text, `whyChooseUs.items[${i}].text`);
      checkIcon(item.icon, `whyChooseUs.items[${i}].icon`);
    });
  }
}

// ── Section: Quiz Structure ──

section("Quiz Structure");

if (!data.quiz) {
  fail("quiz object is missing");
} else if (!Array.isArray(data.quiz.steps) || data.quiz.steps.length === 0) {
  fail("quiz.steps is missing or empty");
} else {
  const steps = data.quiz.steps;

  if (steps.length < 3 || steps.length > 6) {
    warn(`Quiz has ${steps.length} steps (recommended: 3-6)`);
  } else {
    pass(`Quiz has ${steps.length} steps`);
  }

  // First step should be image-grid
  if (steps[0].type !== "image-grid") {
    warn(`First quiz step is type "${steps[0].type}" (recommended: "image-grid")`);
  } else {
    pass('First step is type "image-grid"');
  }

  // Last step must be binary
  const lastStep = steps[steps.length - 1];
  if (lastStep.type !== "binary") {
    fail(`Last quiz step is type "${lastStep.type}" — must be "binary" (routing depends on this)`);
  } else {
    pass('Last step is type "binary"');

    // Binary step must have yes/no option IDs
    if (!Array.isArray(lastStep.options) || lastStep.options.length !== 2) {
      fail("Binary step must have exactly 2 options");
    } else {
      const ids = lastStep.options.map((o) => o.id).sort();
      if (ids[0] === "no" && ids[1] === "yes") {
        pass('Binary step has option IDs "yes" and "no"');
      } else {
        fail(
          `Binary step option IDs are "${lastStep.options.map((o) => o.id).join('", "')}" — must be "yes" and "no" (QuizOverlay routes based on these exact IDs)`
        );
      }
    }
  }

  // Validate each step
  steps.forEach((s, i) => {
    if (!exists(s, "question")) {
      fail(`quiz.steps[${i}].question is missing`);
    }

    if (!Array.isArray(s.options) || s.options.length === 0) {
      fail(`quiz.steps[${i}].options is missing or empty`);
    } else {
      // Check each option has id and label
      s.options.forEach((opt, j) => {
        if (!exists(opt, "id")) {
          fail(`quiz.steps[${i}].options[${j}].id is missing`);
        }
        if (!exists(opt, "label")) {
          fail(`quiz.steps[${i}].options[${j}].label is missing`);
        }
      });

      // Image-grid options need images
      if (s.type === "image-grid") {
        s.options.forEach((opt, j) => {
          if (!opt.image) {
            fail(`quiz.steps[${i}].options[${j}].image is missing (required for image-grid)`);
          } else {
            checkImageUrl(opt.image, `quiz.steps[${i}].options[${j}].image`);
          }
        });
      }
    }
  });
}

// ── Section: Social Proof ──

section("Social Proof");

if (!data.socialProof) {
  fail("socialProof object is missing");
} else {
  if (!Array.isArray(data.socialProof.reviews) || data.socialProof.reviews.length === 0) {
    fail("socialProof.reviews is missing or empty");
  } else if (data.socialProof.reviews.length < 3) {
    warn(
      `socialProof.reviews has ${data.socialProof.reviews.length} reviews (recommended: at least 3)`
    );
  } else {
    pass(`socialProof.reviews has ${data.socialProof.reviews.length} reviews`);
  }

  if (Array.isArray(data.socialProof.reviews)) {
    data.socialProof.reviews.forEach((r, i) => {
      if (!exists(r, "name")) fail(`socialProof.reviews[${i}].name is missing`);
      if (!exists(r, "text")) fail(`socialProof.reviews[${i}].text is missing`);
      if (typeof r.rating !== "number" || r.rating < 1 || r.rating > 5) {
        fail(`socialProof.reviews[${i}].rating must be a number 1-5 (got: ${r.rating})`);
      }
    });
  }
}

// ── Section: Pages ──

section("Pages");

if (!data.pages) {
  fail("pages object is missing");
} else {
  if (!data.pages.thankYou) {
    fail("pages.thankYou object is missing");
  } else {
    checkRequired(data.pages.thankYou, "heading", "pages.thankYou.heading");
    checkRequired(data.pages.thankYou, "message", "pages.thankYou.message");
  }

  if (!data.pages.notInArea) {
    fail("pages.notInArea object is missing");
  } else {
    checkRequired(data.pages.notInArea, "heading", "pages.notInArea.heading");
    checkRequired(data.pages.notInArea, "message", "pages.notInArea.message");
    checkRequired(data.pages.notInArea, "ctaLabel", "pages.notInArea.ctaLabel");
  }
}

// ── Section: Footer ──

section("Footer");

if (!data.footer) {
  fail("footer object is missing");
} else {
  checkRequired(data.footer, "copyright", "footer.copyright");

  if (!Array.isArray(data.footer.links) || data.footer.links.length === 0) {
    fail("footer.links is missing or empty (expected at least 1 link)");
  } else {
    pass(`footer.links has ${data.footer.links.length} links`);
    data.footer.links.forEach((l, i) => {
      if (!exists(l, "label")) fail(`footer.links[${i}].label is missing`);
      if (!exists(l, "href")) fail(`footer.links[${i}].href is missing`);
    });

    // Warn if all links are still placeholder #
    const allPlaceholder = data.footer.links.every((l) => l.href === "#");
    if (allPlaceholder) {
      warn("All footer links are still placeholder (#) — update with real URLs before go-live");
    }
  }
}

// ── Summary ──

function printSummary() {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log(`Results: ${passes} passed, ${fails} failed, ${warnings} warnings`);

  if (fails > 0) {
    console.log("");
    console.log("\x1b[31m✗ Validation FAILED\x1b[0m — fix the issues above before deploying");
    console.log("");
    console.log("Failed checks:");
    failedChecks.forEach((msg, i) => {
      console.log(`  ${i + 1}. ${msg}`);
    });
  } else if (warnings > 0) {
    console.log("\x1b[33m⚠ Validation PASSED with warnings\x1b[0m — review warnings above");
  } else {
    console.log("\x1b[32m✓ Validation PASSED\x1b[0m — ready for preview");
  }

  console.log("══════════════════════════════════════════════");
  console.log("");
}

printSummary();
process.exit(fails > 0 ? 1 : 0);
