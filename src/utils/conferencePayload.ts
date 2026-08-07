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
  } = {}
) {
  const metaParts = [
    values.gender && `Gender: ${values.gender}`,
    values.categoryOfParticipant &&
      `Category: ${values.categoryOfParticipant}`,
    values.locationRegion && `Region: ${values.locationRegion}`,
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
    registrationFee: values.registrationFee,
    paperTitle: values.paperTitle || "",
    thematicArea: values.thematicArea || "",
    coAuthors: values.abstract || "",
    presentationTypes: metaParts.join(" | "),
    paymentTrxId: values.paymentTrxId || "",
    paymentTrxRef: values.paymentTrxRef || "",
    paymentMethod: extras.paymentMethod || "paystack",
    lipanId: extras.lipanId || values.lipanId || "",
    // Keep original new fields too (ignored by older APIs, useful after deploy)
    gender: values.gender,
    categoryOfParticipant: values.categoryOfParticipant,
    locationRegion: values.locationRegion,
    abstract: values.abstract,
    heardAbout: values.heardAbout,
    heardAboutOther: values.heardAboutOther,
  };
}
