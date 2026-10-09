import { emptyAnswers, type Answers, type Submission } from "./types";

const DRAFT_KEY = "property-enquiry-draft-v3";
const SUCCESS_KEY = "property-enquiry-success-v1";

export type Draft = {
  version: 3;
  answers: Answers;
  step: number;
  sourceDevelopmentSlug: string | null;
};

export function newDraft(sourceDevelopmentSlug: string | null): Draft {
  return {
    version: 3,
    answers: emptyAnswers(),
    step: 0,
    sourceDevelopmentSlug,
  };
}

export function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Draft;
    if (parsed.version !== 3 || !parsed.answers || !Number.isInteger(parsed.step)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft) {
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  window.sessionStorage.removeItem(DRAFT_KEY);
}

export function writeSuccess(submission: Submission) {
  window.sessionStorage.setItem(SUCCESS_KEY, JSON.stringify(submission));
}

export function readSuccess(): Submission | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SUCCESS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Submission;
    return parsed.acknowledged === true && typeof parsed.acknowledged_at === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSuccess() {
  window.sessionStorage.removeItem(SUCCESS_KEY);
}
