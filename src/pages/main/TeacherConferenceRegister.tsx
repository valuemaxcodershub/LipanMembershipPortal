import { useRef, useState } from "react";
import { Button } from "flowbite-react";
import { HiOutlineCreditCard } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePaystackPayment } from "react-paystack";
import PaymentProcessingModal from "../../components/UI/ConferencePaymentModal";
import MsFormShell from "../../components/conference/MsFormShell";
import FormQuestionCard from "../../components/conference/FormQuestionCard";
import {
  GENDER_OPTIONS,
  LOCATION_REGION_OPTIONS,
  HEARD_ABOUT_OPTIONS,
} from "../../data/conference2026";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone/WhatsApp is required"),
  organization: yup.string().required("Organization/Institution is required"),
  title: yup.string().required("Title/Position is required"),
  locationRegion: yup.string().required("Your location is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  participation: yup.string().required("Participation mode is required"),
  heardAbout: yup.string().required("Please tell us how you heard about this event"),
  heardAboutOther: yup.string().when("heardAbout", {
    is: "Others",
    then: (s) => s.required("Please identify how you heard about this event"),
    otherwise: (s) => s.nullable(),
  }),
  registrationFee: yup.string(),
  paymentTrxId: yup.string(),
  paymentTrxRef: yup.string(),
  // Kept for API compatibility with existing teacher registration flow
  participationCategory: yup.string(),
  categoryOfParticipant: yup.string(),
  paperTitle: yup.string(),
  thematicArea: yup.string(),
  abstract: yup.string(),
  lipanId: yup.string(),
});

type FormValues = yup.InferType<typeof schema>;

const inputClass =
  "w-full rounded-md border border-[#d1d1d1] bg-white px-3 py-2.5 text-sm text-[#242424] outline-none transition focus:border-[#5b5fc7] focus:ring-2 focus:ring-[#5b5fc7]/30";

export default function TeacherRegistrationPage() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: "Nigeria",
      categoryOfParticipant: "School teacher",
      participationCategory: "not-presenting",
      registrationFee: "Teacher - ₦120,000",
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
  const formValues = watch();
  const heardAbout = watch("heardAbout");
  const [showModal, setShowModal] = useState(false);

  const amount = 120_000;
  const currency: "NGN" | "USD" = "NGN";

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
    initializePayment({ onSuccess, onClose: () => {} });
  };

  const radioItem = (name: keyof FormValues, value: string, label: string) => (
    <label
      key={value}
      className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 hover:bg-[#f5f5f5]"
    >
      <input
        type="radio"
        value={value}
        className="h-4 w-4 accent-[#5b5fc7]"
        {...register(name as any)}
      />
      <span className="text-sm text-[#242424]">{label}</span>
    </label>
  );

  return (
    <MsFormShell badge="Teacher Conference Registration">
      <form
        ref={formRef}
        className="space-y-3"
        onSubmit={(e) => e.preventDefault()}
      >
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
          title="Organization/Institution"
          error={errors.organization?.message}
        >
          <input
            className={inputClass}
            placeholder="School / institution name"
            {...register("organization")}
          />
        </FormQuestionCard>

        <FormQuestionCard number={7} title="Title/Position" error={errors.title?.message}>
          <input className={inputClass} placeholder="Your position" {...register("title")} />
        </FormQuestionCard>

        <FormQuestionCard
          number={8}
          title="Your Location"
          error={
            errors.locationRegion?.message ||
            errors.city?.message ||
            errors.country?.message
          }
        >
          <div className="space-y-1">
            {LOCATION_REGION_OPTIONS.map((option) =>
              radioItem("locationRegion", option, option)
            )}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#424242]">
                Country
              </label>
              <input
                className={inputClass}
                placeholder="Country"
                {...register("country")}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#424242]">
                City
              </label>
              <input className={inputClass} placeholder="City" {...register("city")} />
            </div>
          </div>
        </FormQuestionCard>

        <FormQuestionCard
          number={9}
          title="Preferred Mode of Participation"
          error={errors.participation?.message}
        >
          <div className="space-y-1">
            {radioItem("participation", "physical", "Physical")}
            {radioItem("participation", "virtual", "Virtual")}
          </div>
        </FormQuestionCard>

        <FormQuestionCard
          number={10}
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
            number={11}
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

        <FormQuestionCard
          number={heardAbout === "Others" ? 12 : 11}
          title="Registration Checkout"
          required={false}
        >
          <div className="rounded-lg border border-[#e1e1e1] bg-[#fafafa] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#616161]">
                  Teacher conference registration fee
                </p>
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
            <p className="mt-3 text-xs text-[#616161]">
              Please confirm your details before proceeding with payment.
            </p>
          </div>
        </FormQuestionCard>
      </form>

      <PaymentProcessingModal
        isOpen={showModal}
        transactionData={formValues}
        onClose={() => {
          reset();
          setShowModal(false);
        }}
      />
    </MsFormShell>
  );
}
