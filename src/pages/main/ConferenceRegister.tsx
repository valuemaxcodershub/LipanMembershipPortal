import { useEffect, useRef, useState } from "react";
import { Button, Label } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Country } from "../../types/_all";
import countryData from "../../data.json";
import axios from "../../config/axios";
import MsFormShell from "../../components/conference/MsFormShell";
import FormQuestionCard from "../../components/conference/FormQuestionCard";
import {
  buildConferencePayload,
  buildConferencePayPath,
  pickConferenceId,
} from "../../utils/conferencePayload";
import {
  GENDER_OPTIONS,
  PARTICIPANT_CATEGORY_OPTIONS,
  LOCATION_REGION_OPTIONS,
  PARTICIPANT_TYPE_OPTIONS,
  PARTICIPATION_MODE_OPTIONS,
  SUB_THEME_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  YES_NO_OPTIONS,
  countWords,
  namesMatch,
} from "../../data/conference2026";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone/WhatsApp is required"),
  categoryOfParticipant: yup
    .string()
    .required("Category of participant is required"),
  organization: yup.string().required("Organization/Institution is required"),
  title: yup.string().required("Title/Position is required"),
  locationRegion: yup.string().required("Your location is required"),
  country: yup
    .string()
    .required("Country is required")
    .when("locationRegion", {
      is: "International",
      then: (s) =>
        s.test(
          "not-nigeria",
          "International participants cannot select Nigeria. Please select your country of residence.",
          (value) => !!value && value !== "Nigeria"
        ),
      otherwise: (s) => s,
    }),
  city: yup.string().required("City is required"),
  participationCategory: yup
    .string()
    .required("Type of participant is required"),
  participation: yup.string().required("Participation mode is required"),
  thematicArea: yup.string().when("participationCategory", {
    is: (val: string) => val === "presenter" || val === "co-presenter",
    then: (s) => s.required("Please select a sub-theme"),
    otherwise: (s) => s.nullable(),
  }),
  paperTitle: yup.string().when("participationCategory", {
    is: (val: string) => val === "presenter" || val === "co-presenter",
    then: (s) => s.required("Abstract title is required"),
    otherwise: (s) => s.nullable(),
  }),
  abstract: yup.string().when("participationCategory", {
    is: (val: string) => val === "presenter" || val === "co-presenter",
    then: (s) =>
      s
        .required("Abstract is required")
        .test(
          "max-words",
          "Abstract must not exceed 300 words",
          (value) => !value || countWords(value) <= 300
        ),
    otherwise: (s) => s.nullable(),
  }),
  heardAbout: yup.string().required("Please tell us how you heard about this event"),
  heardAboutOther: yup.string().when("heardAbout", {
    is: "Others",
    then: (s) => s.required("Please identify how you heard about this event"),
    otherwise: (s) => s.nullable(),
  }),
  isLipanMember: yup.string().required("Please indicate if you are a LiPAN member"),
  lipanId: yup.string().when("isLipanMember", {
    is: "Yes",
    then: (s) => s.required("LiPAN membership ID is required"),
    otherwise: (s) => s.nullable(),
  }),
});

type FormValues = yup.InferType<typeof schema>;

type MemberCheckStatus =
  | "idle"
  | "checking"
  | "confirmed"
  | "not_found"
  | "expired"
  | "name_mismatch"
  | "invalid_format"
  | "error";

type MemberCheck = {
  status: MemberCheckStatus;
  message: string;
};

const LIPAN_ID_PATTERN = /^Li\d{4}PAN$/;

const NAME_MISMATCH_MESSAGE =
  "The name you entered above does not match your LiPAN membership record. Please insert your first and last name exactly as they appear on your LiPAN membership (rearrangement is allowed).";

const CONFIRMED_MESSAGE = "Yes, we can confirm you are a LiPAN member.";
const NOT_CONFIRMED_MESSAGE = "We cannot confirm your membership.";
const EXPIRED_MESSAGE =
  "We cannot confirm a valid membership. Your LiPAN membership has expired. Please renew your membership, then come back to register.";

