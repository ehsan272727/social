"use client";

import { GoogleButton } from "@/components/auth/googleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { CircleSmall, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/inputs";
import { PasswordInput } from "@/components/inputs/password-input";

const FormSchema = z
  .object({
    name: z.string().min(1, {
      error: "Name is required",
    }),
    email: z.email({
      error: "Enter a valid email",
    }),
    username: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val.trim())),
    displayUsername: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val.trim())),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { error: "" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type FormData = z.input<typeof FormSchema>;

interface passwordCheckList {
  length: boolean;
  letters: boolean;
  numbers: boolean;
}

function PasswordCheck({ password }: { password?: string }) {
  let conditions: passwordCheckList = {
    length: false,
    letters: false,
    numbers: false,
  };
  if (password) {
    conditions = {
      length: password.length >= 8,
      numbers: /\d/.test(password),
      letters: /[a-z]/.test(password) && /[A-Z]/.test(password),
    };
  }

  return (
    <ul className="flex flex-col text-xs md:text-sm">
      <li
        className={`flex items-center ${conditions.length ? "text-blue-800" : "text-red-600"}`}
      >
        <CircleSmall className={`size-3.5 md:size-5`} />
        at least 8 characters
      </li>
      <li
        className={`flex items-center ${conditions.numbers ? "text-blue-800" : "text-red-600"}`}
      >
        <CircleSmall className={`size-3.5 md:size-5`} />
        contains numbers
      </li>
      <li
        className={`flex items-center ${conditions.letters ? "text-blue-800" : "text-red-600"}`}
      >
        <CircleSmall className={`size-3.5 md:size-5`} />
        contains upper and lower case letters
      </li>
    </ul>
  );
}

export default function SignUp() {
  const { handleSubmit, control, watch } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      displayUsername: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const usernameValue = watch("username");
  const passwordValue = watch("password");

  function onSubmit(data: z.output<typeof FormSchema>) {
    console.log(data);
  }

  async function handleGoogleSignIn() {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      if (isAPIError(error)) {
        return "an Error happened in sign in";
      }
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="sm:max-w-75 flex-1">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormInput<FormData>
              formControl={control}
              name="name"
              label="name"
              isRequired={true}
            />
            {/* ====================== */}
            <FormInput<FormData>
              formControl={control}
              name="username"
              label="username"
              isRequired={true}
            />
            {/* ====================== */}
            <FormInput<FormData>
              formControl={control}
              name="displayUsername"
              label="display username"
              placeholder={usernameValue}
              description="The name other users see"
            />
            {/* ====================== */}
            <FormInput<FormData>
              formControl={control}
              type="email"
              name="email"
              label="email"
              isRequired={true}
            />
            {/* ====================== */}
            <PasswordInput
              formControl={control}
              name="password"
              isRequired={true}
              label="Password"
              description={<PasswordCheck password={passwordValue} />}
            />
            {/* ====================== */}
            <PasswordInput
              formControl={control}
              name="passwordConfirm"
              isRequired={true}
              label="Password Confirm"
              description=""
            />
            {/* ====================== */}
            <Button className="py-5" type="submit">
              <span>Sign up</span>
              <UserRoundPlus />
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Separator className="flex-1"></Separator>
            <p className="shrink-0">OR</p>
            <Separator className="flex-1"></Separator>
          </div>
          <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="flex gap-1">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
