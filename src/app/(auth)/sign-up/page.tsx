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
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { Eye, EyeOff, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      .transform((val) => (val.trim() === "" ? undefined : val.trim())),
    displayUsername: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val.trim()))
      .optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
  } = useForm({
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

  const username = watch("username");

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
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="input-name">
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="input-name"
                    aria-invalid={fieldState.invalid}
                  />
                  {errors.name && <FieldError errors={[errors.name]} />}
                </Field>
              )}
            />
            {/* ====================== */}
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="input-username">
                    Username <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="input-username"
                    aria-invalid={fieldState.invalid}
                  />
                  {errors.username && <FieldError errors={[errors.username]} />}
                </Field>
              )}
            />
            {/* ================== */}
            <Controller
              name="displayUsername"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="input-displayUsername">
                    Display username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="input-displayUsername"
                    aria-invalid={fieldState.invalid}
                    placeholder={username ? username : ""}
                  />
                  <FieldDescription>The name other users see</FieldDescription>
                  {errors.displayUsername && (
                    <FieldError errors={[errors.displayUsername]} />
                  )}
                </Field>
              )}
            />
            {/* ====================== */}
            <Field>
              <FieldLabel htmlFor="input-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="input-email"
                  />
                )}
              />
              {errors.email && <FieldError errors={[errors.email]} />}
            </Field>
            {/* ====================== */}
            <Field>
              <FieldLabel htmlFor="input-password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                {
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputGroupInput
                        {...field}
                        id="input-password"
                        aria-invalid={fieldState.invalid}
                        type={showPassword ? "text" : "password"}
                      />
                    )}
                  />
                }
                <InputGroupAddon align="inline-end" className="pr-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription></FieldDescription>
            </Field>
            {/* ====================== */}
            <Field>
              <FieldLabel htmlFor="input-password-confirm">
                Password Confirm <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                {
                  <Controller
                    control={control}
                    name="passwordConfirm"
                    render={({ field, fieldState }) => (
                      <InputGroupInput
                        {...field}
                        id="input-password-confirm"
                        aria-invalid={fieldState.invalid}
                        type={showPassword ? "text" : "password"}
                      />
                    )}
                  />
                }
                <InputGroupAddon align="inline-end" className="pr-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {errors.passwordConfirm && (
                <FieldError errors={[errors.passwordConfirm]} />
              )}
            </Field>
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
