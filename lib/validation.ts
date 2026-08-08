import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .min(5, "Enter a valid phone number."),
    password: z
      .string()
      .min(6, "Password must have at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const registrationSchema = z
  .object({
    eventSlug: z.string().trim().min(1),
    institutionId: z.string().uuid("Select your institution."),
    classId: z.string().uuid("Select your class."),
    rollNumber: z.string().trim().min(1, "Enter your roll number.").max(40),
    role: z.enum(["team_leader", "team_member", "solo"]),
    teamName: z.string().trim().min(2, "Enter the team or project name.").max(100),
    problemStatement: z.string().trim().max(3000).optional(),
  })
  .superRefine((data, context) => {
    if (
      (data.role === "team_leader" || data.role === "solo") &&
      (!data.problemStatement || data.problemStatement.length < 10)
    ) {
      context.addIssue({
        code: "custom",
        path: ["problemStatement"],
        message: "Describe the problem in at least 10 characters.",
      });
    }
  });
