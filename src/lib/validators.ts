import { z } from "zod";

const minUsernameLength = 3;
const maxUsernameLength = 30;

const baseSchema = z.object({
  name: z.string().min(1, {
    error: "Name is required",
  }),
  email: z.email({
    error: "Enter a valid email",
  }),
  username: z
    .string()
    .min(minUsernameLength, {
      error: `at least ${minUsernameLength} characters`,
    })
    .max(maxUsernameLength, {
      error: `at most ${maxUsernameLength} characters`,
    })
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username can only contain letters, numbers, underscores, and dots",
    )
    .transform((val) => (val.trim() === "" ? null : val.trim())),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { error: "" }),
});

export const SignUpFormSchema = baseSchema
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const SignUpServerSchema = baseSchema;

export type SignUpFormData = z.input<typeof SignUpFormSchema>;
export type SignUpFormOutput = z.output<typeof SignUpFormSchema>;
