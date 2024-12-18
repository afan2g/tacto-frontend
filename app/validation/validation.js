import { z } from "zod";

export const signUpValidationSchemas = {
  create: z.object({
    emailOrPhone: z
      .string()
      .refine(
        (value) => {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          const phoneRegex = /^\+?[1-9]\d{1,14}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        },
        { message: "Enter a valid email or phone number" }
      )
      .nonempty("Email or phone number is required"),
  }),
  verify: z.object({
    verificationCode: z
      .string()
      .regex(/^\d{6}$/, "Verification code must be 6 digits")
      .nonempty("Verification code is required"),
  }),
  name: z.object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
      .nonempty("Full name is required"),
  }),
  username: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .nonempty("Username is required"),
  }),
  password: z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
};
