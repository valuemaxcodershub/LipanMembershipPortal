import { useRef, useState } from "react";
import { Button, Label, Radio, TextInput, Select } from "flowbite-react";
import { HiOutlineCreditCard } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePaystackPayment } from "react-paystack";
import PaymentProcessingModal from "../../components/UI/ConferencePaymentModal";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { Country } from "../../types/_all";
import countryData from "../../data.json";
import axios from "../../config/axios";
import MsFormShell from "../../components/conference/MsFormShell";
import FormQuestionCard from "../../components/conference/FormQuestionCard";
import {
  GENDER_OPTIONS,
  PARTICIPANT_CATEGORY_OPTIONS,
  LOCATION_REGION_OPTIONS,
  PARTICIPANT_TYPE_OPTIONS,
  PARTICIPATION_MODE_OPTIONS,
  SUB_THEME_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  countWords,
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
  country: yup.string().required("Country is required"),
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
  registrationFee: yup.string().required("Please select a registration fee"),
  paymentTrxId: yup.string(),
  paymentTrxRef: yup.string(),
  lipanId: yup.string(),
});

type FormValues = yup.InferType<typeof schema>;

async function checkCode(
  id: string
): Promise<{ valid: boolean; message: string } | undefined> {
  const pattern = /^Li\d{4}PAN$/;
  if (!pattern.test(id)) {
    return { valid: false, message: "Invalid ID provided." };
  }

  try {
    await axios.post("/accounts/user/verify-id/", { lipan_id: id });
    return { valid: true, message: "ID validated successfully." };
  } catch (err: any) {
    return {
      valid: false,
      message:
        err?.response?.data?.message ||
        "Error validating ID. Please try again later.",
    };
  }
}

const inputClass =
  "w-full rounded-md border border-[#d1d1d1] bg-white px-3 py-2.5 text-sm text-[#242424] outline-none transition focus:border-[#5b5fc7] focus:ring-2 focus:ring-[#5b5fc7]/30 disabled:bg-[#f5f5f5]";

