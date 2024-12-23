import { z } from "zod";

type ValidationResult = {
  success: boolean;
  error: string | null;
};

const validateUsername = (username: string): ValidationResult => {
  const schema = z
    .string({
      required_error: "username is required",
      invalid_type_error: "username must be a string",
    })
    .trim()
    .toLowerCase()
    .min(3, { message: "username must be at least 3 characters" })
    .max(20, { message: "username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "username must contain only letters, numbers, and underscores",
    });
  const result = schema.safeParse(username);
  return {
    success: result.success,
    error: result.success ? null : result.error.issues[0]?.message,
  };
};

const validateEmail = (email: string): ValidationResult => {
  const schema = z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be a string",
    })
    .trim()
    .email({ message: "email must be a valid email address" });
  const result = schema.safeParse(email);
  return {
    success: result.success,
    error: result.success ? null : result.error.issues[0]?.message,
  };
};

const validatePassword = (password: string): ValidationResult => {
  const schema = z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .trim()
    .min(8, { message: "password must be at least 8 characters" })
    .max(100, { message: "password must be at most 100 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      }
    );
  const result = schema.safeParse(password);
  return {
    success: result.success,
    error: result.success ? null : result.error.issues[0]?.message,
  };
};

export const validateFullName = (fullName: string): ValidationResult => {
  const schema = z
    .string({
      required_error: "full name is required",
      invalid_type_error: "full name must be a string",
    })
    .trim()
    .min(2, { message: "full name must be at least 2 characters" })
    .max(50, { message: "full name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s'-]*$/, {
      message:
        "full name must contain only letters, spaces, hyphens, and apostrophes",
    });
  const result = schema.safeParse(fullName);
  return {
    success: result.success,
    error: result.success ? null : result.error.issues[0]?.message,
  };
};

export const clientValidation = {
  username: validateUsername,
  email: validateEmail,
  password: validatePassword,
  fullName: validateFullName,
} as const;
