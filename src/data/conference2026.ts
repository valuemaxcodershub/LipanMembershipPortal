export const CONFERENCE_COPY = {
  title: "LiPAN's 20th Biennial Conference, 2026",
  subtitle:
    "EARLY LITERACY DEVELOPMENT IN NIGERIA: Strengthening Foundations for Learning and National Development",
  description: "Please provide the details as requested.",
};

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const PARTICIPANT_CATEGORY_OPTIONS = [
  "Academic",
  "Student",
  "School teacher",
  "Other",
] as const;

export const LOCATION_REGION_OPTIONS = [
  "South-West",
  "South-East",
  "South-South",
  "North-Central",
  "North-West",
  "North-East",
  "International",
] as const;

export const PARTICIPANT_TYPE_OPTIONS = [
  { value: "presenter", label: "Presenter" },
  { value: "co-presenter", label: "Co-presenter" },
  { value: "not-presenting", label: "Not presenting" },
] as const;

export const PARTICIPATION_MODE_OPTIONS = [
  { value: "physical", label: "Physical" },
  { value: "virtual", label: "Virtual" },
] as const;

export const SUB_THEME_OPTIONS = [
  "Strengthening Foundational Literacy in Early Grades in Nigeria",
  "Language Policy and Multilingual Contexts in Nigeria",
  "Teacher Capacity, Pedagogy, and Classroom Instruction",
  "Developing Reading Culture in the Early Years",
  "Home, Community, and Stakeholder Engagement in Literacy Development",
  "Inclusion, Equity, and Access in Literacy Education",
  "Digital and Technology-Driven Approaches to Literacy",
  "Policy, Governance, and System-Level Reform",
  "Literacy Across Disciplines",
  "Creative, Cultural, and Media-Based Approaches to Literacy",
  "Other",
] as const;

export const HEARD_ABOUT_OPTIONS = [
  "WhatsApp Group",
  "Facebook",
  "Website",
  "Email",
  "Friends",
  "Others",
] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function nameTokens(...parts: Array<string | undefined | null>) {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

/** Same name, any order (first/last rearrangement allowed). */
export function namesMatch(
  formFirst: string,
  formLast: string,
  dbFirst?: string,
  dbLast?: string,
  dbFull?: string
) {
  const form = nameTokens(formFirst, formLast);
  if (!form.length) return false;

  const fromParts = nameTokens(dbFirst, dbLast);
  const fromFull = nameTokens(dbFull);

  const same = (a: string[], b: string[]) =>
    a.length > 0 &&
    b.length > 0 &&
    a.length === b.length &&
    a.every((token, i) => token === b[i]);

  return same(form, fromParts) || same(form, fromFull);
}

export type ConferenceFee = {
  label: string;
  amount: number;
  currency: "NGN" | "USD";
};

/**
 * Official LiPAN 2026 fees:
 * Student NG ₦20,000 / foreign USD 50
 * International USD 100
 * Nigerian member ₦30,000 / non-member ₦50,000
 */
export function getConferenceFee(input: {
  categoryOfParticipant?: string;
  locationRegion?: string;
  country?: string;
  isConfirmedMember?: boolean;
}): ConferenceFee {
  const isStudent = (input.categoryOfParticipant || "").toLowerCase() === "student";
  const isInternational =
    (input.locationRegion || "").toLowerCase() === "international" ||
    !!(input.country && input.country !== "Nigeria");

  if (isStudent) {
    if (isInternational) {
      return { label: "Student - $50", amount: 50, currency: "USD" };
    }
    return { label: "Student - NGN 20,000", amount: 20_000, currency: "NGN" };
  }

  if (isInternational) {
    return { label: "International - $100", amount: 100, currency: "USD" };
  }

  if (input.isConfirmedMember) {
    return { label: "Member - NGN 30,000", amount: 30_000, currency: "NGN" };
  }

  return { label: "Non-Member - NGN 50,000", amount: 50_000, currency: "NGN" };
}