export default function RegistrationPage() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    control,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: "Nigeria",
      paymentTrxId: "",
      paymentTrxRef: "",
      lipanId: "",
      abstract: "",
      paperTitle: "",
      thematicArea: "",
      heardAboutOther: "",
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const selectedFee = watch("registrationFee");
  const formValues = watch();
  const selectedCountry = watch("country");
  const selectedCity = watch("city");
  const selectedCategory = watch("participationCategory");
  const locationRegion = watch("locationRegion");
  const heardAbout = watch("heardAbout");
  const abstractValue = watch("abstract") || "";
  const isPresenter =
    selectedCategory === "presenter" || selectedCategory === "co-presenter";

  const [showModal, setShowModal] = useState(false);
  const [countries] = useState<Country[]>(countryData as any);
  const [code, setCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(
    null
  );

  const handleCheck = async () => {
    setIsCheckingCode(true);
    const res = await checkCode(code);
    setResult(res || null);
    if (res?.valid) {
      setValue("lipanId", code);
    }
    setIsCheckingCode(false);
  };

  const getFeeOptions = () => {
    if (!selectedCountry || !selectedCategory || !selectedCity) return [];

    const countryInfo = countries.find((c) => c.name === selectedCountry);
    const isNigeria = selectedCountry === "Nigeria";
    const isAfrica = countryInfo?.region === "Africa" && !isNigeria;

    if (isNigeria) {
      return [
        { value: "Student – ₦20,000", label: "Student – ₦20,000" },
        { value: "Member – ₦30,000", label: "Member – ₦30,000" },
        { value: "Non-Member – ₦40,000", label: "Non-Member – ₦40,000" },
      ];
    }
    if (isAfrica) {
      return [
        { value: "Student – $20", label: "Student – $20" },
        { value: "Regular – $100", label: "Regular – $100" },
      ];
    }
    return [
      { value: "Student – $20", label: "Student – $20" },
      { value: "Regular – $150", label: "Regular – $150" },
    ];
  };

  let amount = 0;
  let currency: "NGN" | "USD" = "NGN";

  if (selectedFee) {
    if (selectedFee.includes("₦")) {
      currency = "NGN";
      amount = parseInt(selectedFee.replace(/[^0-9]/g, ""), 10);
    } else if (selectedFee.includes("$")) {
      currency = "USD";
      amount = parseInt(selectedFee.replace(/[^0-9]/g, ""), 10);
    }
  }

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: watch("email"),
    amount: amount * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency,
  };

  const onSuccess = (reference: any) => {
    setValue("paymentTrxId", reference.transaction);
    setValue("paymentTrxRef", reference.trxref);
    setShowModal(true);
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const startPayment = async () => {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) return;
    if (selectedFee === "Member – ₦30,000" && (!result || !result.valid)) {
      return;
    }
    initializePayment({ onSuccess, onClose: () => {} });
  };

  const countryOptions = countries.map((country) => ({
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
      <Radio value={value} {...register(name as any)} id={`${String(name)}-${value}`} />
      <span className="text-sm text-[#242424]">{label}</span>
    </label>
  );

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
          <input
            type="email"
            className={inputClass}
            placeholder="example@mail.com"
            {...register("email")}
          />
        </FormQuestionCard>

        <FormQuestionCard
          number={5}
          title="Phone/WhatsApp Number"
          error={errors.phone?.message}
        >
          <input
            type="tel"
            className={inputClass}
            placeholder="+234 ..."
            {...register("phone")}
          />
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

        <FormQuestionCard
          number={7}
          title="Organization/Institution"
          error={errors.organization?.message}
        >
          <input
            className={inputClass}
            placeholder="Institution name"
            {...register("organization")}
          />
        </FormQuestionCard>

        <FormQuestionCard number={8} title="Title/Position" error={errors.title?.message}>
          <input className={inputClass} placeholder="Your position" {...register("title")} />
        </FormQuestionCard>

        <FormQuestionCard
          number={9}
          title="Your Location"
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

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
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
                    placeholder="Select country"
                    isSearchable
                    isDisabled={!!selectedFee}
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: 42,
                        borderColor: "#d1d1d1",
                        boxShadow: "none",
                      }),
                    }}
                    onChange={(selected) =>
                      field.onChange(selected ? selected.value : "")
                    }
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
                placeholder="City"
                disabled={!!selectedFee}
                {...register("city")}
              />
            </div>
          </div>
          {locationRegion === "International" && (
            <p className="mt-2 text-xs text-[#616161]">
              International participants: select your country and city above.
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
              <input
                className={inputClass}
                placeholder="Abstract title"
                {...register("paperTitle")}
              />
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
            <input
              className={inputClass}
              placeholder="Please specify"
              {...register("heardAboutOther")}
            />
          </FormQuestionCard>
        )}

        {selectedCountry && selectedCategory && selectedCity && (
          <FormQuestionCard
            number={isPresenter ? (heardAbout === "Others" ? 16 : 15) : heardAbout === "Others" ? 13 : 12}
            title="Registration Fee"
            error={errors.registrationFee?.message}
          >
            <Select
              disabled={!!selectedFee}
              {...register("registrationFee")}
              className="w-full"
            >
              <option value="">Select registration type</option>
              {getFeeOptions().map((fee) => (
                <option key={fee.value} value={fee.value}>
                  {fee.label}
                </option>
              ))}
            </Select>

            {selectedFee === "Member – ₦30,000" && selectedCountry === "Nigeria" && (
              <div className="mt-5 space-y-2">
                <Label value="Enter your Membership ID" />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <TextInput
                    type="text"
                    value={code}
                    placeholder="e.g. Li0001PAN"
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isCheckingCode || !!result?.valid}
                    className="w-full"
                  />
                  <Button
                    onClick={handleCheck}
                    color="purple"
                    disabled={isCheckingCode || !!result?.valid}
                    isProcessing={isCheckingCode}
                  >
                    Validate
                  </Button>
                </div>
                {result && (
                  <p
                    className={`text-sm ${result.valid ? "text-green-600" : "text-red-500"}`}
                  >
                    {result.message}
                  </p>
                )}
              </div>
            )}

            {selectedFee && (
              <div className="mt-6 rounded-lg border border-[#e1e1e1] bg-[#fafafa] p-4">
                {selectedFee === "Student – ₦20,000" && (
                  <p className="mb-4 rounded-md border-l-4 border-[#5b5fc7] bg-white p-3 text-sm text-[#424242]">
                    <span className="font-semibold">Note:</span> You will be
                    required to provide your student ID on conference entry.
                  </p>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#616161]">Registration fee</p>
                    <p className="text-xl font-bold text-[#5b5fc7]">
                      {currency} {amount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={startPayment}
                    type="button"
                    className="!bg-[#5b5fc7] hover:!bg-[#4f52c1]"
                  >
                    <HiOutlineCreditCard className="mr-2 h-5 text-lg" />
                    Pay & Submit
                  </Button>
                </div>
              </div>
            )}
          </FormQuestionCard>
        )}
      </form>

      <PaymentProcessingModal
        isOpen={showModal}
        transactionData={formValues}
        lipanId={result?.valid ? code : ""}
        onClose={() => {
          reset();
          setShowModal(false);
          setResult(null);
          setCode("");
        }}
      />
    </MsFormShell>
  );
}
