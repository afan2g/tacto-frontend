import * as Yup from "yup";

export const signUpValidationSchemas = {
  create: Yup.object().shape({
    emailOrPhone: Yup.string()
      .test("emailOrPhone", "Enter a valid email or phone number", (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      })
      .required("Email or phone number is required"),
  }),
  verify: Yup.object().shape({
    verificationCode: Yup.string()
      .matches(/^\d{6}$/, "Verification code must be 6 digits")
      .required("Verification code is required"),
  }),
  name: Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
      .required("Full name is required"),
  }),
  username: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .matches(
        /^[a-zA-Z0-9_]*$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
  }),
  password: Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  }),
};

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required(
    "Username, email, or phone number is required"
  ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
