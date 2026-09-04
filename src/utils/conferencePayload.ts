import { getConferenceFee } from "../data/conference2026";

export function pickConferenceId(data: any): string {
  const raw =
    data?.conferenceId ??
    data?.conference_reg_id ??
    data?.conference_id ??
    data?.id;
  const id = String(raw ?? "").trim();
  if (!id || id === "undefined" || id === "null") return "";
  return id;
}

export function buildConferencePayPath(input: {
  conferenceId?: string | number;
  amount?: number | string;
  currency?: string;
  feeLabel?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  thanks?: boolean;
  emailSent?: boolean;
}) {
  const params = new URLSearchParams();
  const id = pickConferenceId({ conferenceId: input.conferenceId });
  if (id) params.set("id", id);
  if (input.feeLabel) params.set("fee", String(input.feeLabel));
  if (input.amount != null && input.amount !== "") params.set("amount", String(input.amount));
  if (input.currency) params.set("currency", String(input.currency));
  const name = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();
  if (name) params.set("name", name);
  if (input.email) params.set("email", String(input.email));
  if (input.thanks) params.set("thanks", "1");
  if (input.emailSent) params.set("emailSent", "1");
  const qs = params.toString();
  return qs ? `/conference/pay?${qs}` : "/conference/pay";
}

export function buildRegistrationSuccessPath(input: {
  conferenceId?: string | number;
  amount?: number | string;
  currency?: string;
  feeLabel?: string;
  paid?: boolean;
}) {
  const params = new URLSearchParams();
  const id = pickConferenceId({ conferenceId: input.conferenceId });
  if (id) params.set("id", id);
  if (input.feeLabel) params.set("fee", String(input.feeLabel));
  if (input.amount != null && input.amount !== "") params.set("amount", String(input.amount));
  if (input.currency) params.set("currency", String(input.currency));
  if (input.paid) params.set("paid", "1");
  const qs = params.toString();
  return qs ? `/conference/register/success?${qs}` : "/conference/register/success";
}

/**
 * Maps the redesigned form values to the existing conference API payload
 * so live registration/payment continues to work without a breaking API change.
 * Extra answers are preserved inside presentationTypes / coAuthors.
 */
export function buildConferencePayload(
  values: Record<string, any>,
  extras: {
    lipanId?: string;
    paymentMethod?: string;
    isConfirmedMember?: boolean;
  } = {}
) {
  const isConfirmedMember = !!extras.isConfirmedMember;
  const computedFee = getConferenceFee({
    categoryOfParticipant: values.categoryOfParticipant,
    locationRegion: values.locationRegion,
    country: values.country,
    isConfirmedMember,
  });
  const fee = {
    label: values.registrationFee || computedFee.label,
    amount: values.amount ?? computedFee.amount,
    currency: values.currency || computedFee.currency,
  };

  const metaParts = [
    values.gender && `Gender: ${values.gender}`,
    values.categoryOfParticipant &&
      `Category: ${values.categoryOfParticipant}`,
    values.locationRegion && `Region: ${values.locationRegion}`,
    values.isLipanMember && `LiPAN member: ${values.isLipanMember}`,
    values.heardAbout && `Heard about: ${values.heardAbout}`,
    values.heardAboutOther && `Heard about (other): ${values.heardAboutOther}`,
  ].filter(Boolean);

  return {
    firstName: values.firstName,
    lastName: values.lastName,
    title: values.title,
    organization: values.organization,
    email: values.email,
    phone: values.phone,
    city: values.city,
    country: values.country,
    participation: values.participation,
    participationCategory: values.participationCategory,
    registrationFee: fee.label,
    amount: fee.amount,
    currency: fee.currency,
    paperTitle: values.paperTitle || "",
    thematicArea: values.thematicArea || "",
    coAuthors: values.abstract || "",
    presentationTypes: metaParts.join(" | "),
    paymentTrxId: values.paymentTrxId || "",
    paymentTrxRef: values.paymentTrxRef || "",
    paymentMethod: extras.paymentMethod || "paystack",
    lipanId: extras.lipanId || values.lipanId || "",
    conferenceYear: values.conferenceYear || 2026,
    isLipanMember: values.isLipanMember,
    gender: values.gender,
    categoryOfParticipant: values.categoryOfParticipant,
    locationRegion: values.locationRegion,
    abstract: values.abstract,
    heardAbout: values.heardAbout,
    heardAboutOther: values.heardAboutOther,
  };
}
