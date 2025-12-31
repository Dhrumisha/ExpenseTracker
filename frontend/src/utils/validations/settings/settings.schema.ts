import * as Yup from "yup";

export const ProfileSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    contact: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(8, "Phone number must be at least 8 digits")
        .max(15, "Phone number must not exceed 15 digits"),

    country: Yup.string().required("Country is required"),
    currency: Yup.string().required("Currency is required"),

    theme: Yup.string().oneOf(["light", "dark"]).required(),
    language: Yup.string().required(),
});