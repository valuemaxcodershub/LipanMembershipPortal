import * as yup from "yup";

export const NotificationsSchema = yup.object({
  send_to: yup.string().required("Audience is required"),
  membership_types: yup.array().when(["audience"], ([audience]) => {
    if (audience === "members") {
      return yup
        .array()
        .default([])
        .min(1, "Select at least 1 membership type")
    }
    return yup.array().notRequired();
  }),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
  is_urgent: yup.boolean().default(false),
});

export type NotificationsType = yup.InferType<typeof NotificationsSchema>;
