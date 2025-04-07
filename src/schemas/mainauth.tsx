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
  email: yup.string().email("Invalid email").required("Email is required"),
  areas_of_interest: yup
    .array()
    .min(1, "Please select at least one area of interest"),
  level_of_learners: yup.string().required("Please select a level of learners"),
  password1: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "Passwords must match"),
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
