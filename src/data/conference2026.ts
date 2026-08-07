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

export function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
