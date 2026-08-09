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
import {
  SignUpFormData,
  SignUpFormOutput,
  SignUpFormSchema,
} from "@/lib/validators";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { CircleSmall, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/inputs";
import { PasswordInput } from "@/components/inputs/password-input";
import { signUpAction } from "./actions";
import { useState, useTransition } from "react";
import { toast } from "@/components/ui/toast";
import { ActionResponse } from "@/types/action";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
    resolver: zodResolver(SignUpFormSchema),
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

  const [isPending, startTransition] = useTransition();
  const [signingUp, setSigningUp] = useState(false);
  const router = useRouter();

  async function onSubmit(data: SignUpFormOutput) {
    const { passwordConfirm, ...signUpData } = data;
    // const signUpPromise = signUpAction(signUpData);

    // toast.promise<ActionResponse>(signUpPromise, {
    //   loading: "Signing up user...",
    //   success: (response) => {
    //     if ("error" in response) {
    //       throw new Error(response.error);
    //     }
    //     return response.success_message;
    //   },
    //   error: (err) => err.message,
    // });

    // startTransition(async () => {
    //   try {
    //     const response = await signUpPromise;
    //     if ("error" in response) {
    //       return;
    //     }

    //     router.push("/");
    //   } catch (error) {
    //     toast.add({
    //       type: "error",
    //       description: "An unknown error happened",
    //     });
    //   }
    // });

    // Better auth client
    try {
      setSigningUp(true);
      const { error } = await authClient.signUp.email({ ...signUpData });
      if (error) {
        toast.add({ type: "error", description: error.message });
        setSigningUp(false);
        return;
      }

      router.push("/");
    } catch (error) {
      setSigningUp(false);
      toast.add({ type: "error", description: "An unknown error happened" });
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
            <FormInput<SignUpFormData>
              formControl={control}
              name="name"
              label="name"
              isRequired={true}
            />
            {/* ====================== */}
            <FormInput<SignUpFormData>
              formControl={control}
              name="username"
              label="username"
              isRequired={true}
            />
            {/* ====================== */}
            <FormInput<SignUpFormData>
              formControl={control}
              name="displayUsername"
              label="display username"
              placeholder={usernameValue}
              description="The name other users see"
            />
            {/* ====================== */}
            <FormInput<SignUpFormData>
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
            <Button disabled={signingUp} className="py-5" type="submit">
              <span>Sign up</span>
              {signingUp ? (
                <Spinner data-icon="inline-end" className="size-4.5" />
              ) : (
                <UserRoundPlus />
              )}
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Separator className="flex-1"></Separator>
            <p className="shrink-0">OR</p>
            <Separator className="flex-1"></Separator>
          </div>
          <GoogleButton />
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