const inputClass =
  "w-full rounded-md border border-[#d1d1d1] bg-white px-3 py-2.5 text-sm text-[#242424] outline-none transition focus:border-[#5b5fc7] focus:ring-2 focus:ring-[#5b5fc7]/30 disabled:bg-[#f5f5f5]";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    control,
    getValues,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: "Nigeria",
      lipanId: "",
      abstract: "",
      paperTitle: "",
      thematicArea: "",
      heardAboutOther: "",
      isLipanMember: "",
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const dbNamesRef = useRef<{ first?: string; last?: string; full?: string }>({});
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCategory = watch("participationCategory");
  const locationRegion = watch("locationRegion");
  const heardAbout = watch("heardAbout");
  const abstractValue = watch("abstract") || "";
  const isLipanMember = watch("isLipanMember");
  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";
  const lipanIdValue = watch("lipanId") || "";
  const isPresenter =
    selectedCategory === "presenter" || selectedCategory === "co-presenter";

  const [countries] = useState<Country[]>(countryData as any);
  const [memberCheck, setMemberCheck] = useState<MemberCheck>({
    status: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInternational = locationRegion === "International";

  useEffect(() => {
    if (isInternational && getValues("country") === "Nigeria") {
      setValue("country", "", { shouldValidate: true });
    }
    if (locationRegion && !isInternational) {
      setValue("country", "Nigeria", { shouldValidate: true });
    }
  }, [isInternational, locationRegion, getValues, setValue]);

  const applyNameMatch = (statusIfMatch: MemberCheckStatus = "confirmed") => {
    const db = dbNamesRef.current;
    if (!db.first && !db.last && !db.full) return statusIfMatch === "confirmed";
    return namesMatch(firstName, lastName, db.first, db.last, db.full);
  };

  const verifyMembership = async (rawId: string) => {
    const id = rawId.trim();
    if (!id) {
      setMemberCheck({ status: "idle", message: "" });
      dbNamesRef.current = {};
      return;
    }

    if (!LIPAN_ID_PATTERN.test(id)) {
      dbNamesRef.current = {};
      setMemberCheck({
        status: "invalid_format",
        message: "Invalid ID provided. Log in to your membership portal to retrieve it.",
      });
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setMemberCheck({
        status: "error",
        message:
          "Please enter your first and last name above first, then we can match them with your LiPAN membership.",
      });
      return;
    }

    setMemberCheck({ status: "checking", message: "Checking membership..." });
    try {
      const { data } = await axios.post("/accounts/user/verify-id/", {
        lipan_id: id,
      });
      dbNamesRef.current = {
        first: data.first_name,
        last: data.last_name,
        full: data.full_name,
      };
      setValue("lipanId", id);

      if (data.first_name || data.last_name || data.full_name) {
        if (!namesMatch(firstName, lastName, data.first_name, data.last_name, data.full_name)) {
          setMemberCheck({ status: "name_mismatch", message: NAME_MISMATCH_MESSAGE });
          return;
        }
      }

      setMemberCheck({
        status: "confirmed",
        message: CONFIRMED_MESSAGE,
      });
    } catch (err: any) {
      const payload = err?.response?.data || {};
      const code = payload.code;
      dbNamesRef.current = {
        first: payload.first_name,
        last: payload.last_name,
        full: payload.full_name,
      };

      if (err?.response?.status === 404 || code === "not_found") {
        setMemberCheck({
          status: "not_found",
          message: NOT_CONFIRMED_MESSAGE,
        });
        return;
      }

      if (err?.response?.status === 402 || code === "expired") {
        if (payload.first_name || payload.last_name || payload.full_name) {
          if (
            !namesMatch(
              firstName,
              lastName,
              payload.first_name,
              payload.last_name,
              payload.full_name
            )
          ) {
            setMemberCheck({ status: "name_mismatch", message: NAME_MISMATCH_MESSAGE });
            return;
          }
        }
        setMemberCheck({
          status: "expired",
          message: payload.message || EXPIRED_MESSAGE,
        });
        return;
      }

      setMemberCheck({
        status: "error",
        message: payload.message || NOT_CONFIRMED_MESSAGE,
      });
    }
  };

  useEffect(() => {
    if (isLipanMember !== "Yes") return;
    if (memberCheck.status !== "confirmed" && memberCheck.status !== "name_mismatch") {
      return;
    }
    const db = dbNamesRef.current;
    if (!db.first && !db.last && !db.full) return;
    const match = applyNameMatch();
    setMemberCheck((prev) => {
      if (match && prev.status !== "confirmed") {
        return { status: "confirmed", message: CONFIRMED_MESSAGE };
      }
      if (!match && prev.status !== "name_mismatch") {
        return { status: "name_mismatch", message: NAME_MISMATCH_MESSAGE };
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName, isLipanMember]);

  useEffect(() => {
    return () => {
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, []);

  const scheduleVerify = (id: string) => {
    if (checkTimer.current) clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => {
      void verifyMembership(id);
    }, 600);
  };

  const submitRegistration = async () => {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) return;

    if (getValues("isLipanMember") === "Yes") {
      if (memberCheck.status === "expired") {
        toast.error(EXPIRED_MESSAGE);
        return;
      }
      if (memberCheck.status === "name_mismatch") {
        toast.error(NAME_MISMATCH_MESSAGE);
        return;
      }
      if (memberCheck.status !== "confirmed") {
        toast.error("Please enter a valid LiPAN membership ID so we can confirm your membership.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const values = getValues();
      const confirmedMember = values.isLipanMember === "Yes" && memberCheck.status === "confirmed";
      const payload = buildConferencePayload(values, {
        lipanId: confirmedMember ? values.lipanId || "" : "",
        paymentMethod: "paystack",
        isConfirmedMember: confirmedMember,
      });

      const { data } = await axios.post("/conference/register/", {
        ...payload,
        conferenceYear: 2026,
        paymentTrxId: "",
        paymentTrxRef: "",
      });

      toast.success(data?.message || "Registration submitted successfully");
      navigate(
        buildConferencePayPath({
          conferenceId: pickConferenceId(data),
          amount: data?.amount ?? payload.amount,
          currency: data?.currency || payload.currency,
          feeLabel: data?.registrationFee || payload.registrationFee,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          thanks: true,
          emailSent: !!data?.emailSent,
        })
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = countries
    .filter((country) => !(isInternational && country.name === "Nigeria"))
    .map((country) => ({
      value: country.name,
      label: country.name,
      flag: country.flags.svg,
    }));

  const CustomOption = (props: any) => (
    <ReactSelectComponents.Option {...props}>
      <div className="flex items-center">
        <img
          src={props.data.flag}
          alt={`${props.data.label} flag`}
          className="mr-2 h-4 w-6 rounded shadow"
        />
        {props.data.label}
      </div>
    </ReactSelectComponents.Option>
  );

  const CustomSingleValue = (props: any) => (
    <ReactSelectComponents.SingleValue {...props}>
      <div className="flex items-center">
        <img
          src={props.data.flag}
          alt={`${props.data.label} flag`}
          className="mr-2 h-4 w-6 rounded shadow"
        />
        {props.data.label}
      </div>
    </ReactSelectComponents.SingleValue>
  );

  const radioItem = (name: keyof FormValues, value: string, label: string) => (
    <label
      key={value}
      className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 hover:bg-[#f5f5f5]"
    >
      <input
        type="radio"
        value={value}
        {...register(name as any)}
        id={`${String(name)}-${value}`}
        className="h-4 w-4 border-[#c7c7c7] text-[#5b5fc7] focus:ring-[#5b5fc7]"
      />
      <span className="text-sm text-[#242424]">{label}</span>
    </label>
  );

  const memberQuestionNumber = isPresenter
    ? heardAbout === "Others"
      ? 16
      : 15
    : heardAbout === "Others"
      ? 13
      : 12;

  const memberStatusClass =
    memberCheck.status === "confirmed"
      ? "text-green-700"
      : memberCheck.status === "checking"
        ? "text-[#5b5fc7]"
        : "text-[#c4314b]";

  return (
    <MsFormShell>
      <form ref={formRef} className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <FormQuestionCard number={1} title="First Name" error={errors.firstName?.message}>
          <input className={inputClass} placeholder="Enter your first name" {...register("firstName")} />
        </FormQuestionCard>

        <FormQuestionCard number={2} title="Last Name" error={errors.lastName?.message}>
          <input className={inputClass} placeholder="Enter your last name" {...register("lastName")} />
        </FormQuestionCard>

        <FormQuestionCard number={3} title="Gender" error={errors.gender?.message}>
          <div className="space-y-1">
            {GENDER_OPTIONS.map((option) => radioItem("gender", option, option))}
          </div>
        </FormQuestionCard>

        <FormQuestionCard number={4} title="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} placeholder="example@mail.com" {...register("email")} />
        </FormQuestionCard>

        <FormQuestionCard number={5} title="Phone/WhatsApp Number" error={errors.phone?.message}>
          <input type="tel" className={inputClass} placeholder="+234 ..." {...register("phone")} />
        </FormQuestionCard>

        <FormQuestionCard
          number={6}
          title="Category of Participant"
          error={errors.categoryOfParticipant?.message}
        >
          <div className="space-y-1">
            {PARTICIPANT_CATEGORY_OPTIONS.map((option) =>
              radioItem("categoryOfParticipant", option, option)
            )}
          </div>
        </FormQuestionCard>

        <FormQuestionCard number={7} title="Organization/Institution" error={errors.organization?.message}>
          <input className={inputClass} placeholder="Institution name" {...register("organization")} />
        </FormQuestionCard>

        <FormQuestionCard number={8} title="Title/Position" error={errors.title?.message}>
          <input className={inputClass} placeholder="Your position" {...register("title")} />
        </FormQuestionCard>

        <FormQuestionCard
          number={9}
          title="Your Location"
          className="relative z-20"
          error={
            errors.locationRegion?.message ||
            errors.country?.message ||
            errors.city?.message
          }
        >
          <div className="space-y-1">
            {LOCATION_REGION_OPTIONS.map((option) =>
              radioItem("locationRegion", option, option)
            )}
          </div>

          <div className="relative z-20 mt-5 grid gap-4 sm:grid-cols-2">
            <div className="relative z-30">
              <Label value="Country" className="mb-1 !text-[#424242]" />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={countryOptions}
                    components={{
                      Option: CustomOption,
                      SingleValue: CustomSingleValue,
                    }}
                    placeholder={
                      isInternational ? "Select your country" : "Select country"
                    }
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: 42,
                        borderColor: "#d1d1d1",
                        boxShadow: "none",
                      }),
                      menu: (base) => ({ ...base, zIndex: 80 }),
                      menuPortal: (base) => ({ ...base, zIndex: 80 }),
                    }}
                    onChange={(selected) => {
                      field.onChange(selected ? selected.value : "");
                    }}
                    value={
                      countryOptions.find((option) => option.value === field.value) ||
                      null
                    }
                  />
                )}
              />
            </div>
            <div>
              <Label value="City" className="mb-1 !text-[#424242]" />
              <input
                className={inputClass}
                placeholder={isInternational ? "City of residence" : "City"}
                {...register("city")}
              />
            </div>
          </div>
          {isInternational && (
            <p className="mt-2 text-xs text-[#616161]">
              International participants must select a country other than Nigeria.
            </p>
          )}
        </FormQuestionCard>

        <FormQuestionCard
          number={10}
          title="Type of Participant"
          error={
            errors.participationCategory?.message || errors.participation?.message
          }
        >
          <div className="space-y-1">
            {PARTICIPANT_TYPE_OPTIONS.map((option) =>
              radioItem("participationCategory", option.value, option.label)
            )}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-[#242424]">
              Preferred Mode of Participation <span className="text-[#c4314b]">*</span>
            </p>
            <div className="space-y-1">
              {PARTICIPATION_MODE_OPTIONS.map((option) =>
                radioItem("participation", option.value, option.label)
              )}
            </div>
          </div>
        </FormQuestionCard>

        {isPresenter && (
          <>
            <FormQuestionCard
              number={11}
              title="If presenter, select sub-theme"
              error={errors.thematicArea?.message}
            >
              <select className={inputClass} {...register("thematicArea")}>
                <option value="">Select sub-theme</option>
                {SUB_THEME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormQuestionCard>

            <FormQuestionCard
              number={12}
              title="If Presenter, indicate the title of your abstract"
              error={errors.paperTitle?.message}
            >
              <input className={inputClass} placeholder="Abstract title" {...register("paperTitle")} />
            </FormQuestionCard>

            <FormQuestionCard
              number={13}
              title="If you would be presenting, kindly paste your abstract of not more than 300 words"
              error={errors.abstract?.message}
              hint={`${countWords(abstractValue)} / 300 words`}
            >
              <textarea
                rows={7}
                className={`${inputClass} resize-y`}
                placeholder="Paste your abstract here..."
                {...register("abstract")}
              />
            </FormQuestionCard>
          </>
        )}

        <FormQuestionCard
          number={isPresenter ? 14 : 11}
          title="How did you hear about this event?"
          error={errors.heardAbout?.message}
        >
          <div className="space-y-1">
            {HEARD_ABOUT_OPTIONS.map((option) =>
              radioItem("heardAbout", option, option)
            )}
          </div>
        </FormQuestionCard>

        {heardAbout === "Others" && (
          <FormQuestionCard
            number={isPresenter ? 15 : 12}
            title="If others, please identify"
            error={errors.heardAboutOther?.message}
          >
            <input className={inputClass} placeholder="Please specify" {...register("heardAboutOther")} />
          </FormQuestionCard>
        )}

        <FormQuestionCard
          number={memberQuestionNumber}
          title="Are you a LiPAN member?"
          error={errors.isLipanMember?.message || errors.lipanId?.message}
          hint={
            <>
              If yes, we will check your membership ID against the LiPAN database. Your name above must match your membership name.{" "}
              Want to become a member?{" "}
              <Link
                className="font-semibold text-[#5b5fc7] underline"
                to="/auth/sign-up"
              >
                Register here
              </Link>
              .
            </>
          }
        >
          <div className="space-y-1">
            {YES_NO_OPTIONS.map((option) => radioItem("isLipanMember", option, option))}
          </div>

          {isLipanMember === "Yes" && (
            <div className="mt-5 space-y-2">
              <Label value="LiPAN Membership ID" className="!text-[#424242]" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className={inputClass}
                  placeholder="e.g. Li0001PAN"
                  value={lipanIdValue}
                  onChange={(e) => {
                    const next = e.target.value.trim();
                    setValue("lipanId", next, { shouldValidate: true });
                    setMemberCheck({ status: "idle", message: "" });
                    scheduleVerify(next);
                  }}
                  onBlur={(e) => void verifyMembership(e.target.value)}
                />
                <Button
                  onClick={() => void verifyMembership(lipanIdValue)}
                  color="purple"
                  disabled={memberCheck.status === "checking"}
                  isProcessing={memberCheck.status === "checking"}
                >
                  Check
                </Button>
              </div>
              {memberCheck.status === "invalid_format" ? (
                <p className="text-sm font-medium text-[#c4314b]">
                  Invalid ID provided. Log in to your membership portal here to retrieve it:{" "}
                  <Link className="font-semibold underline" to="/auth/sign-in">
                    Sign in
                  </Link>
                  .
                </p>
              ) : memberCheck.message ? (
                <p className={`text-sm font-medium ${memberStatusClass}`}>
                  {memberCheck.message}
                </p>
              ) : null}
              {memberCheck.status === "expired" && (
                <p className="text-sm text-[#c4314b]">
                  Please{" "}
                  <Link className="font-semibold underline" to="/auth/sign-in">
                    sign in
                  </Link>{" "}
                  to renew your membership at My Membership, or start from{" "}
                  <Link className="font-semibold underline" to="/getting-started">
                    membership plans
                  </Link>
                  , then return to register.
                </p>
              )}
            </div>
          )}
        </FormQuestionCard>

        <section className="ms-form-card rounded-xl px-5 py-5 shadow-[0_1.6px_3.6px_rgba(0,0,0,0.13)] sm:px-6 sm:py-6">
          <Button
            onClick={submitRegistration}
            type="button"
            isProcessing={isSubmitting}
            disabled={isSubmitting || memberCheck.status === "expired"}
            className="w-full !bg-[#5b5fc7] hover:!bg-[#4f52c1]"
          >
            Submit
          </Button>
          <p className="mt-2 text-center text-xs text-[#616161]">
            Submitting saves your details with payment pending. Your registration fee will be shown on the payment page.
          </p>
        </section>
      </form>
    </MsFormShell>
  );
}
