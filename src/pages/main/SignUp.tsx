import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiMap,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiGrid,
  FiBook,
  FiLock,
} from "react-icons/fi";
import {
  TextInput,
  Button,
  Select,
  Checkbox,
  Tooltip,
  Card,
  Label,
} from "flowbite-react";
import { useState } from "react";
import { Logo } from "../../components/UI/Logo";
import SpinnerLogo from "../../components/UI/LogoLoader";
import { signUpSchema, SignUpSchemaType } from "../../schemas/mainauth";
import { Register } from "../../utils/api/auth";
import { toast } from "react-toastify";
import { useApp } from "../../hooks/app";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/UI/PasswordInput";

const fieldClass = "mb-4";

function MultiSectionForm() {
  const { areasOfInterest, levelOfLearners } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      areas_of_interest: [],
    },
  });

  const [section, setSection] = useState(0);
  const [sectionLoading, setSectionLoading] = useState(false);

  const sections = [
    {
      label: "Personal information",
      icon: FiUser,
      fields: (
        <>
          <div className={fieldClass}>
            <Label value="Title" className="mb-1 block text-gray-800" />
            <Select
              color={errors.title ? "failure" : undefined}
              {...register("title")}
              helperText={errors.title?.message}
            >
              <option value="">Select title</option>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option>
              <option value="dr">Dr</option>
              <option value="prof">Professor</option>
            </Select>
          </div>
          <div className={`grid gap-4 md:grid-cols-2 ${fieldClass}`}>
            <div>
              <Label value="First name" className="mb-1 block text-gray-800" />
              <TextInput
                {...register("first_name")}
                placeholder="Enter your first name"
                icon={FiUser}
                color={errors.first_name ? "failure" : undefined}
                helperText={errors.first_name?.message}
              />
            </div>
            <div>
              <Label value="Last name" className="mb-1 block text-gray-800" />
              <TextInput
                {...register("last_name")}
                placeholder="Enter your last name"
                icon={FiUser}
                color={errors.last_name ? "failure" : undefined}
                helperText={errors.last_name?.message}
              />
            </div>
          </div>
          <div className={fieldClass}>
            <Label value="Gender" className="mb-1 block text-gray-800" />
            <Select
              color={errors.gender ? "failure" : undefined}
              {...register("gender")}
              helperText={errors.gender?.message}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
          <div className={fieldClass}>
            <Label value="Organization" className="mb-1 block text-gray-800" />
            <TextInput
              {...register("organization")}
              placeholder="Organization name"
              icon={FiUser}
              color={errors.organization ? "failure" : undefined}
              helperText={errors.organization?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Address",
      icon: FiMap,
      fields: (
        <>
          <div className={fieldClass}>
            <Label value="Mailing address" className="mb-1 block text-gray-800" />
            <TextInput
              {...register("mailing_address")}
              placeholder="Street address"
              color={errors.mailing_address ? "failure" : undefined}
              helperText={errors.mailing_address?.message}
            />
          </div>
          <div className={`grid gap-4 md:grid-cols-2 ${fieldClass}`}>
            <div>
              <Label value="City" className="mb-1 block text-gray-800" />
              <TextInput
                {...register("city")}
                placeholder="City"
                color={errors.city ? "failure" : undefined}
                helperText={errors.city?.message}
              />
            </div>
            <div>
              <Label value="State" className="mb-1 block text-gray-800" />
              <TextInput
                {...register("state")}
                placeholder="State"
                color={errors.state ? "failure" : undefined}
                helperText={errors.state?.message}
              />
            </div>
          </div>
          <div className={fieldClass}>
            <Label value="ZIP / postal code" className="mb-1 block text-gray-800" />
            <TextInput
              {...register("zip_code")}
              placeholder="Optional"
              color={errors.zip_code ? "failure" : undefined}
              helperText={errors.zip_code?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Contact details",
      icon: FiPhone,
      fields: (
        <>
          <div className={fieldClass}>
            <Label value="Phone" className="mb-1 block text-gray-800" />
            <TextInput
              {...register("phone")}
              placeholder="+234 ..."
              icon={FiPhone}
              color={errors.phone ? "failure" : undefined}
              helperText={errors.phone?.message}
            />
          </div>
          <div className={fieldClass}>
            <Label value="Email" className="mb-1 block text-gray-800" />
            <TextInput
              {...register("email")}
              placeholder="you@example.com"
              icon={FiMail}
              color={errors.email ? "failure" : undefined}
              helperText={errors.email?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Areas of interest",
      icon: FiGrid,
      fields: (
        <>
          <p className="mb-3 text-sm text-gray-600">
            Select one or more areas that describe your work.
          </p>
          <div
            className={`mb-2 grid gap-3 sm:grid-cols-2 ${
              errors.areas_of_interest ? "rounded-lg ring-1 ring-red-400" : ""
            }`}
          >
            {areasOfInterest.map((interest, index) => (
              <label
                key={interest.id ?? index}
                htmlFor={`checkbox-${index}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 hover:border-blue-400 hover:bg-blue-50"
              >
                <input
                  id={`checkbox-${index}`}
                  type="checkbox"
                  value={interest.id}
                  {...register("areas_of_interest")}
                  className="mt-0.5 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                />
                <span>{interest.name}</span>
              </label>
            ))}
          </div>
          {errors.areas_of_interest && (
            <p className="text-sm text-red-600">
              {errors.areas_of_interest.message}
            </p>
          )}
        </>
      ),
    },
    {
      label: "Level of learners",
      icon: FiBook,
      fields: (
        <div className={fieldClass}>
          <Label value="Level of learners" className="mb-1 block text-gray-800" />
          <Select
            {...register("level_of_learners")}
            helperText={errors.level_of_learners?.message}
            color={errors.level_of_learners ? "failure" : undefined}
          >
            <option value="">Select a level</option>
            {levelOfLearners.map((option, index) => (
              <option key={option.id ?? index} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      label: "Password & agreement",
      icon: FiLock,
      fields: (
        <>
          <div className={fieldClass}>
            <Label value="Password" className="mb-1 block text-gray-800" />
            <PasswordInput
              {...register("password1")}
              placeholder="Create a password"
              error={errors.password1}
            />
          </div>
          <div className={fieldClass}>
            <Label value="Confirm password" className="mb-1 block text-gray-800" />
            <PasswordInput
              {...register("password2")}
              placeholder="Re-enter password"
              error={errors.password2}
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              {...register("terms")}
              color={errors.terms ? "failure" : undefined}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm leading-6 text-gray-700">
              I,{" "}
              <span className="font-semibold text-gray-900">
                {watch("first_name")} {watch("last_name")}
              </span>
              , confirm that I have read and agree to the{" "}
              <Tooltip content="Terms and Conditions" placement="top">
                <span className="cursor-pointer font-semibold text-blue-700 underline">
                  Terms and Conditions
                </span>
              </Tooltip>
              of this platform.
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </>
      ),
    },
  ];

  const onSubmit = async (formData: SignUpSchemaType) => {
    setSectionLoading(true);
    try {
      const { data } = await Register(formData);
      toast.success(data.detail);
      navigate(`/registration-success`);
      reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSectionLoading(false);
    }
  };

  const formSections: (keyof SignUpSchemaType)[][] = [
    ["title", "first_name", "last_name", "gender", "organization"],
    ["mailing_address", "city", "state", "zip_code"],
    ["phone", "email"],
    ["areas_of_interest"],
    ["level_of_learners"],
    ["password1", "password2", "terms"],
  ];

  const nextSection = async () => {
    const isValid = await trigger(formSections[section]);
    if (isValid) {
      setSectionLoading(true);
      setTimeout(() => {
        setSectionLoading(false);
        setSection(section + 1);
      }, 400);
    }
  };

  const prevSection = () => {
    if (section > 0) setSection(section - 1);
  };

  const progress = ((section + 1) / sections.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="mb-6 rounded-xl bg-blue-700 p-3">
        <Logo className="h-14" />
      </div>

      <Card className="relative w-full max-w-2xl !bg-white p-2 shadow-lg sm:p-4">
        {sectionLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-white/80">
            <SpinnerLogo />
          </div>
        )}

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create your LiPAN account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Register for membership with Literacy Promotion Association Nigeria.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center">
            {sections.map((s, index) => (
              <div key={s.label} className="flex min-w-0 flex-1 items-center last:flex-none">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === section
                      ? "bg-blue-700 text-white"
                      : index < section
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                  title={s.label}
                >
                  {index < section ? <FiCheckCircle size={16} /> : index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 min-w-2 flex-1 sm:mx-2 ${
                      index < section ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-800">
            Step {section + 1} of {sections.length}: {sections[section].label}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sections[section].fields}
          </motion.div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
            <Button
              disabled={section === 0}
              onClick={prevSection}
              type="button"
              color="light"
              className={section === 0 ? "invisible" : "visible"}
            >
              <FiArrowLeft className="mr-2 h-5" />
              Back
            </Button>
            {section < sections.length - 1 ? (
              <Button
                onClick={nextSection}
                type="button"
                className="bg-blue-700 hover:bg-blue-800"
              >
                Continue
                <FiArrowRight className="ml-2 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={sectionLoading}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Create account
              </Button>
            )}
          </div>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="font-semibold text-blue-700 underline">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default MultiSectionForm;
