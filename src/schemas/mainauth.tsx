import * as yup from "yup";

export const signInSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type SignInSchemaType = yup.InferType<typeof signInSchema>;

export const signUpSchema = yup.object({
  title: yup.string().required("Please select your title"),
  gender: yup.string().required("Please select your gender"),
  full_name: yup.string().required("Full Name is required"),
  organization: yup.string().required("Organization is required"),
  mailing_address: yup.string().required("Mailing address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip_code: yup.string(),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  areas_of_interest: yup
    .array()
    .min(1, "Please select at least one area of interest"),
  level_of_learners: yup.string().required("Please select a level of learners"),
  password1: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  password2: yup.string().oneOf([yup.ref("password1")], "Passwords must match"),
  terms: yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

export type SignUpSchemaType = yup.InferType<typeof signUpSchema>;

export const resetSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Provide your email address here"),
});

export type ResetSchemaType = yup.InferType<typeof resetSchema>;

export const resetPasswordSchema = yup.object({
  new_password1: yup
    .string()
    .required("This field is required")
    .min(8, "This field should be at least 8 characters"),
  new_password2: yup
    .string()
    .required("This field is required")
    .oneOf([yup.ref("new_password1")], "Passwords must match"),
});

export type ResetPasswordSchemaType = yup.InferType<typeof resetPasswordSchema>


// Member Dashboard

export const contactAttachmentformats = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const contactAdminSchema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
  attachment: yup
    .mixed()
    .test("fileSize", "The file is too large", (value: any) => {
      return value?.[0]?.size <= 5_000_000 || !value?.length;
    })
    .test("type", "Only image, pdf or docx allowed", (value: any) => {
      return (
        !value?.length || contactAttachmentformats.includes(value?.[0]?.type)
      );
    }),
});

export type ContactAdminSchemaType = yup.InferType<typeof contactAdminSchema>;
