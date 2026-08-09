"use client";

import { GoogleButton } from "@/components/auth/googleButton";
import { FormInput, PasswordInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAPIError } from "better-auth/api";
import { Ban, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";

const signInSchema = z.object({
  identifier: string().min(1, { error: "Enter your email or username" }),
  password: string().min(1, { error: "Enter your password" }),
});

export default function SignIn() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [errorState, setErrorState] = useState<string | undefined>("");

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

  async function onSubmit(data: z.output<typeof signInSchema>) {
    setErrorState(undefined);
    const { identifier, password } = data;
    let result = null;

    try {
      setSigningIn(true);
      if (identifier.includes("@")) {
        result = await authClient.signIn.email({
          email: identifier,
          password,
        });
      } else {
        result = await authClient.signIn.username({
          username: identifier,
          password,
        });
      }
      setSigningIn(false);
      if (result.error) {
        toast.add({
          type: "error",
          description: result.error.message,
          positionerProps: {},
        });
        setErrorState(result.error.message);
        return;
      } else {
        toast.add({ type: "success", description: "You're logged in" });
        router.back();
      }
    } catch (error) {
      setSigningIn(false);
      toast.add({ type: "error", description: "An unkown error happened" });
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="sm:max-w-75 flex-1">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormInput
              formControl={control}
              name="identifier"
              label="Email or Username"
              isRequired={true}
            />
            <PasswordInput
              formControl={control}
              name="password"
              label="Password"
              isRequired={true}
            />
            {errorState && (
              <div
                aria-label="authentication error"
                className="w-fit flex items-center gap-1  rounded-md border p-2 text-red-600"
              >
                {errorState}
                <Ban className="size-4" />
              </div>
            )}
            <Button type="submit" disabled={signingIn} className="py-5">
              Sign in
              {signingIn ? (
                <Spinner data-icon="inline-end" className="size-4.5" />
              ) : (
                <LogIn />
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
          <Link href="/forget" className="font-bold hover:underline">
            Forgot password ?
          </Link>
          <p className="flex gap-1">
            <span>Don&apos;t have an account?</span>
            <Link href="/sign-up" className="font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
